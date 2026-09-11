import {
  countInterviewsByCandidateAndStatus,
  findInterviewById,
  findInterviewWithQuestions,
  findInterviewsByCandidate,
  updateInterviewStatus,
} from '../repositories/interview.repository.js'

import {
  createSession,
  findSessionByInterviewId,
  updateInterviewQuestionStatus,
} from '../repositories/session.repository.js'

import { createMessage } from '../repositories/message.repository.js'

import { buildOpeningMessage } from './ai.service.js'

import { NotFoundError, ForbiddenError, ConflictError } from '../utils/app-error.js'

import type { InterviewStatus } from '../generated/prisma/enums.js'

export const listCandidateInterviews = async (
  candidateId: string,
  status?: InterviewStatus,
) => {
  const interviews = await findInterviewsByCandidate(candidateId, status)

  return interviews.map((interview: Awaited<ReturnType<typeof findInterviewsByCandidate>>[number]) => ({
    id: interview.id,
    title: interview.title,
    type: interview.type,
    company: interview.company,
    topics: interview.focusAreas,
    scheduledAt: interview.scheduledAt,
    duration: interview.duration,
    status: interview.status,
    score: interview.evaluation?.overallScore ?? null,
  }))
}

export const getCandidateInterview = async (
  candidateId: string,
  interviewId: string,
) => {
  const interview = await findInterviewById(interviewId)

  if (!interview) {
    throw new NotFoundError('Interview not found')
  }

  if (interview.candidateId !== candidateId) {
    throw new ForbiddenError('This interview does not belong to you')
  }

  return {
    id: interview.id,
    title: interview.title,
    type: interview.type,
    company: interview.company,
    topics: interview.focusAreas,
    scheduledAt: interview.scheduledAt,
    duration: interview.duration,
    status: interview.status,
    score: interview.evaluation?.overallScore ?? null,
    sessionId: interview.session?.id ?? null,
  }
}

export const startInterview = async (
  candidateId: string,
  interviewId: string,
) => {
  const interview = await findInterviewWithQuestions(interviewId)

  if (!interview) {
    throw new NotFoundError('Interview not found')
  }

  if (interview.candidateId !== candidateId) {
    throw new ForbiddenError('This interview does not belong to you')
  }

  if (interview.status === 'COMPLETED') {
    throw new ConflictError('This interview has already been completed')
  }

  if (interview.status === 'EXPIRED' || interview.status === 'CANCELLED') {
    throw new ConflictError('This interview is no longer available')
  }

  const existingSession = await findSessionByInterviewId(interviewId)

  if (existingSession) {
    return {
      sessionId: existingSession.id,
      status: existingSession.status,
      startedAt: existingSession.startedAt,
      currentQuestionId: existingSession.currentQuestionId,
    }
  }

  const firstQuestion = interview.questions[0]?.question ?? null

  const session = await createSession({
    interviewId,
    candidateId,
    currentQuestionId: firstQuestion?.id ?? null,
  })

  await updateInterviewStatus(interviewId, 'IN_PROGRESS')

  if (firstQuestion) {
    await updateInterviewQuestionStatus(interviewId, firstQuestion.id, 'CURRENT')

    await createMessage({
      sessionId: session.id,
      questionId: firstQuestion.id,
      sender: 'AI',
      message: buildOpeningMessage(firstQuestion),
    })
  }

  return {
    sessionId: session.id,
    status: session.status,
    startedAt: session.startedAt,
    currentQuestionId: session.currentQuestionId,
  }
}

export const getCandidateInterviewStats = async (candidateId: string) => {
  const [total, completed, upcoming, inProgress] = await Promise.all([
    findInterviewsByCandidate(candidateId).then((list) => list.length),
    countInterviewsByCandidateAndStatus(candidateId, 'COMPLETED'),
    countInterviewsByCandidateAndStatus(candidateId, 'SCHEDULED'),
    countInterviewsByCandidateAndStatus(candidateId, 'IN_PROGRESS'),
  ])

  return { total, completed, upcoming, inProgress }
}
