def calculate_confidence(
    llm_evaluation: dict,
    semantic_similarity: float
) -> float:
    """
    Calculate the final confidence score using
    LLM evaluation scores and semantic similarity.

    LLM evaluation contributes 70%.
    Semantic similarity contributes 30%.
    """

    scores = llm_evaluation.get("scores", {})

    dimensions = [
        "algorithm_correctness",
        "logical_reasoning",
        "concept_coverage",
        "completeness",
        "data_structure_usage",
        "complexity",
        "edge_cases"
    ]

    if not scores:
        return 0.0

    llm_score = sum(
        float(scores.get(dimension, 0))
        for dimension in dimensions
    ) / (len(dimensions) * 100)

    semantic_score = max(
        0.0,
        min(1.0, float(semantic_similarity))
    )

    confidence = (
        0.7 * llm_score +
        0.3 * semantic_score
    )

    return round(confidence, 4)