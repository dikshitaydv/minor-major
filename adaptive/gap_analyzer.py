from typing import Any


# Mapping between evaluation dimension names and
# conversation/question-generation dimension names.
DIMENSION_MAPPING = {
    "data_structure_usage": "data_structure"
}


def analyze_gaps(scores: dict[str, float]) -> dict[str, Any]:
    """
    Analyze evaluation scores and identify the weakest areas.

    Lower scores represent higher-priority gaps.

    Returns:
        {
            "primary_gap": str | None,
            "secondary_gap": str | None,
            "prioritized_gaps": list[str]
        }
    """

    if not scores:
        return {
            "primary_gap": None,
            "secondary_gap": None,
            "prioritized_gaps": []
        }

    # Normalize dimension names so they are compatible
    # with the QuestionGenerator.
    normalized_scores = {}

    for dimension, score in scores.items():
        normalized_dimension = DIMENSION_MAPPING.get(
            dimension,
            dimension
        )

        normalized_scores[normalized_dimension] = score

    # Sort from weakest score to strongest score.
    prioritized_gaps = sorted(
        normalized_scores,
        key=normalized_scores.get
    )

    primary_gap = (
        prioritized_gaps[0]
        if len(prioritized_gaps) > 0
        else None
    )

    secondary_gap = (
        prioritized_gaps[1]
        if len(prioritized_gaps) > 1
        else None
    )

    return {
        "primary_gap": primary_gap,
        "secondary_gap": secondary_gap,
        "prioritized_gaps": prioritized_gaps
    }