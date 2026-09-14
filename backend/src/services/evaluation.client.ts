const EVALUATION_SERVICE_URL =
  process.env.EVALUATION_SERVICE_URL || "http://127.0.0.1:8000";

type EvaluationRequest = {
  problem: Record<string, unknown>;
  candidateAnswer: unknown;
  history: Array<Record<string, unknown>>;
};

const describeValue = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

/**
 * Normalize the candidate answer at the final backend → AI boundary.
 *
 * Supported forms:
 * - "answer"
 * - { message: "answer" }
 * - { content: "answer" }
 * - { text: "answer" }
 * - { answer: "answer" }
 * - nested message objects
 * - arrays containing one of the supported forms
 */
const normalizeCandidateAnswer = (
  value: unknown,
  path = "candidateAnswer",
): string => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      try {
        return normalizeCandidateAnswer(
          value[index],
          `${path}[${index}]`,
        );
      } catch {
        // Try the next array item.
      }
    }

    throw new Error(
      `Candidate answer must be a string. Received an array with no string answer.\n` +
        `Path: ${path}\n` +
        `Value: ${describeValue(value)}`,
    );
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    const directKeys = [
      "message",
      "content",
      "text",
      "answer",
    ] as const;

    for (const key of directKeys) {
      const candidate = obj[key];

      if (typeof candidate === "string") {
        return candidate;
      }
    }

    // Recursively handle nested message/content/text/answer objects.
    for (const key of directKeys) {
      const candidate = obj[key];

      if (
        candidate &&
        typeof candidate === "object"
      ) {
        try {
          return normalizeCandidateAnswer(
            candidate,
            `${path}.${key}`,
          );
        } catch {
          // Try the next supported key.
        }
      }
    }
  }

  throw new Error(
    `Candidate answer must be a string.\n` +
      `Path: ${path}\n` +
      `Type: ${typeof value}\n` +
      `Value: ${describeValue(value)}`,
  );
};

const requestEvaluation = async (
  path: string,
  input: EvaluationRequest,
) => {
  console.log(
    "\n========== EVALUATION DEBUG ==========",
  );

  console.log(
    "[EVALUATION DEBUG] endpoint:",
    path,
  );

  console.log(
    "[EVALUATION DEBUG] candidateAnswer type:",
    typeof input.candidateAnswer,
  );

  console.log(
    "[EVALUATION DEBUG] candidateAnswer value:",
    describeValue(input.candidateAnswer),
  );

  console.log(
    "[EVALUATION DEBUG] candidateAnswer isArray:",
    Array.isArray(input.candidateAnswer),
  );

  console.log(
    "======================================\n",
  );

  const candidateAnswer = normalizeCandidateAnswer(
    input.candidateAnswer,
  );

  console.log(
    "[EVALUATION DEBUG] normalized candidateAnswer type:",
    typeof candidateAnswer,
  );

  console.log(
    "[EVALUATION DEBUG] normalized candidateAnswer:",
    JSON.stringify(candidateAnswer),
  );

  if (path !== "/v1/evaluate/opening" && path !== "/v1/evaluate/final" && !candidateAnswer.trim()) {
    throw new Error("Candidate answer cannot be empty.");
  }

  const response = await fetch(`${EVALUATION_SERVICE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem: input.problem,
      candidate_answer: candidateAnswer,
      history: input.history,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(
      payload.detail || "Evaluation service request failed",
    );
  }

  return payload.data;
};

export const evaluateTurn = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/turn", input);

export const evaluateOpening = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/opening", input);

export const evaluateFinal = (input: EvaluationRequest) =>
  requestEvaluation("/v1/evaluate/final", input);
