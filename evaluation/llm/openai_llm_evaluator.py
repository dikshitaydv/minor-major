from evaluation.llm.openai_client import (
    generate_openai_evaluation
)


def evaluate_with_openai(
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

Evaluate the candidate independently on these seven dimensions:

1. algorithm_correctness
2. logical_reasoning
3. concept_coverage
4. completeness
5. data_structure_usage
6. complexity
7. edge_cases

Score each dimension from 0 to 100.

Scoring guidance:

90-100:
Excellent / essentially fully correct

75-89:
Strong with minor limitations

50-74:
Partially correct or significant weakness

25-49:
Major problems

0-24:
Fundamentally incorrect or absent

Important rules:

- Judge the candidate against the actual problem.
- Do not judge correctness based only on wording similarity.
- A valid alternative algorithm must receive credit even if it differs
  from the reference approach.
- Evaluate algorithm correctness separately from complexity.
- A correct algorithm can have an incorrect complexity claim.
- Evaluate edge cases independently.
- Missing edge cases should lower the edge_cases score.
- Do not automatically mark the whole algorithm incorrect because of
  missing edge cases.
- Do not reward verbosity.
- Do not penalize concise but correct reasoning.
- Evaluate every dimension independently.
- Do not give identical scores to all dimensions unless justified.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "scores": {{
        "algorithm_correctness": 0,
        "logical_reasoning": 0,
        "concept_coverage": 0,
        "completeness": 0,
        "data_structure_usage": 0,
        "complexity": 0,
        "edge_cases": 0
    }},
    "reasoning": "Short explanation of the evaluation.",
    "errors": []
}}

Rules for the JSON:

- Every score must be an integer from 0 to 100.
- Evaluate each score independently.
- Do not use placeholder scores.
- Do not return markdown.
- Do not return text outside the JSON object.
"""

    try:

        result = generate_openai_evaluation(
            prompt
        )

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
            "reasoning": "The OpenAI request failed.",
            "errors": [str(error)]
        }

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
            "reasoning": "OpenAI returned an invalid evaluation.",
            "errors": [
                "Invalid OpenAI evaluation format"
            ]
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