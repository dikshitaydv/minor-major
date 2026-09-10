import json

from evaluation.configs.ai_config import REFERENCE_MATCHER_MODEL
from evaluation.dataset_loader import load_reference_solution
from evaluation.llm.ollama_client import (
    generate_structured_json
)


# ============================================================
# STAGE 1 — REFERENCE IDENTIFICATION SCHEMA
# ============================================================

MATCH_REFERENCE_SCHEMA = {
    "type": "object",
    "properties": {
        "reference_id": {
            "type": ["string", "null"]
        }
    },
    "required": [
        "reference_id"
    ],
    "additionalProperties": False
}


# ============================================================
# STAGE 2 — CONFIDENCE SCHEMA
# ============================================================

MATCH_CONFIDENCE_SCHEMA = {
    "type": "object",
    "properties": {
        "match_confidence": {
            "type": ["number", "null"]
        }
    },
    "required": [
        "match_confidence"
    ],
    "additionalProperties": False
}


# ============================================================
# STAGE 1 — REFERENCE IDENTIFICATION PROMPT
# ============================================================

def _build_reference_identification_prompt(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> str:
    """
    Stage 1:
    Identify the CURRENT reference solution that best matches
    the candidate's communicated approach.

    Only the fields needed for reference identification are supplied
    to the model to keep the prompt small and reliable.
    """

    reference_fields = (
        "Reference ID",
        "Expected Approach",
        "Expected Data Structures",
        "Time Complexity",
        "Space Complexity",
        "Solution Type",
        "Optimization Goal",
    )

    compact_references = [
        {
            field: reference.get(field)
            for field in reference_fields
        }
        for reference in reference_solutions
    ]

    return f"""
You are a reference-solution matcher for a coding interview
evaluation system.

Your ONLY task is to identify the CURRENT reference solution that
best matches the candidate's communicated approach.

Do NOT evaluate correctness.
Do NOT score the candidate.
Do NOT select an optimal target.
Do NOT solve the problem.

============================================================
CANDIDATE NLP STATE
============================================================

{json.dumps(candidate_state, ensure_ascii=False, indent=2)}

============================================================
REFERENCE SOLUTIONS
============================================================

{json.dumps(compact_references, ensure_ascii=False, indent=2)}

============================================================
MATCHING RULES
============================================================

1. Match the candidate's semantic APPROACH first.

2. Use data structures, algorithms, operations, complexity,
   reasoning, concepts, and optimization as supporting evidence.

3. Semantically equivalent wording should be treated as equivalent.

4. Do not require exact textbook terminology.

5. Do not invent information that the candidate did not provide.

6. A valid but less efficient approach can match a less efficient
   reference.

7. Distinguish genuinely different approaches.

8. If the candidate provides enough technical evidence to identify
   one reference, return that reference.

9. Return null ONLY when the candidate is genuinely too vague or
   ambiguous to distinguish between the supplied references.

10. Do not choose a reference merely because it is the most efficient
    or standard solution.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

For a match:

{{
    "reference_id": "<one supplied Reference ID>"
}}

For genuinely insufficient or ambiguous evidence:

{{
    "reference_id": null
}}

The reference_id MUST exactly match one of the supplied Reference ID
values.

Do not return any other fields.
""".strip()


# ============================================================
# STAGE 2 — CONFIDENCE PROMPT
# ============================================================

def _build_confidence_prompt(
    candidate_state: dict,
    selected_reference: dict,
) -> str:
    """
    Stage 2:
    Assess how strongly the candidate matches the already-selected
    reference solution.
    """

    reference_fields = (
        "Reference ID",
        "Expected Approach",
        "Expected Data Structures",
        "Time Complexity",
        "Space Complexity",
        "Solution Type",
        "Optimization Goal",
    )

    compact_reference = {
        field: selected_reference.get(field)
        for field in reference_fields
    }

    candidate_json = json.dumps(
        candidate_state,
        ensure_ascii=False,
        indent=2,
    )

    reference_json = json.dumps(
        compact_reference,
        ensure_ascii=False,
        indent=2,
    )

    return f"""
You are assessing the confidence of an ALREADY SELECTED reference
match in a coding interview evaluation system.

The reference has already been selected.

Your ONLY task is to give a confidence value from 0.0 to 1.0
for how strongly the candidate's communicated approach matches
the selected reference.

Do NOT select another reference.
Do NOT evaluate correctness.
Do NOT score the candidate.
Do NOT decide the target or optimal solution.

CANDIDATE:
{candidate_json}

SELECTED REFERENCE:
{reference_json}

CONFIDENCE RULES:

Use the candidate's actual communicated information.

The approach is the strongest signal.

Supporting signals include:
- data structures
- algorithms
- operations
- time complexity
- space complexity
- concepts
- reasoning
- optimization

Missing information is NOT evidence against the candidate.

0.90 - 1.00 = strong semantic match
0.75 - 0.89 = good match with some missing information
0.50 - 0.74 = partial match
0.01 - 0.49 = weak match

Use null ONLY when the candidate does not provide enough
information to support this selected reference at all.

For an obvious semantic match, return a high confidence value.

Return ONLY valid JSON.

Example:
{{
    "match_confidence": 0.95
}}

If there is genuinely insufficient evidence:
{{
    "match_confidence": null
}}

Do not return any other fields.
""".strip()


# ============================================================
# VALIDATION
# ============================================================

def _validate_reference_solutions(
    reference_solutions: list[dict],
) -> list[str]:
    """Return valid supplied reference IDs."""

    if not isinstance(
        reference_solutions,
        list
    ):
        raise TypeError(
            "reference_solutions must be a list."
        )

    if not reference_solutions:
        raise ValueError(
            "reference_solutions cannot be empty"
        )

    reference_ids = []

    for reference in reference_solutions:

        if not isinstance(
            reference,
            dict
        ):
            continue

        reference_id = reference.get(
            "Reference ID"
        )

        if reference_id is None:
            reference_id = reference.get(
                "reference_id"
            )

        if reference_id is not None:
            normalized_id = str(
                reference_id
            ).strip()

            if normalized_id:
                reference_ids.append(
                    normalized_id
                )

    if not reference_ids:
        raise ValueError(
            "No valid reference IDs were found."
        )

    return reference_ids


# ============================================================
# EVIDENCE GATE
# ============================================================

def _has_sufficient_matching_evidence(
    candidate_state: dict,
) -> bool:
    """
    Return True only when the candidate has communicated enough
    technical information to justify reference matching.

    This prevents the LLM from forcing a reference match for vague
    answers such as:

        "I would use an efficient approach."
        "I would optimize it."
        "I would use a suitable data structure."
    """

    meaningful_fields = (
        "approach",
        "algorithms",
        "concepts",
        "operations",
        "data_structures",
        "time_complexity",
        "space_complexity",
        "reasoning_summary",
        "optimization",
    )

    for field in meaningful_fields:

        value = candidate_state.get(
            field
        )

        if value is None:
            continue

        if isinstance(
            value,
            str
        ) and value.strip():
            return True

        if isinstance(
            value,
            (list, tuple, set)
        ) and any(
            str(item).strip()
            for item in value
        ):
            return True

    return False


# ============================================================
# STAGE 1 — IDENTIFY CURRENT REFERENCE
# ============================================================

def _identify_reference(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> str | None:
    """
    Stage 1:
    Compare the candidate against all supplied references and
    identify the best matching CURRENT reference.

    Returns:
        reference_id
        None when there is insufficient evidence.
    """

    prompt = _build_reference_identification_prompt(
        candidate_state=candidate_state,
        reference_solutions=reference_solutions,
    )

    result = generate_structured_json(
        prompt=prompt,
        model=REFERENCE_MATCHER_MODEL,
        schema=MATCH_REFERENCE_SCHEMA,
        num_predict=300,
    )

    if not isinstance(
        result,
        dict
    ):
        raise RuntimeError(
            "Reference identification returned an invalid response."
        )

    reference_id = result.get(
        "reference_id"
    )

    if reference_id is None:
        return None

    reference_id = str(
        reference_id
    ).strip()

    if not reference_id:
        return None

    reference_ids = _validate_reference_solutions(
        reference_solutions
    )

    if reference_id not in reference_ids:
        raise RuntimeError(
            "Reference matcher returned an unknown "
            f"reference_id: {reference_id}"
        )

    return reference_id


# ============================================================
# STAGE 2 — GENERATE CONFIDENCE FOR SELECTED REFERENCE
# ============================================================

def _generate_match_confidence(
    candidate_state: dict,
    selected_reference: dict,
) -> float | None:
    """
    Stage 2:
    Compare the candidate ONLY against the already-selected
    reference and generate match confidence.
    """

    prompt = _build_confidence_prompt(
        candidate_state=candidate_state,
        selected_reference=selected_reference,
    )

    result = generate_structured_json(
        prompt=prompt,
        model=REFERENCE_MATCHER_MODEL,
        schema=MATCH_CONFIDENCE_SCHEMA,
        num_predict=250,
    )

    if not isinstance(
        result,
        dict
    ):
        raise RuntimeError(
            "Reference confidence assessor returned "
            "an invalid response."
        )

    confidence = result.get(
        "match_confidence"
    )

    if confidence is None:
        return None

    try:
        confidence = float(
            confidence
        )

    except (
        TypeError,
        ValueError
    ) as exc:
        raise RuntimeError(
            "Reference confidence assessor returned "
            "an invalid match confidence."
        ) from exc

    if not 0.0 <= confidence <= 1.0:
        raise RuntimeError(
            "Reference confidence assessor returned "
            "match confidence outside the range 0.0 to 1.0."
        )

    return confidence


# ============================================================
# CONFIDENCE-AWARE PUBLIC API
# ============================================================

def match_reference_solution_with_confidence(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> tuple[str | None, float | None]:
    """
    Two-stage reference matching.

    Stage 1:
        Identify the CURRENT reference using all supplied references.

    Stage 2:
        Compare the candidate against ONLY the selected reference
        and generate match confidence.

    Returns:
        (reference_id, confidence)

        Both values are None when there is not enough evidence for
        a reliable reference match.
    """

    if not isinstance(
        candidate_state,
        dict
    ):
        raise TypeError(
            "candidate_state must be a dictionary."
        )

    # --------------------------------------------------------
    # Evidence gate
    # --------------------------------------------------------

    if not _has_sufficient_matching_evidence(
        candidate_state
    ):
        return None, None

    # --------------------------------------------------------
    # Validate references
    # --------------------------------------------------------

    _validate_reference_solutions(
        reference_solutions
    )

    # --------------------------------------------------------
    # STAGE 1
    # Identify current reference
    # --------------------------------------------------------

    reference_id = _identify_reference(
        candidate_state=candidate_state,
        reference_solutions=reference_solutions,
    )

    if reference_id is None:
        return None, None

    # --------------------------------------------------------
    # Retrieve ONLY selected reference
    # --------------------------------------------------------

    selected_reference = next(
        (
            reference
            for reference in reference_solutions
            if str(
                reference.get("Reference ID")
                if reference.get("Reference ID") is not None
                else reference.get("reference_id")
            ).strip() == reference_id
        ),
        None,
    )

    if selected_reference is None:
        raise RuntimeError(
            "Selected reference could not be found in "
            "the supplied reference solutions."
        )

    # --------------------------------------------------------
    # STAGE 2
    # Generate confidence against ONLY selected reference
    # --------------------------------------------------------

    confidence = _generate_match_confidence(
        candidate_state=candidate_state,
        selected_reference=selected_reference,
    )

    # If Stage 2 determines that the selected reference is not
    # sufficiently supported, preserve the no-match contract.
    if confidence is None:
        return None, None

    return reference_id, confidence


# ============================================================
# EXISTING PUBLIC API
# ============================================================

def match_reference_solution(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> str | None:
    """
    Match the candidate NLP state to one of the supplied
    reference solutions.

    This existing API continues to return only the reference ID.
    """

    reference_id, _ = (
        match_reference_solution_with_confidence(
            candidate_state=candidate_state,
            reference_solutions=reference_solutions,
        )
    )

    return reference_id


# ============================================================
# PROBLEM-AWARE MATCHING API
# ============================================================

def match_problem_reference_solution_with_confidence(
    candidate_state: dict,
    problem,
) -> tuple[str | None, float | None]:
    """
    Load all reference solutions for the given problem from the
    canonical reference repository and identify the candidate's
    current reference.

    This function only identifies the CURRENT reference.

    It does NOT:
    - select the optimal/target reference
    - determine the next reference
    - perform candidate evaluation
    - perform gap analysis
    """

    reference_solutions = load_reference_solution(
        problem
    )

    if not reference_solutions:
        raise ValueError(
            f"No reference solutions found for problem: {problem}"
        )

    return match_reference_solution_with_confidence(
        candidate_state=candidate_state,
        reference_solutions=reference_solutions,
    )


# ============================================================
# CURRENT REFERENCE CONTEXT
# ============================================================

def build_current_reference_context(
    problem,
    reference_id,
    match_confidence,
):
    """
    Build the structured current-reference contract.

    This represents what the candidate currently matches.

    This function does NOT:
    - select the target reference
    - decide whether the candidate should continue
    - perform gap analysis
    """

    if not reference_id:
        return None

    reference_solutions = load_reference_solution(
        problem
    )

    for reference in reference_solutions:

        if reference.get(
            "Reference ID"
        ) == reference_id:

            return {
                "reference_id": reference_id,
                "match_confidence": match_confidence,

                "solution_type": reference.get(
                    "Solution Type"
                ),

                "expected_approach": reference.get(
                    "Expected Approach"
                ),

                "data_structures": reference.get(
                    "Expected Data Structures"
                ),

                "time_complexity": reference.get(
                    "Time Complexity"
                ),

                "space_complexity": reference.get(
                    "Space Complexity"
                ),

                "reasoning_steps": reference.get(
                    "Reasoning Steps"
                ),

                "edge_cases": reference.get(
                    "Edge Cases"
                ),

                "optimization_goal": reference.get(
                    "Optimization Goal"
                ),

                "next_better_reference_id": reference.get(
                    "Next Better Reference ID"
                ),
            }

    raise ValueError(
        f"Reference ID '{reference_id}' was not found "
        f"for problem '{problem}'."
    )