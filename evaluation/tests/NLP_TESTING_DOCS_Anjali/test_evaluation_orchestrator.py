from evaluation.scoring.candidate_state import (
    CandidateEvaluationState
)

from evaluation.scoring.evaluation_orchestrator import (
    evaluate_candidate_turn
)


def test_complete_adaptive_turn():

    # ==================================================
    # INITIAL STATE
    # ==================================================

    state = CandidateEvaluationState(
        candidate_id="candidate_001",
        question_id="two_sum"
    )

    # ==================================================
    # CANDIDATE ANSWER
    # ==================================================

    candidate_answer = (
        "I would use a HashMap. For every number, "
        "I calculate the complement and check whether "
        "it already exists in the map. The time complexity "
        "is O(n) and the space complexity is O(n)."
    )

    # ==================================================
    # CANDIDATE FEATURES
    # ==================================================

    candidate_features = {
        "normalized_answer": candidate_answer,

        "concepts_detected": [
            "HashMap"
        ],

        "reasoning": [
            "Calculate complement",
            "Check whether complement exists",
            "Return matching indices"
        ],

        "complexity_claim": {
            "time": "O(n)",
            "space": "O(n)"
        }
    }

    # ==================================================
    # PROBLEM
    # ==================================================

    problem = {
        "title": "Two Sum",

        "description": (
            "Given an array of integers nums and an "
            "integer target, return the indices of the "
            "two numbers such that they add up to target."
        )
    }

    # ==================================================
    # EVALUATE COMPLETE TURN
    # ==================================================

    updated_state = evaluate_candidate_turn(
        state=state,

        candidate_answer=candidate_answer,

        problem=problem,

        candidate_features=candidate_features
    )

    # ==================================================
    # DISPLAY
    # ==================================================

    print()
    print("=" * 60)
    print("       COMPLETE ADAPTIVE TURN")
    print("=" * 60)

    print()
    print("Primary Classification:")
    print(
        updated_state.primary_classification
    )

    print()
    print("Adaptive Classifications:")
    print(
        updated_state.adaptive_classifications
    )

    print()
    print("Primary Adaptive Gap:")
    print(
        updated_state.primary_adaptive_gap
    )

    print()
    print("Scores:")
    print(
        updated_state.scores
    )

    print()
    print("Interviewer Follow-Up:")
    print(
        updated_state.current_interviewer_question
    )

    print()
    print("=" * 60)

    # ==================================================
    # BASIC ASSERTIONS
    # ==================================================

    assert updated_state.turn_number == 2

    assert (
        updated_state.current_answer
        == candidate_answer
    )

    assert isinstance(
        updated_state.scores,
        dict
    )

    print()
    print("STATE UPDATE PASSED")

    # ==================================================
    # FOLLOW-UP CHECK
    #
    # If Ollama/classification identifies an adaptive
    # gap, a follow-up should have been generated.
    # ==================================================

    if updated_state.primary_adaptive_gap:

        assert (
            updated_state.current_interviewer_question
            is not None
        )

        assert (
            len(
                updated_state.current_interviewer_question
                .strip()
            )
            > 0
        )

        print(
            "FOLLOW-UP GENERATION PASSED"
        )

    else:

        print(
            "NO ADAPTIVE GAP — NO FOLLOW-UP REQUIRED"
        )

    print()
    print("=" * 60)
    print("       STEP 11 TEST PASSED")
    print("=" * 60)


if __name__ == "__main__":
    test_complete_adaptive_turn()