import json

from evaluation.llm.ollama_client import generate_evaluation


def evaluate_with_llm(
    candidate_features: dict,
    problem: dict
) -> dict:

    prompt = f"""
You are an AI coding interview evaluator.

Your task is to evaluate the candidate's response to the given
programming problem using the seven evaluation dimensions defined below.

==================================================
PROBLEM
==================================================

{problem}

==================================================
CANDIDATE ANSWER
==================================================

{candidate_features["normalized_answer"]}

==================================================
EXTRACTED CANDIDATE INFORMATION
==================================================

Detected concepts:
{candidate_features["concepts_detected"]}

Extracted reasoning:
{candidate_features["reasoning"]}

Complexity claim:
{candidate_features["complexity_claim"]}

==================================================
EVALUATION DIMENSIONS
==================================================

Evaluate the candidate independently on all seven dimensions:

1. Algorithm Correctness
   Measures whether the proposed algorithm correctly solves the problem.

2. Logical Reasoning
   Measures whether the candidate provides logically valid reasoning
   and justifies the solution approach.

3. Concept Coverage
   Measures how well the candidate demonstrates and applies the concepts
   required to solve the problem.

4. Completeness
   Measures whether all essential parts of the solution are addressed.

5. Data Structure
   Measures whether appropriate data structures are selected and
   correctly used.

6. Complexity
   Measures the correctness of the candidate's time and space complexity
   analysis.

7. Edge Cases
   Measures whether relevant boundary and special cases are identified
   and handled.

==================================================
IMPORTANT EVALUATION RULES
==================================================

1. Score every dimension independently.

2. Every assessed score must be an integer from 0 to 100.

3. Do NOT copy example scores.

4. Do NOT give the same score to every dimension unless the candidate's
   response genuinely justifies it.

5. Judge the candidate against the actual problem.

6. A valid alternative algorithm must NOT be penalized simply because
   it differs from a reference solution.

7. Algorithm correctness and optimization are different concepts.

   A solution can be algorithmically correct even if it is not the
   most optimal solution.

   For example, an O(n^2) solution may still be correct for a problem
   whose optimal solution is O(n).

8. Complexity must therefore be evaluated separately from algorithm
   correctness.

9. Edge-case handling must be evaluated separately from algorithm
   correctness.

10. Do not assume a solution is incorrect simply because it uses a
    different algorithm or data structure.

11. Do not reward verbosity.

12. Do not penalize a concise answer when it contains sufficient
    logically correct information.

13. Evaluate only evidence actually present in the candidate's response.

14. Do NOT invent candidate reasoning, complexity analysis,
    data structures, or edge cases that the candidate did not provide.

==================================================
ASSESSMENT STATUS
==================================================

Each dimension must have one of two statuses:

ASSESSED
NOT_ASSESSED

Use:

ASSESSED
---------
when the candidate has provided enough evidence to evaluate that
dimension.

NOT_ASSESSED
------------
when the candidate has not provided enough evidence to evaluate that
dimension.

IMPORTANT:

NOT_ASSESSED does NOT mean the candidate performed poorly.

It means there is insufficient evidence to make an evaluation.

For NOT_ASSESSED dimensions:

- score MUST be null
- assessment_status MUST be "NOT_ASSESSED"
- evidence MUST explain why the dimension cannot currently be assessed

For ASSESSED dimensions:

- score MUST be an integer from 0 to 100
- assessment_status MUST be "ASSESSED"
- evidence MUST explain the basis for the score

Never assign a score of 0 merely because the candidate did not discuss
a dimension.

==================================================
EVIDENCE REQUIREMENTS
==================================================

Evidence must be specific to the candidate's response.

Good evidence:

"The candidate uses a HashMap to store previously seen values and
checks target minus the current value."

Bad evidence:

"The candidate has a good solution."

Evidence should explain WHY the dimension received its score.

Do not invent information that is not present in the candidate answer.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do not return Markdown.

Do not return explanations outside the JSON object.

Use exactly this structure:

{{
  "scores": {{
    "algorithm_correctness": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "logical_reasoning": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "concept_coverage": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "completeness": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "data_structure": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "complexity": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }},

    "edge_cases": {{
      "score": <integer or null>,
      "assessment_status": "ASSESSED" or "NOT_ASSESSED",
      "evidence": "<specific evidence>"
    }}
  }}
}}

==================================================
FINAL VALIDATION BEFORE RETURNING
==================================================

Before returning the JSON, verify:

- All seven dimensions are present.
- Every dimension contains score, assessment_status, and evidence.
- ASSESSED dimensions have integer scores from 0 to 100.
- NOT_ASSESSED dimensions have score = null.
- assessment_status is exactly either ASSESSED or NOT_ASSESSED.
- Evidence is not empty.
- No dimension was evaluated using information the candidate did not provide.
- Algorithm correctness was evaluated independently from complexity.
- Edge cases were evaluated independently from algorithm correctness.
- The response contains ONLY the JSON object.
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
                "algorithm_correctness": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "logical_reasoning": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "concept_coverage": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "completeness": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "data_structure": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "complexity": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                },
                "edge_cases": {
                    "score": None,
                    "assessment_status": "NOT_ASSESSED",
                    "evidence": "The LLM evaluation request failed."
                }
            },
            "errors": [str(error)]
        }

    # --------------------------------------------------
    # Validate returned evaluation
    # --------------------------------------------------

    if not isinstance(evaluation, dict):

        return {
            "scores": {},
            "errors": ["Invalid LLM evaluation format"]
        }

    scores = evaluation.get(
        "scores",
        {}
    )

    if not isinstance(scores, dict):

        return {
            "scores": {},
            "errors": ["Missing or invalid scores object"]
        }

    # --------------------------------------------------
    # Required dimensions
    # --------------------------------------------------

    required_scores = [
        "algorithm_correctness",
        "logical_reasoning",
        "concept_coverage",
        "completeness",
        "data_structure",
        "complexity",
        "edge_cases"
    ]

    # --------------------------------------------------
    # Validate each dimension
    # --------------------------------------------------

    for score_name in required_scores:

        if score_name not in scores:

            scores[score_name] = {
                "score": None,
                "assessment_status": "NOT_ASSESSED",
                "evidence": "No evaluation was returned for this dimension."
            }

            continue

        dimension = scores[score_name]

        if not isinstance(dimension, dict):

            scores[score_name] = {
                "score": None,
                "assessment_status": "NOT_ASSESSED",
                "evidence": "Invalid dimension evaluation returned by the LLM."
            }

            continue

        assessment_status = dimension.get(
            "assessment_status",
            "NOT_ASSESSED"
        )

        evidence = dimension.get(
            "evidence",
            ""
        )

        # Normalize invalid assessment status.
        if assessment_status not in [
            "ASSESSED",
            "NOT_ASSESSED"
        ]:
            assessment_status = "NOT_ASSESSED"

        # ----------------------------------------------
        # NOT_ASSESSED
        # ----------------------------------------------

        if assessment_status == "NOT_ASSESSED":

            dimension["score"] = None
            dimension["assessment_status"] = "NOT_ASSESSED"

            if not isinstance(evidence, str) or not evidence.strip():

                dimension["evidence"] = (
                    "Insufficient evidence was provided by the candidate "
                    "to assess this dimension."
                )

            continue

        # ----------------------------------------------
        # ASSESSED
        # ----------------------------------------------

        score = dimension.get("score")

        try:

            if not isinstance(score, (str, int, float, bool, bytes, bytearray)):

                raise ValueError

            score = int(score)

        except (ValueError, TypeError):

            dimension["score"] = None
            dimension["assessment_status"] = "NOT_ASSESSED"
            dimension["evidence"] = (
                "The LLM returned an invalid score for this dimension."
            )

            continue

        score = max(
            0,
            min(
                100,
                score
            )
        )

        dimension["score"] = score
        dimension["assessment_status"] = "ASSESSED"

        if not isinstance(evidence, str) or not evidence.strip():

            dimension["evidence"] = (
                "No specific evidence was provided by the LLM."
            )

    # --------------------------------------------------
    # Return clean evaluation
    # --------------------------------------------------

    return {
        "scores": scores,
        "errors": evaluation.get(
            "errors",
            []
        )
    }