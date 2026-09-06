from evaluation.interviewer.interview_session import (
    InterviewSession,
)


# ============================================================
# TEST CONFIGURATION
# ============================================================

PROBLEM = {
    "problem_id": "P001",
    "title": "Two Sum",
    "description": (
        "Given an array of integers nums and an integer target, "
        "return the indices of two numbers that add up to target."
    ),
}

CANDIDATE_ID = "e2e_test_candidate"

CANDIDATE_ANSWER = """
I would use a HashMap to store previously seen values.
For each number, I would calculate its complement and check
whether that complement already exists in the HashMap.
If it exists, I return the two indices. Otherwise, I store
the current number and continue iterating through the array.
This gives O(n) time and O(n) space.
"""


# ============================================================
# PRINT HELPERS
# ============================================================

def print_header(title: str) -> None:
    print()
    print("=" * 70)
    print(title.center(70))
    print("=" * 70)


def print_section(title: str) -> None:
    print()
    print(title)
    print("-" * len(title))


def print_field(label: str, value) -> None:
    if value is None:
        value = "None"

    if isinstance(value, list):
        if not value:
            value = "None identified"
        else:
            value = ", ".join(
                str(item)
                for item in value
            )

    if isinstance(value, dict):
        if not value:
            value = "None"
        else:
            value = str(value)

    print(
        f"{label:<30}: {value}"
    )


# ============================================================
# END-TO-END TEST
# ============================================================

