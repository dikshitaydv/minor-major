def classify_answer(
    candidate_features: dict,
    llm_evaluation: dict
) -> str:

    scores = llm_evaluation.get("scores", {})

    algorithm = float(scores.get("algorithm_correctness", 0))
    reasoning = float(scores.get("logical_reasoning", 0))
    concepts = float(scores.get("concept_coverage", 0))
    completeness = float(scores.get("completeness", 0))
    data_structure = float(scores.get("data_structure_usage", 0))
    complexity = float(scores.get("complexity", 0))
    edge_cases = float(scores.get("edge_cases", 0))

    answer = candidate_features.get(
        "normalized_answer", ""
    ).strip()

    # --------------------------------------------------
    # 1. Fundamentally incorrect
    # --------------------------------------------------
    if algorithm < 40:
        return "Incorrect"

    # --------------------------------------------------
    # 2. Complexity mistake
    # Core algorithm is good, but complexity is weak
    # --------------------------------------------------
    if (
        algorithm >= 70
        and reasoning >= 60
        and complexity < 50
        and complexity < algorithm - 25
    ):
        return "Complexity Mistake"

    # --------------------------------------------------
    # 3. Edge-case mistake
    # Core algorithm is good, but edge-case handling
    # is significantly weaker.
    # --------------------------------------------------
    if (
        algorithm >= 70
        and reasoning >= 60
        and edge_cases < 60
        and edge_cases < algorithm - 25
    ):
        return "Edge-Case Mistake"

    # --------------------------------------------------
    # 4. Partially correct
    # Some meaningful understanding exists, but
    # algorithm/reasoning is not strong enough.
    # --------------------------------------------------
    if (
        algorithm >= 40
        and algorithm < 75
    ):
        return "Partially Correct"

    # --------------------------------------------------
    # 5. Concise
    # Correct answer with very little explanation.
    # --------------------------------------------------
    word_count = len(answer.split())

    if (
        algorithm >= 80
        and reasoning >= 75
        and word_count <= 20
    ):
        return "Concise"

    # --------------------------------------------------
    # 6. Verbose
    # Correct answer with unnecessarily long explanation.
    # --------------------------------------------------
    if (
        algorithm >= 80
        and reasoning >= 75
        and word_count >= 80
    ):
        return "Verbose"

    # --------------------------------------------------
    # 7. Correct
    # --------------------------------------------------
    if (
        algorithm >= 80
        and reasoning >= 75
        and concepts >= 75
        and completeness >= 70
        and data_structure >= 75
        and complexity >= 70
        and edge_cases >= 70
    ):
        return "Correct"

    # --------------------------------------------------
    # 8. Fallback
    # --------------------------------------------------
    return "Partially Correct"