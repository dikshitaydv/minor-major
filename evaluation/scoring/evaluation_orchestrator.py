from evaluation.llm.llm_evaluator import evaluate_with_llm

from evaluation.scoring.classification import (
    classify_answer
)

from evaluation.scoring.adaptive_priority import (
    get_adaptive_priority
)

from evaluation.scoring.adaptive_probe import (
    get_unassessed_probe
)

from evaluation.scoring.candidate_state import (
    CandidateEvaluationState,
    CandidateNLPState
)

from evaluation.interviewer.followup_strategy import (
    get_followup_strategy
)

from evaluation.interviewer.followup_generator import (
    generate_followup_question
)

from evaluation.interviewer.interview_controller import (
    should_continue_interview
)


def evaluate_candidate_turn(
    state: CandidateEvaluationState,
    candidate_answer: str,
    problem: dict,
    candidate_features: dict
) -> CandidateEvaluationState:
    """
    Evaluate one candidate turn and decide whether
    another interviewer follow-up is required.

    Flow:

        Candidate Answer
              ↓
        Ollama Evaluation
              ↓
        Classification
              ↓
        Adaptive Gap Detection
              ↓
        Unassessed Probe Detection
              ↓
        Continue / Stop Decision
              ↓
        Follow-Up Question OR Finish
    """

        # ==================================================
    # 0. UPDATE NLP STATE
    # ==================================================

    nlp_state = CandidateNLPState(
        approach=candidate_features.get(
            "approach",
            ""
        ),

        algorithms=candidate_features.get(
            "algorithms",
            []
        ).copy(),

        concepts=candidate_features.get(
            "concepts",
            []
        ).copy(),

        data_structures=candidate_features.get(
            "data_structures",
            []
        ).copy(),

        time_complexity=(
            candidate_features
            .get("complexity_claim", {})
            .get("time")
        ),

        space_complexity=(
            candidate_features
            .get("complexity_claim", {})
            .get("space")
        ),

        edge_cases=candidate_features.get(
            "edge_cases",
            []
        ).copy(),

        reasoning_summary=" ".join(
            candidate_features.get(
                "reasoning",
                []
            )
        ),

        confidence=1.0
    )

    state.update_nlp_state(nlp_state)
    
    # ==================================================
    # 1. OLLAMA EVALUATION
    # ==================================================

    llm_evaluation = evaluate_with_llm(
        candidate_features=candidate_features,
        problem=problem
    )

    # ==================================================
    # 2. CLASSIFICATION
    # ==================================================

    classification = classify_answer(
        candidate_features=candidate_features,
        llm_evaluation=llm_evaluation
    )

    primary_classification = classification.get(
        "primary_classification"
    )

    secondary_classification = classification.get(
        "secondary_classification"
    )

    adaptive_classifications = classification.get(
        "adaptive_classifications",
        []
    )

    # ==================================================
    # 3. EXTRACT SCORES
    # ==================================================

    llm_scores = llm_evaluation.get(
        "scores",
        {}
    )

    def extract_score(
        dimension_name: str
    ):
        dimension = llm_scores.get(
            dimension_name,
            {}
        )

        if not isinstance(
            dimension,
            dict
        ):
            return None

        score = dimension.get(
            "score"
        )

        if score is None:
            return None

        try:
            return float(score)

        except (
            TypeError,
            ValueError
        ):
            return None

    # ==================================================
    # 4. EXTRACT EVIDENCE
    # ==================================================

    def extract_evidence(
        dimension_name: str
    ):
        dimension = llm_scores.get(
            dimension_name,
            {}
        )

        if not isinstance(
            dimension,
            dict
        ):
            return None

        evidence = dimension.get(
            "evidence"
        )

        if evidence is None:
            return None

        evidence = str(
            evidence
        ).strip()

        if not evidence:
            return None

        return evidence

    # ==================================================
    # 5. CURRENT TURN SCORES
    # ==================================================

    current_scores = {
        "algorithm_correctness":
            extract_score(
                "algorithm_correctness"
            ),

        "logical_reasoning":
            extract_score(
                "logical_reasoning"
            ),

        "concept_coverage":
            extract_score(
                "concept_coverage"
            ),

        "completeness":
            extract_score(
                "completeness"
            ),

        "data_structure":
            extract_score(
                "data_structure"
            ),

        "complexity":
            extract_score(
                "complexity"
            ),

        "edge_cases":
            extract_score(
                "edge_cases"
            )
    }

    # ==================================================
    # 6. CURRENT TURN EVIDENCE
    # ==================================================

    current_evidence = {
        "algorithm_correctness":
            extract_evidence(
                "algorithm_correctness"
            ),

        "logical_reasoning":
            extract_evidence(
                "logical_reasoning"
            ),

        "concept_coverage":
            extract_evidence(
                "concept_coverage"
            ),

        "completeness":
            extract_evidence(
                "completeness"
            ),

        "data_structure":
            extract_evidence(
                "data_structure"
            ),

        "complexity":
            extract_evidence(
                "complexity"
            ),

        "edge_cases":
            extract_evidence(
                "edge_cases"
            )
    }

    # ==================================================
    # 7. UPDATE STATE
    # ==================================================

    state.update(
        candidate_answer=candidate_answer,

        scores=current_scores,

        primary_classification=(
            primary_classification
        ),

        secondary_classification=(
            secondary_classification
        ),

        adaptive_classifications=(
            adaptive_classifications
        ),

        primary_adaptive_gap=None,

        evidence=current_evidence
    )

    # ==================================================
    # 8. DETERMINE REAL ADAPTIVE GAP
    # ==================================================

    primary_adaptive_gap = None

    if adaptive_classifications:

        primary_adaptive_gap = (
            get_adaptive_priority(
                llm_evaluation=llm_evaluation,

                adaptive_classifications=(
                    adaptive_classifications
                )
            )
        )

    # ==================================================
    # 9. DETERMINE UNASSESSED PROBE
    # ==================================================

    adaptive_probe = None

    if primary_adaptive_gap is None:

        previously_probed = []

        for previous_turn in state.history:

            if not isinstance(
                previous_turn,
                dict
            ):
                continue

            previous_gap = (
                previous_turn.get(
                    "primary_adaptive_gap"
                )
            )

            if previous_gap:

                previously_probed.append(
                    previous_gap
                )

        adaptive_probe = (
            get_unassessed_probe(
                llm_evaluation=llm_evaluation,

                already_probed=(
                    previously_probed
                )
            )
        )

    # ==================================================
    # 10. STORE REAL GAP
    # ==================================================

    state.primary_adaptive_gap = (
        primary_adaptive_gap
    )

    # ==================================================
    # 11. CONTINUE / STOP DECISION
    # ==================================================

    should_continue = (
        should_continue_interview(
            state=state,

            llm_evaluation=(
                llm_evaluation
            ),

            adaptive_classifications=(
                adaptive_classifications
            ),

            adaptive_probe=(
                adaptive_probe
            )
        )
    )

    # Store this as a convenient state attribute.
    # CandidateEvaluationState does not declare this field,
    # so set it dynamically to avoid static type errors.
    setattr(
        state,
        "should_continue",
        should_continue,
    )

    # ==================================================
    # 12. STOP
    # ==================================================

    if not should_continue:

        # CandidateEvaluationState requires
        # interviewer_question to be a string.
        # Empty string means there is no next question.

        

        return state

    # ==================================================
    # 13. DETERMINE FOLLOW-UP TARGET
    # ==================================================

    followup_target = (
        primary_adaptive_gap
        if primary_adaptive_gap
        else adaptive_probe
    )

    # There should normally be a target when
    # should_continue == True.

    if not followup_target:

       

        return state

    # ==================================================
    # 14. GET FOLLOW-UP STRATEGY
    # ==================================================

    followup_strategy = (
        get_followup_strategy(
            followup_target
        )
    )

    if not followup_strategy:

       

        return state

    # ==================================================
    # 15. GENERATE FOLLOW-UP QUESTION
    # ==================================================

    state_dict = state.to_dict()

    state_dict[
        "adaptive_probe"
    ] = adaptive_probe

    state_dict[
        "should_continue"
    ] = should_continue

    followup_question = (
        generate_followup_question(
            problem=problem,

            candidate_answer=(
                candidate_answer
            ),

            candidate_state=(
                state_dict
            ),

            followup_strategy=(
                followup_strategy
            )
        )
    )

    # ==================================================
    # 16. VALIDATE GENERATED QUESTION
    # ==================================================

    if isinstance(
        followup_question,
        dict
    ):

        followup_question = (
            followup_question.get(
                "question"
            )
        )

    if not isinstance(
        followup_question,
        str
    ):

        raise RuntimeError(
            "Follow-up generator did not return "
            "a valid question string."
        )

    followup_question = (
        followup_question.strip()
    )

    if not followup_question:

        raise RuntimeError(
            "Follow-up generator returned "
            "an empty question."
        )

    # ==================================================
    # 17. STORE FOLLOW-UP QUESTION
    # ==================================================

    state.set_interviewer_question(
        followup_question
    )

    # ==================================================
    # 18. RETURN UPDATED STATE
    # ==================================================

    return state