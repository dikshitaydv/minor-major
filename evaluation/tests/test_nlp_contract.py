from evaluation.extraction.extraction_service import (
    extract_candidate_features
)


def test_direct_approach():
    result = extract_candidate_features(
        "I'll use a HashMap."
    )

    assert result["approach"] == "hash map"


def test_semantic_wording_for_hash_map():
    result = extract_candidate_features(
        "I'll store previously seen values in a map."
    )

    assert (
        "hash map"
        in result["data_structures"]
        or
        "hash map"
        in result["concepts_detected"]
    )


def test_complexity():
    result = extract_candidate_features(
        "This takes O(n) time and O(n) space."
    )

    assert result["time_complexity"] == "O(n)"
    assert result["space_complexity"] == "O(n)"


def test_edge_cases():
    result = extract_candidate_features(
        "I'll handle duplicates and an empty array."
    )

    assert "duplicate_values" in result["edge_cases"]
    assert "empty_input" in result["edge_cases"]


def test_reasoning():
    result = extract_candidate_features(
        "I use a HashMap because lookup is constant time on average."
    )

    assert result["reasoning_summary"] is not None
    assert "HashMap" in result["reasoning_summary"]


def test_missing_information():
    result = extract_candidate_features(
        "Okay, I'll use a HashMap."
    )

    assert result["approach"] == "hash map"
    assert result["time_complexity"] is None
    assert result["space_complexity"] is None
    assert result["edge_cases"] == []
    assert result["assumptions"] == []
    assert result["optimization"] is None


def test_assumptions():
    result = extract_candidate_features(
        "I assume the input contains at least two elements."
    )

    assert len(result["assumptions"]) > 0


def test_optimization():
    result = extract_candidate_features(
        "We can optimize this approach by reducing the space usage."
    )

    assert result["optimization"] is True


def test_no_optimization_discussion():
    result = extract_candidate_features(
        "I'll use a HashMap."
    )

    assert result["optimization"] is None


def test_nlp_confidence_range():
    result = extract_candidate_features(
        "I'll use a HashMap because lookup is constant time."
    )

    assert 0.0 <= result["confidence"] <= 1.0
    
    
from evaluation.scoring.candidate_state import (
    CandidateEvaluationState,
    CandidateNLPState
)


def test_multi_turn_nlp_accumulation():
    state = CandidateEvaluationState(
        candidate_id="candidate_001",
        question_id="two_sum"
    )

    # Turn 1
    turn_1 = extract_candidate_features(
        "I'll use a HashMap."
    )

    state.update_nlp_state(
        CandidateNLPState(
            approach=turn_1["approach"],
            algorithms=turn_1["algorithms"],
            concepts=turn_1["concepts"],
            data_structures=turn_1["data_structures"],
            time_complexity=turn_1["time_complexity"],
            space_complexity=turn_1["space_complexity"],
            edge_cases=turn_1["edge_cases"],
            reasoning_summary=turn_1["reasoning_summary"],
            assumptions=turn_1["assumptions"],
            optimization=turn_1["optimization"],
            confidence=turn_1["confidence"]
        )
    )

    # Turn 2
    turn_2 = extract_candidate_features(
        "The solution takes O(n) time and O(n) space."
    )

    state.update_nlp_state(
        CandidateNLPState(
            approach=turn_2["approach"],
            algorithms=turn_2["algorithms"],
            concepts=turn_2["concepts"],
            data_structures=turn_2["data_structures"],
            time_complexity=turn_2["time_complexity"],
            space_complexity=turn_2["space_complexity"],
            edge_cases=turn_2["edge_cases"],
            reasoning_summary=turn_2["reasoning_summary"],
            assumptions=turn_2["assumptions"],
            optimization=turn_2["optimization"],
            confidence=turn_2["confidence"]
        )
    )

    # Turn 3
    turn_3 = extract_candidate_features(
        "I'd handle duplicate values and an empty array."
    )

    state.update_nlp_state(
        CandidateNLPState(
            approach=turn_3["approach"],
            algorithms=turn_3["algorithms"],
            concepts=turn_3["concepts"],
            data_structures=turn_3["data_structures"],
            time_complexity=turn_3["time_complexity"],
            space_complexity=turn_3["space_complexity"],
            edge_cases=turn_3["edge_cases"],
            reasoning_summary=turn_3["reasoning_summary"],
            assumptions=turn_3["assumptions"],
            optimization=turn_3["optimization"],
            confidence=turn_3["confidence"]
        )
    )

    final_state = state.nlp_state

    assert final_state.approach == "hash map"

    assert final_state.time_complexity == "O(n)"

    assert final_state.space_complexity == "O(n)"

    assert "duplicate_values" in final_state.edge_cases

    assert "empty_input" in final_state.edge_cases