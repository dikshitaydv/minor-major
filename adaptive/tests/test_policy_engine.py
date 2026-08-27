from adaptive.policy_engine import PolicyEngine


def weak_scores():
    return {
        "algorithm_correctness": 85,
        "logical_reasoning": 70,
        "concept_coverage": 90,
        "completeness": 65,
        "data_structure_usage": 80,
        "complexity": 40,
        "edge_cases": 50
    }


def strong_scores():
    return {
        "algorithm_correctness": 90,
        "logical_reasoning": 85,
        "concept_coverage": 90,
        "completeness": 80,
        "data_structure_usage": 85,
        "complexity": 90,
        "edge_cases": 80
    }


def test_normal_follow_up():
    engine = PolicyEngine()

    result = engine.decide(
        scores=weak_scores(),
        time_remaining=180,
        candidate_level="medium"
    )

    assert result["action"] == "ASK_FOLLOW_UP"
    assert result["target_dimension"] == "complexity"
    assert result["difficulty"] == "medium"
    assert result["goal"] == "probe_complexity"
    assert result["time_policy"] == "TARGETED_FOLLOW_UP"


def test_time_over():
    engine = PolicyEngine()

    result = engine.decide(
        scores=weak_scores(),
        time_remaining=0
    )

    assert result["action"] == "STOP"
    assert result["target_dimension"] is None


def test_less_than_thirty_seconds():
    engine = PolicyEngine()

    result = engine.decide(
        scores=weak_scores(),
        time_remaining=20
    )

    assert result["action"] == "STOP"


def test_strong_scores_stop():
    engine = PolicyEngine()

    result = engine.decide(
        scores=strong_scores(),
        time_remaining=180
    )

    assert result["action"] == "STOP"


def test_beginner_gets_easy_difficulty():
    engine = PolicyEngine()

    result = engine.decide(
        scores=weak_scores(),
        time_remaining=180,
        candidate_level="beginner"
    )

    assert result["difficulty"] == "easy"


def test_advanced_gets_hard_difficulty():
    engine = PolicyEngine()

    result = engine.decide(
        scores=weak_scores(),
        time_remaining=180,
        candidate_level="advanced"
    )

    assert result["difficulty"] == "hard"


def test_repetition_prevention():
    engine = PolicyEngine()

    # Complexity is targeted twice.
    first = engine.decide(weak_scores(), 180)
    second = engine.decide(weak_scores(), 180)

    # On the third decision, complexity should be blocked
    # and edge_cases should become the next target.
    third = engine.decide(weak_scores(), 180)

    assert first["target_dimension"] == "complexity"
    assert second["target_dimension"] == "complexity"
    assert third["target_dimension"] == "edge_cases"
def test_resolved_gap_moves_to_next_gap():
    engine = PolicyEngine()

    # Turn 1: complexity is the weakest gap.
    first_scores = {
        "algorithm_correctness": 85,
        "logical_reasoning": 70,
        "concept_coverage": 90,
        "completeness": 65,
        "data_structure_usage": 80,
        "complexity": 30,
        "edge_cases": 50
    }

    first = engine.decide(
        scores=first_scores,
        time_remaining=180
    )

    assert first["target_dimension"] == "complexity"

    # Turn 2: complexity has improved and is resolved.
    second_scores = {
        "algorithm_correctness": 85,
        "logical_reasoning": 70,
        "concept_coverage": 90,
        "completeness": 65,
        "data_structure_usage": 80,
        "complexity": 75,
        "edge_cases": 50
    }

    second = engine.decide(
        scores=second_scores,
        time_remaining=180
    )

    # Complexity should no longer be selected.
    assert second["target_dimension"] == "edge_cases"