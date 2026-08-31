from evaluation.llm.llm_evaluator import (
    evaluate_with_llm
)

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
    CandidateEvaluationState
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

from evaluation.dataset_loader import (
    load_evaluation_context
)


def evaluate_candidate_turn(
    state: CandidateEvaluationState,
    candidate_answer: str,
    problem: dict,
    candidate_features: dict
) -> CandidateEvaluationState:
    """
    Evaluate one candidate turn.

    Pipeline:

        Candidate Answer
              |
              v
        LLM NLP Extraction
              |
              v
        Candidate State
              |
              v
        Reference Solution + Rubric
              |
              v
        LLM Evaluation
              |
              v
        Classification
              |
              v
        Scores
              |
              v
        Adaptive Interview
    """

    # ==================================================
    # VALIDATION
    # ==================================================

    if not isinstance(
        state,
        CandidateEvaluationState
    ):
        raise TypeError(
            "state must be a CandidateEvaluationState."
        )

    if not isinstance(
        candidate_features,
        dict
    ):
        raise TypeError(
            "candidate_features must be a dictionary."
        )

    if not isinstance(
        problem,
        dict
    ):
        raise TypeError(
            "problem must be a dictionary."
        )

    # ==================================================
    # 1. LOAD QUESTION-SPECIFIC DATASET CONTEXT
    # ==================================================

    reference_solution, rubric = (
        load_evaluation_context(problem)
    )

    print()
    print("=" * 60)
    print("             DATASET CONTEXT LOADED")
    print("=" * 60)
    print(
        f"Problem ID : "
        f"{problem.get('problem_id', problem.get('id'))}"
    )
    print(
        "Reference  : loaded"
    )
    print(
        "Rubric     : loaded"
    )
    print("=" * 60)
    print()

    # ==================================================
    # 2. LLM EVALUATION
    # ==================================================

    llm_evaluation = evaluate_with_llm(
        candidate_features=candidate_features,
        problem=problem,
        reference_solution=reference_solution,
        rubric=rubric,
        candidate_state=state.nlp_state.to_dict()
    )

    if not isinstance(
        llm_evaluation,
        dict
    ):
        raise RuntimeError(
            "LLM evaluator must return a dictionary."
        )

    # ==================================================
    # 3. CLASSIFICATION
    # ==================================================

    classification = classify_answer(
        candidate_features=candidate_features,
        llm_evaluation=llm_evaluation
    )

    if not isinstance(
        classification,
        dict
    ):
        classification = {}

    primary_classification = (
        classification.get(
            "primary_classification"
        )
    )

    secondary_classification = (
        classification.get(
            "secondary_classification"
        )
    )

    adaptive_classifications = (
        classification.get(
            "adaptive_classifications",
            []
        )
        or []
    )

    # ==================================================
    # 4. LLM SCORES
    # ==================================================

    llm_scores = llm_evaluation.get(
        "scores",
        {}
    )

    if not isinstance(
        llm_scores,
        dict
    ):
        llm_scores = {}

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

        return evidence or None

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
            ),
    }

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
            ),
    }

    # ==================================================
    # 6. UPDATE EVALUATION STATE
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
    # 7. ADAPTIVE GAP
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
    # 8. UNASSESSED PROBE
    # ==================================================

    adaptive_probe = None

    if primary_adaptive_gap is None:

        previously_probed = []

        for previous_turn in (
            state.history[:-1]
        ):

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
                already_probed=previously_probed
            )
        )

    state.primary_adaptive_gap = (
        primary_adaptive_gap
    )

    # ==================================================
    # 9. UPDATE HISTORY
    # ==================================================

    if state.history:

        state.history[-1][
            "primary_adaptive_gap"
        ] = primary_adaptive_gap

    # ==================================================
    # 10. CONTINUE / STOP
    # ==================================================

    should_continue = (
        should_continue_interview(
            state=state,
            llm_evaluation=llm_evaluation,
            adaptive_classifications=(
                adaptive_classifications
            ),
            adaptive_probe=adaptive_probe
        )
    )

    state.should_continue = bool(
        should_continue
    )

    if not state.should_continue:
        return state

    # ==================================================
    # 11. FOLLOW-UP TARGET
    # ==================================================

    followup_target = (
        primary_adaptive_gap
        if primary_adaptive_gap
        else adaptive_probe
    )

    if not followup_target:
        return state

    # ==================================================
    # 12. FOLLOW-UP STRATEGY
    # ==================================================

    followup_strategy = (
        get_followup_strategy(
            followup_target
        )
    )

    if not followup_strategy:
        return state

    # ==================================================
    # 13. FOLLOW-UP QUESTION
    # ==================================================

    state_dict = state.to_dict()

    state_dict[
        "adaptive_probe"
    ] = adaptive_probe

    state_dict[
        "should_continue"
    ] = state.should_continue

    followup_question = (
        generate_followup_question(
            problem=problem,
            candidate_answer=candidate_answer,
            candidate_state=state_dict,
            followup_strategy=(
                followup_strategy
            )
        )
    )

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
            "Follow-up generator did not "
            "return a valid question string."
        )

    followup_question = (
        followup_question.strip()
    )

    if not followup_question:
        raise RuntimeError(
            "Follow-up generator returned "
            "an empty question."
        )

    state.set_interviewer_question(
        followup_question
    )

    return state