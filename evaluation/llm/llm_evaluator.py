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

Give each score from 0 to 10.

Also provide:
- reasoning: short explanation of the evaluation
- errors: list of detected problems

Return ONLY valid JSON in this format:

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
  "reasoning": "",
  "errors": []
}}
"""

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

    return json.loads(result["response"])