def test_end_to_end():

    print_header(
        "FULL END-TO-END NLP + REFERENCE + EVALUATION PIPELINE"
    )

    # ========================================================
    # 1. INPUT
    # ========================================================

    print_section("[1] INPUT")

    print_field(
        "Candidate ID",
        CANDIDATE_ID,
    )

    print_field(
        "Problem ID",
        PROBLEM["problem_id"],
    )

    print_field(
        "Problem",
        PROBLEM["title"],
    )

    print()
    print("Candidate Answer")
    print("-" * 70)
    print(
        CANDIDATE_ANSWER.strip()
    )
    print("-" * 70)

    # ========================================================
    # 2. CREATE INTERVIEW SESSION
    # ========================================================

    print_section(
        "[2] CREATE INTERVIEW SESSION"
    )

    session = InterviewSession(
        candidate_id=CANDIDATE_ID,
        question_id=PROBLEM["problem_id"],
        problem=PROBLEM,
        resume_existing=False,
    )

    print_field(
        "Session created",
        True,
    )

    print_field(
        "Finished initially",
        session.is_finished(),
    )

    assert session.is_finished() is False

    # ========================================================
    # 3. INITIAL STATE
    # ========================================================

    print_section(
        "[3] INITIAL STATE"
    )

    initial_state = session.get_state()

    print_field(
        "Candidate ID",
        initial_state.candidate_id,
    )

    print_field(
        "Question ID",
        initial_state.question_id,
    )

    print_field(
        "reference_answer_id",
        initial_state.reference_answer_id,
    )

    print_field(
        "reference_match_confidence",
        initial_state.reference_match_confidence,
    )

    print_field(
        "target_reference_id",
        initial_state.target_reference_id,
    )

    assert hasattr(
        initial_state,
        "reference_answer_id",
    )

    assert hasattr(
        initial_state,
        "reference_match_confidence",
    )

    assert hasattr(
        initial_state,
        "target_reference_id",
    )

    # No candidate answer has been processed yet.
    assert (
        initial_state.reference_answer_id
        is None
    )

    assert (
        initial_state.reference_match_confidence
        is None
    )

    assert (
        initial_state.target_reference_id
        is None
    )

    # ========================================================
    # 4. SUBMIT ANSWER
    # ========================================================

    print_section(
        "[4] REAL PRODUCTION PIPELINE"
    )

    print()
    print("Calling:")
    print()
    print(
        "  session.submit_answer(CANDIDATE_ANSWER)"
    )
    print()
    print("Production flow:")
    print()
    print("  Candidate Answer")
    print("        ↓")
    print("  LLM NLP Extraction")
    print("        ↓")
    print("  CandidateNLPState")
    print("        ↓")
    print("  Reference Matching")
    print("        ↓")
    print("  reference_answer_id")
    print("  reference_match_confidence")
    print("        ↓")
    print("  LLM Evaluation")
    print("        ↓")
    print("  Dimension Scores")
    print("        ↓")
    print("  Classification")
    print("        ↓")
    print("  Adaptive Policy")
    print("        ↓")
    print("  Final Candidate State")

    state = session.submit_answer(
        candidate_answer=CANDIDATE_ANSWER,
    )

    assert state is not None

    print()
    print_field(
        "Returned state type",
        type(state).__name__,
    )

    # ========================================================
    # 5. NLP STATE
    # ========================================================

    print_section(
        "[5] NLP EXTRACTION / CANDIDATE NLP STATE"
    )

    nlp_state = state.nlp_state

    assert nlp_state is not None

    print_field(
        "Approach",
        nlp_state.approach,
    )

    print_field(
        "Algorithms",
        nlp_state.algorithms,
    )

    print_field(
        "Concepts",
        nlp_state.concepts,
    )

    print_field(
        "Operations",
        nlp_state.operations,
    )

    print_field(
        "Data Structures",
        nlp_state.data_structures,
    )

    print_field(
        "Time Complexity",
        nlp_state.time_complexity,
    )

    print_field(
        "Space Complexity",
        nlp_state.space_complexity,
    )

    print_field(
        "Edge Cases",
        nlp_state.edge_cases,
    )

    print_field(
        "Reasoning Summary",
        nlp_state.reasoning_summary,
    )

    print_field(
        "Assumptions",
        nlp_state.assumptions,
    )

    print_field(
        "Optimization",
        nlp_state.optimization,
    )

    # Explicitly verify the final NLP state has exactly
    # the agreed 11 fields.
    expected_nlp_fields = {
        "approach",
        "algorithms",
        "concepts",
        "operations",
        "data_structures",
        "time_complexity",
        "space_complexity",
        "edge_cases",
        "reasoning_summary",
        "assumptions",
        "optimization",
    }

    assert set(
        nlp_state.to_dict().keys()
    ) == expected_nlp_fields

    # ========================================================
    # 6. NLP SERIALIZATION
    # ========================================================

    print_section(
        "[6] NLP STATE SERIALIZATION"
    )

    nlp_dict = nlp_state.to_dict()

    print()

    for key, value in nlp_dict.items():
        print_field(
            key,
            value,
        )

    print()

    assert (
        "implementation_details"
        not in nlp_dict
    )

    # ========================================================
    # 7. REFERENCE MATCHING
    # ========================================================

    print_section(
        "[7] REFERENCE MATCHING"
    )

    print()
    print_field(
        "Current reference",
        state.reference_answer_id,
    )

    print_field(
        "Match confidence",
        state.reference_match_confidence,
    )

    # A candidate answer has now been processed, so the
    # matcher result should be present.
    assert (
        state.reference_answer_id
        is not None
    )

    assert (
        state.reference_match_confidence
        is not None
    )

    assert (
        0.0
        <= state.reference_match_confidence
        <= 1.0
    )

    print()
    print(
        "Reference matching has now produced the current "
        "reference and its LLM-generated match confidence."
    )

    # ========================================================
    # 8. TARGET REFERENCE
    # ========================================================

    print_section(
        "[8] TARGET REFERENCE"
    )

    print_field(
        "target_reference_id",
        state.target_reference_id,
    )

    print()
    print(
        "Target reference selection belongs to the "
        "adaptive/policy side."
    )

    print(
        "This test does not invent or force a target reference."
    )

    # ========================================================
    # 9. EVALUATOR CLASSIFICATION
    # ========================================================

    print_section(
        "[9] EVALUATOR CLASSIFICATION"
    )

    print_field(
        "Primary classification",
        state.primary_classification,
    )

    print_field(
        "Adaptive classifications",
        state.adaptive_classifications,
    )

    # ========================================================
    # 10. EVALUATION SCORES
    # ========================================================

    print_section(
        "[10] EVALUATION SCORES"
    )

    scores = state.scores

    assert isinstance(
        scores,
        dict,
    )

    print()

    for dimension, score in scores.items():
        print_field(
            dimension,
            score,
        )

    print()

    print_field(
        "Number of dimensions",
        len(scores),
    )

    # ========================================================
    # 11. ADAPTIVE STATE
    # ========================================================

    print_section(
        "[11] ADAPTIVE STATE"
    )

    print_field(
        "Primary adaptive gap",
        state.primary_adaptive_gap,
    )

    print_field(
        "Should continue",
        state.should_continue,
    )

    print_field(
        "Current interviewer question",
        state.current_interviewer_question,
    )

    print_field(
        "Session finished",
        session.is_finished(),
    )

    # ========================================================
    # 12. EVIDENCE
    # ========================================================

    print_section(
        "[12] EVIDENCE"
    )

    evidence = state.evidence

    if (
        isinstance(evidence, dict)
        and evidence
    ):

        for key, value in evidence.items():
            print_field(
                key,
                value,
            )

    else:

        print_field(
            "Evidence",
            evidence,
        )

    # ========================================================
    # 13. HISTORY
    # ========================================================

    print_section(
        "[13] TURN HISTORY"
    )

    print_field(
        "History length",
        len(state.history),
    )

    if state.history:

        for index, entry in enumerate(
            state.history,
            start=1,
        ):

            print()
            print(
                f"History Entry {index}"
            )
            print("-" * 50)

            if isinstance(
                entry,
                dict
            ):

                for key, value in entry.items():

                    print_field(
                        key,
                        value,
                    )

            else:

                print(entry)

    # ========================================================
    # 14. FINAL RESULT
    # ========================================================

    print_section(
        "[14] FINAL EVALUATOR RESULT"
    )

    final_result = (
        session.get_final_result()
    )

    assert isinstance(
        final_result,
        dict,
    )

    print_field(
        "Candidate ID",
        final_result["candidate_id"],
    )

    print_field(
        "Question ID",
        final_result["question_id"],
    )

    print_field(
        "Status",
        final_result["status"],
    )

    print_field(
        "Turns",
        final_result["turn_number"],
    )

    print_field(
        "History length",
        final_result["history_length"],
    )

    print_field(
        "Average score",
        final_result["average_score"],
    )

    print_field(
        "Assessed dimensions",
        final_result["assessed_dimensions"],
    )

    print_field(
        "Total dimensions",
        final_result["total_dimensions"],
    )

    print()
    print("Primary Classification")
    print("-" * 30)

    print(
        final_result[
            "primary_classification"
        ]
    )

    # ========================================================
    # 15. FINAL SEVEN DIMENSION SCORES
    # ========================================================

    print_section(
        "[15] FINAL SEVEN DIMENSION SCORES"
    )

    final_scores = (
        final_result["scores"]
    )

    assert isinstance(
        final_scores,
        dict,
    )

    for dimension, data in final_scores.items():

        if isinstance(
            data,
            dict
        ):

            score = data.get(
                "score"
            )

            print_field(
                dimension,
                score,
            )

        else:

            print_field(
                dimension,
                data,
            )

    # ========================================================
    # 16. FINAL REFERENCE STATE
    # ========================================================

    print_section(
        "[16] FINAL REFERENCE STATE"
    )

    print_field(
        "reference_answer_id",
        state.reference_answer_id,
    )

    print_field(
        "reference_match_confidence",
        state.reference_match_confidence,
    )

    print_field(
        "target_reference_id",
        state.target_reference_id,
    )

    assert (
        state.reference_answer_id
        is not None
    )

    assert (
        state.reference_match_confidence
        is not None
    )

    # ========================================================
    # 17. COMPLETE STATE SERIALIZATION
    # ========================================================

    print_section(
        "[17] COMPLETE STATE SERIALIZATION"
    )

    serialized_state = (
        state.to_dict()
    )

    assert isinstance(
        serialized_state,
        dict,
    )

    assert (
        "reference_answer_id"
        in serialized_state
    )

    assert (
        "reference_match_confidence"
        in serialized_state
    )

    assert (
        "target_reference_id"
        in serialized_state
    )

    print_field(
        "State serialized",
        True,
    )

    print_field(
        "reference_answer_id persisted",
        serialized_state.get(
            "reference_answer_id"
        ),
    )

    print_field(
        "reference_match_confidence persisted",
        serialized_state.get(
            "reference_match_confidence"
        ),
    )

    print_field(
        "target_reference_id persisted",
        serialized_state.get(
            "target_reference_id"
        ),
    )

    # ========================================================
    # 18. RESTORE STATE
    # ========================================================

    print_section(
        "[18] STATE RESTORATION"
    )

    restored_state = (
        type(state).from_dict(
            serialized_state
        )
    )

    assert (
        restored_state.reference_answer_id
        == state.reference_answer_id
    )

    assert (
        restored_state.reference_match_confidence
        == state.reference_match_confidence
    )

    assert (
        restored_state.target_reference_id
        == state.target_reference_id
    )

    print_field(
        "State restored",
        True,
    )

    print_field(
        "reference_answer_id restored",
        restored_state.reference_answer_id,
    )

    print_field(
        "reference_match_confidence restored",
        restored_state.reference_match_confidence,
    )

    print_field(
        "target_reference_id restored",
        restored_state.target_reference_id,
    )

    # ========================================================
    # 19. FINAL ASSERTIONS
    # ========================================================

    print_section(
        "[19] FINAL VALIDATION"
    )

    assert state.nlp_state is not None

    # At this point the candidate answer has already gone
    # through extraction + reference matching + evaluation.
    # Therefore the reference should NOT be None.
    assert (
        state.reference_answer_id
        is not None
    )

    assert (
        state.reference_match_confidence
        is not None
    )

    assert (
        0.0
        <= state.reference_match_confidence
        <= 1.0
    )

    assert hasattr(
        state,
        "target_reference_id",
    )

    assert (
        final_result["assessed_dimensions"]
        == 7
    )

    assert (
        final_result["total_dimensions"]
        == 7
    )

    assert (
        final_result["average_score"]
        is not None
    )

    assert (
        len(final_result["scores"])
        == 7
    )

    assert (
        final_result["primary_classification"]
        is not None
    )

    print_field(
        "NLP extraction",
        "PASSED",
    )

    print_field(
        "Candidate NLP state",
        "PASSED",
    )

    print_field(
        "Initial reference state",
        "PASSED",
    )

    print_field(
        "Current reference",
        state.reference_answer_id,
    )

    print_field(
        "Reference match confidence",
        state.reference_match_confidence,
    )

    print_field(
        "Target reference field",
        "PRESENT",
    )

    print_field(
        "Evaluator",
        "PASSED",
    )

    print_field(
        "Classification",
        final_result[
            "primary_classification"
        ],
    )

    print_field(
        "Seven dimensions",
        "PASSED",
    )

    print_field(
        "Serialization",
        "PASSED",
    )

    # ========================================================
    # 20. FINAL SUMMARY
    # ========================================================

    print_header(
        "FULL END-TO-END TEST COMPLETE"
    )

    print()
    print("✓ Candidate answer submitted")
    print("✓ Real NLP extraction executed")
    print("✓ 11-field CandidateNLPState created")
    print("✓ No implementation_details field")
    print("✓ Existing reference dataset used")
    print("✓ Reference matcher executed")
    print("✓ Current reference identified")
    print("✓ Match confidence generated by matcher")
    print("✓ Evaluator executed")
    print("✓ Seven dimension scores generated")
    print(
        f"✓ Primary classification = "
        f"{final_result['primary_classification']}"
    )
    print("✓ Adaptive state generated")
    print("✓ target_reference_id field present")
    print("✓ Complete state serialized")
    print("✓ Complete state restored")
    print("✓ Reference state survived restoration")

    print()
    print(
        "Target reference selection was NOT invented "
        "by this test."
    )

    print()
    print("=" * 70)
    print(
        "           ALL END-TO-END ASSERTIONS PASSED"
        .center(70)
    )
    print("=" * 70)


if __name__ == "__main__":
    test_end_to_end()