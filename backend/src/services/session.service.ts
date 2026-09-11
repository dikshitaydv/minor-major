import {
  findSessionById,
  updateSessionCurrentQuestion,
  upsertQuestionAttempt,
  updateInterviewQuestionStatus,
  countMessagesForQuestion,
  endSession as endSessionRepo,
} from "../repositories/session.repository.js";

import {
  createMessage,
  findMessagesBySession,
} from "../repositories/message.repository.js";

import { updateInterviewStatus } from "../repositories/interview.repository.js";

import { createEvaluation } from "../repositories/evaluation.repository.js";

import { evaluateFinal, evaluateTurn } from "./evaluation.client.js";

import { shouldAdvanceQuestion } from "./ai.service.js";

import type { SendMessageInput } from "../validators/session.validator.js";

import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../utils/app-error.js";

type OwnedSession = Awaited<ReturnType<typeof findSessionById>>;
type InterviewQuestionWithQuestion =
  NonNullable<OwnedSession>["interview"]["questions"][number];

const assertOwnedSession = async (candidateId: string, sessionId: string) => {
  const session = await findSessionById(sessionId);

  if (!session) {
    throw new NotFoundError("Interview session not found");
  }

  if (session.candidateId !== candidateId) {
    throw new ForbiddenError("This interview session does not belong to you");
  }

  return session;
};

export const getSessionDetail = async (
  candidateId: string,
  sessionId: string,
) => {
  const session = await assertOwnedSession(candidateId, sessionId);

  const questions = session.interview.questions.map(
    ({ question, status, order }: InterviewQuestionWithQuestion) => ({
      id: question.id,
      title: question.title,
      difficulty: question.difficulty,
      topics: question.topics,
      description: question.description,
      examples: question.examples,
      constraints: question.constraints,
      status,
      order,
    }),
  );

  return {
    session: {
      id: session.id,
      status: session.status,
      duration: session.interview.duration * 60,
      startedAt: session.startedAt,
      currentQuestionId: session.currentQuestionId,
    },
    questions,
  };
};

export const getSessionMessages = async (
  candidateId: string,
  sessionId: string,
) => {
  await assertOwnedSession(candidateId, sessionId);

  const messages = await findMessagesBySession(sessionId);

  return messages.map(
    (message: Awaited<ReturnType<typeof findMessagesBySession>>[number]) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      questionId: message.questionId,
      createdAt: message.createdAt,
    }),
  );
};

export const sendCandidateMessage = async (
  candidateId: string,
  sessionId: string,
  input: SendMessageInput,
) => {
  const session = await assertOwnedSession(candidateId, sessionId);

  if (session.status !== "IN_PROGRESS") {
    throw new ConflictError("This interview session has already ended");
  }

  const orderedQuestions = session.interview.questions;

  const currentIndex = orderedQuestions.findIndex(
    (interviewQuestion: InterviewQuestionWithQuestion) =>
      interviewQuestion.question.id === input.questionId,
  );

  if (currentIndex === -1) {
    throw new NotFoundError("Question not found on this interview");
  }

  // 1. Save the candidate's message.
  const candidateMessage = await createMessage({
    sessionId,
    questionId: input.questionId,
    sender: "CANDIDATE",
    message: input.message,
  });

  const currentQuestion = orderedQuestions[currentIndex]?.question;

  if (!currentQuestion) {
    throw new NotFoundError("Question not found on this interview");
  }

  const evaluation = await evaluateTurn({
    problem: {
      id: input.questionId,
      title: currentQuestion.title,
      description: currentQuestion.description,
    },
    candidateAnswer: input.message,
    history: (await findMessagesBySession(sessionId)).map((message) => ({
      sender: message.sender,
      message: message.message,
      questionId: message.questionId,
    })),
  });

  await upsertQuestionAttempt({
    sessionId,
    questionId: input.questionId,
    candidateId,
    status: "CURRENT",
  });

  // 2. Decide whether to move on (this is where the adaptive engine /
  //    concept-extraction pipeline will eventually plug in).
  const candidateMessageCount = await countMessagesForQuestion(
    sessionId,
    input.questionId,
  );

  const advance = shouldAdvanceQuestion(candidateMessageCount);

  let aiText: string = evaluation.message;
  let nextQuestionId: string | null = session.currentQuestionId;

  if (advance) {
    await upsertQuestionAttempt({
      sessionId,
      questionId: input.questionId,
      candidateId,
      status: "COMPLETED",
    });
    await updateInterviewQuestionStatus(
      session.interview.id,
      input.questionId,
      "COMPLETED",
    );

    const nextQuestion = orderedQuestions[currentIndex + 1]?.question ?? null;

    if (nextQuestion) {
      await updateInterviewQuestionStatus(
        session.interview.id,
        nextQuestion.id,
        "CURRENT",
      );
      await updateSessionCurrentQuestion(sessionId, nextQuestion.id);

      nextQuestionId = nextQuestion.id;
    } else {
      nextQuestionId = null;
    }
  }

  const aiMessage = await createMessage({
    sessionId,
    questionId: nextQuestionId ?? input.questionId,
    sender: "AI",
    message: aiText,
  });

  return {
    candidateMessage: {
      id: candidateMessage.id,
      sender: candidateMessage.sender,
      message: candidateMessage.message,
      questionId: candidateMessage.questionId,
      createdAt: candidateMessage.createdAt,
    },
    aiMessage: {
      id: aiMessage.id,
      sender: aiMessage.sender,
      message: aiMessage.message,
      questionId: aiMessage.questionId,
      createdAt: aiMessage.createdAt,
    },
    currentQuestionId: nextQuestionId,
  };
};

export const endInterviewSession = async (
  candidateId: string,
  sessionId: string,
) => {
  const session = await assertOwnedSession(candidateId, sessionId);

  if (session.status === "COMPLETED") {
    throw new ConflictError("This interview session has already ended");
  }

  const endedAt = new Date();
  const durationSeconds = Math.max(
    0,
    Math.floor((endedAt.getTime() - session.startedAt.getTime()) / 1000),
  );

  await endSessionRepo(sessionId, {
    status: "COMPLETED",
    endedAt,
    durationSeconds,
  });

  await updateInterviewStatus(session.interview.id, "COMPLETED");

  const messages = await findMessagesBySession(sessionId);
  const finalEvaluation = await evaluateFinal({
    problem: {
      id: session.interview.questions[0]?.question.id || session.interview.id,
      title:
        session.interview.questions[0]?.question.title ||
        session.interview.title,
      description: session.interview.questions[0]?.question.description || "",
    },
    candidateAnswer: messages
      .filter((message) => message.sender === "CANDIDATE")
      .map((message) => message.message)
      .join("\n\n"),
    history: messages.map((message) => ({
      sender: message.sender,
      message: message.message,
      questionId: message.questionId,
    })),
  });

  const scores = finalEvaluation.evaluation?.scores || {};
  const score = (name: string) => scores[name]?.score ?? 0;
  const overallScore = finalEvaluation.overallScore ?? 0;

  await createEvaluation({
    interviewId: session.interview.id,
    sessionId,
    candidateId,
    overallScore,
    algorithmCorrectness: score("algorithm_correctness"),
    logicalReasoning: score("logical_reasoning"),
    conceptCoverage: score("concept_coverage"),
    completeness: score("completeness"),
    dataStructure: score("data_structure"),
    complexity: score("complexity"),
    edgeCases: score("edge_cases"),
    strengths: [],
    improvements: [],
    feedback: finalEvaluation.evaluation?.reasoning || "",
  });

  return {
    message: "Interview completed successfully",
    durationSeconds,
    overallScore,
  };
};
