import json
import httpx

from evaluation.configs.ai_config import OLLAMA_BASE_URL, LLM_MODEL


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
- Do NOT copy the example scores.
- The scores must reflect your actual evaluation.
- A correct solution should receive high scores.
- A partially correct solution should receive intermediate scores.
- An incorrect solution should receive low scores.
- Judge the candidate against the problem, not just against the reference wording.
- A valid alternative algorithm should NOT be penalized simply because it differs from the reference solution.

Also provide:
- reasoning: short explanation of the evaluation
- errors: list of detected problems

Return ONLY valid JSON in this format:

Return ONLY valid JSON in this format:

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
Each <score> must be an integer from 0 to 100.
Do not copy placeholder values from this example.
Do not use the same score for every dimension unless the candidate genuinely deserves the same score on every dimension.
Evaluate each dimension independently.
"""

    try:
        response = httpx.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": LLM_MODEL,
                "prompt": prompt,
                "stream": False,
                "think": False,
                "format": "json"
            },
            timeout=120
        )

        response.raise_for_status()

        result = response.json()

    except httpx.TimeoutException:
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
            "reasoning": "The LLM request timed out.",
            "errors": ["LLM request timed out"]
        }

    except httpx.HTTPStatusError:
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
            "reasoning": "The LLM API returned an HTTP error.",
            "errors": ["LLM API error"]
        }

    try:
        return json.loads(result["response"])
    except (json.JSONDecodeError, TypeError):
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
            "reasoning": "The LLM returned malformed JSON.",
            "errors": ["Malformed LLM JSON response"]
        }