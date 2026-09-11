const EVALUATION_SERVICE_URL =
  process.env.EVALUATION_SERVICE_URL || "http://127.0.0.1:8000";

type EvaluationRequest = {
  problem: Record<string, unknown>;
  candidateAnswer: string;
  history: Array<Record<string, unknown>>;
};

const requestEvaluation = async (path: string, input: EvaluationRequest) => {
  const response = await fetch(`${EVALUATION_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      problem: input.problem,
      candidate_answer: input.candidateAnswer,
      history: input.history,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.detail || "Evaluation service request failed");
  }

  return payload.data;
};

export const evaluateTurn = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/turn", input);

export const evaluateOpening = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/opening", input);

export const evaluateFinal = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/final", input);
