from evaluation.scoring.confidence import calculate_confidence


def test_confidence_score():
    llm_evaluation = {
        "scores": {
            "algorithm_correctness": 10,
            "logical_reasoning": 10,
            "concept_coverage": 10,
            "completeness": 10,
            "data_structure_usage": 10,
            "complexity": 10,
            "edge_cases": 10
        }
    }

    semantic_similarity = 0.8

    result = calculate_confidence(
        llm_evaluation,
        semantic_similarity
    )

    assert result == 0.94


def test_zero_confidence():
    llm_evaluation = {
        "scores": {
            "algorithm_correctness": 0,
            "logical_reasoning": 0,
            "concept_coverage": 0,
            "completeness": 0,
            "data_structure_usage": 0,
            "complexity": 0,
            "edge_cases": 0
        }
    }

    result = calculate_confidence(
        llm_evaluation,
        0.0
    )

    assert result == 0.0