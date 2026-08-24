import json

from evaluation.llm.ollama_client import generate_evaluation


def evaluate_with_llm(
    candidate_features: dict,
    problem: dict
) -> dict:

    prompt = f"""
You are evaluating a programming logic explanation.

Problem:
{problem}

Candidate answer:
{candidate_features["normalized_answer"]}

Detected concepts:
{candidate_features["concepts_detected"]}

Extracted reasoning:
{candidate_features["reasoning"]}

Complexity claim:
{candidate_features["complexity_claim"]}

Evaluate the candidate on these dimensions:

1. algorithm_correctness
2. logical_reasoning
3. concept_coverage
4. completeness
5. data_structure_usage
6. complexity
7. edge_cases

Score each dimension from 0 to 100 based on the candidate answer.

Important:
- Do NOT copy example scores.
- The scores must reflect your actual evaluation.
- A correct solution should receive high scores.
- A partially correct solution should receive intermediate scores.
- An incorrect solution should receive low scores.
- Judge the candidate against the problem, not just against reference wording.
- A valid alternative algorithm should NOT be penalized simply because it
  differs from a reference solution.
- Evaluate algorithm correctness independently from complexity.
- Evaluate edge-case handling independently from algorithm correctness.
- Do not assume that a solution is incorrect simply because it uses a
  different algorithm or data structure.
- Do not reward verbosity.
- Do not penalize concise but logically correct answers.

Evaluate each dimension independently.

Return ONLY valid JSON in this exact format:

{{
  "scores": {{
    "algorithm_correctness": <score>,
    "logical_reasoning": <score>,
    "concept_coverage": <score>,
    "completeness": <score>,
    "data_structure_usage": <score>,
    "complexity": <score>,
    "edge_cases": <score>
  }},
  "reasoning": "<short explanation>",
  "errors": []
}}

Rules:

- Each score must be an integer from 0 to 100.
- Do not use placeholder values.
- Do not use the same score for every dimension unless justified.
- Evaluate every dimension independently.
- Return no markdown.
- Return no text outside the JSON object.
"""

    # --------------------------------------------------
    # Call Ollama through the central Ollama client
    # --------------------------------------------------

    try:

        result = generate_evaluation(prompt)

        evaluation = result.get(
            "evaluation",
            {}
        )

    except Exception as error:

        return {
            "scores": {
                "algorithm_correctness": 0,
                "logical_reasoning": 0,
                "concept_coverage": 0,
                "completeness": 0,
                "data_structure_usage": 0,
                "complexity": 0,
                "edge_cases": 0
            },
            "reasoning": "The LLM request failed.",
            "errors": [str(error)]
        }

    # --------------------------------------------------
    # Validate returned evaluation
    # --------------------------------------------------

    if not isinstance(evaluation, dict):

        return {
            "scores": {
                "algorithm_correctness": 0,
                "logical_reasoning": 0,
                "concept_coverage": 0,
                "completeness": 0,
                "data_structure_usage": 0,
                "complexity": 0,
                "edge_cases": 0
            },
            "reasoning": "The LLM returned an invalid evaluation.",
            "errors": ["Invalid LLM evaluation format"]
        }

    scores = evaluation.get(
        "scores",
        {}
    )

    required_scores = [
        "algorithm_correctness",
        "logical_reasoning",
        "concept_coverage",
        "completeness",
        "data_structure_usage",
        "complexity",
        "edge_cases"
    ]

    # --------------------------------------------------
    # Validate scores
    # --------------------------------------------------

    for score_name in required_scores:

        if score_name not in scores:

            scores[score_name] = 0

        try:

            scores[score_name] = int(
                scores[score_name]
            )

        except (ValueError, TypeError):

            scores[score_name] = 0

        scores[score_name] = max(
            0,
            min(
                100,
                scores[score_name]
            )
        )

    # --------------------------------------------------
    # Return clean evaluation
    # --------------------------------------------------

    return {
        "scores": scores,
        "reasoning": evaluation.get(
            "reasoning",
            "No reasoning provided."
        ),
        "errors": evaluation.get(
            "errors",
            []
        )
    }