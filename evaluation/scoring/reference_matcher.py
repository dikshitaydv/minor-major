import json

from evaluation.llm.ollama_client import (
    generate_structured_json
)


MATCH_REFERENCE_SCHEMA = {
    "type": "object",
    "properties": {
        "reference_id": {
            "type": ["string", "null"]
        },
        "match_confidence": {
            "type": ["number", "null"]
        }
    },
    "required": [
        "reference_id",
        "match_confidence"
    ],
    "additionalProperties": False
}


# ============================================================
# MATCHING PROMPT
# ============================================================

def _build_matching_prompt(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> str:
    """
    Ask the LLM to identify which reference solution best
    matches the candidate's communicated approach.
    """

    return f"""
You are a reference-solution matcher for a coding interview
evaluation system.

Your task is to determine which reference solution best matches
the candidate's communicated solution approach.

You are NOT evaluating the candidate.

You are NOT scoring correctness.

You are NOT solving the problem.

You are ONLY selecting the reference solution whose approach
most closely corresponds to what the candidate communicated.

============================================================
CANDIDATE NLP STATE
============================================================

{json.dumps(candidate_state, ensure_ascii=False, indent=2)}

============================================================
REFERENCE SOLUTIONS
============================================================

{json.dumps(reference_solutions, ensure_ascii=False, indent=2)}

============================================================
MATCHING RULES
============================================================

1. Match based on the semantic approach communicated by the
   candidate.

2. Consider all available candidate information, including:
   - approach
   - algorithms
   - concepts
   - operations
   - data_structures
   - time_complexity
   - space_complexity
   - reasoning_summary
   - edge_cases
   - assumptions
   - optimization

3. Compare that information with the supplied reference
   solution fields.

4. A reference does NOT need to use exactly the same wording
   as the candidate.

5. Semantically equivalent approaches should be considered
   equivalent.

6. Do not require textbook terminology when the candidate's
   meaning clearly corresponds to a reference approach.

7. Do not invent information that is missing from the candidate.

8. Do not assume an algorithm merely because it is common for
   the problem.

9. Do not choose a reference simply because it is the standard
   or most efficient solution.

10. A valid but less efficient approach can still match the
    appropriate reference if its approach corresponds.

11. Distinguish genuinely different approaches even when they
    solve the same problem.

12. Use the candidate's communicated approach as the primary
    matching signal.

13. Data structures, complexity, concepts, operations,
    reasoning, and other extracted fields are supporting
    evidence.

14. Do not perform candidate quality evaluation.

15. Match confidence represents confidence that the selected
    reference corresponds to the candidate's communicated
    approach.

16. Match confidence is NOT a candidate score.

17. Match confidence is NOT progress toward the target
    reference.

18. If the candidate provides insufficient or ambiguous
    information to identify one of the supplied references,
    return null for both reference_id and match_confidence.

19. Do NOT force a reference selection when there is not enough
    semantic evidence.

20. A vague statement such as "I would use an efficient
    approach" or "I would optimize it" is insufficient by itself
    to identify a reference.

21. If multiple references remain equally plausible because the
    candidate has not communicated enough distinguishing
    information, return null for both fields.

22. When a reference is selected, match_confidence must be a
    number between 0.0 and 1.0.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

For a confident match, use:

{{
    "reference_id": "<one of the supplied Reference ID values>",
    "match_confidence": 0.0
}}

For no confident match, use:

{{
    "reference_id": null,
    "match_confidence": null
}}

The reference_id MUST be copied exactly from one of the supplied
reference solutions when a match is returned.

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
            "reference_solutions cannot be empty."
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
# CONFIDENCE-AWARE PUBLIC API
# ============================================================

def match_reference_solution_with_confidence(
    candidate_state: dict,
    reference_solutions: list[dict],
) -> tuple[str | None, float | None]:
    """
    Match the candidate NLP state to one of the supplied
    reference solutions and return the match confidence.

    Returns:
        (reference_id, confidence)

        Both values are None when there is not enough evidence
        for a reliable reference match.
    """

    if not isinstance(
        candidate_state,
        dict
    ):
        raise TypeError(
            "candidate_state must be a dictionary."
        )

    reference_ids = _validate_reference_solutions(
        reference_solutions
    )

    prompt = _build_matching_prompt(
        candidate_state=candidate_state,
        reference_solutions=reference_solutions,
    )

    result = generate_structured_json(
        prompt=prompt,
        model="qwen3:1.7b",
        schema=MATCH_REFERENCE_SCHEMA,
        num_predict=400,
    )

    if not isinstance(
        result,
        dict
    ):
        raise RuntimeError(
            "Reference matcher returned an invalid response."
        )

    reference_id = result.get(
        "reference_id"
    )

    confidence = result.get(
        "match_confidence"
    )

    # --------------------------------------------------------
    # Valid no-match result
    # --------------------------------------------------------

    if reference_id is None:
        return None, None

    reference_id = str(
        reference_id
    ).strip()

    if not reference_id:
        return None, None

    # --------------------------------------------------------
    # Validate matched reference
    # --------------------------------------------------------

    if reference_id not in reference_ids:
        raise RuntimeError(
            "Reference matcher returned an unknown "
            f"reference_id: {reference_id}"
        )

    # --------------------------------------------------------
    # Validate confidence
    # --------------------------------------------------------

    if confidence is None:
        raise RuntimeError(
            "Reference matcher returned a reference "
            "without match confidence."
        )

    try:
        confidence = float(
            confidence
        )

    except (
        TypeError,
        ValueError
    ) as exc:
        raise RuntimeError(
            "Reference matcher returned an invalid "
            "match confidence."
        ) from exc

    if not 0.0 <= confidence <= 1.0:
        raise RuntimeError(
            "Reference matcher returned match confidence "
            "outside the range 0.0 to 1.0."
        )

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