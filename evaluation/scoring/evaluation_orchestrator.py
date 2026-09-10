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
    CandidateEvaluationState,
    CandidateNLPState
)

from evaluation.scoring.reference_matcher import (
    match_reference_solution_with_confidence
)


from evaluation.dataset_loader import (
    load_evaluation_context
)


# ============================================================
# DIAGNOSTIC HELPERS
# ============================================================

def _print_section(title: str):
    print()
    print(f"{title}")
    print("-" * len(title))


def _display(value):
    if value is None:
        return "Not identified"

    if isinstance(value, list):
        if not value:
            return "None identified"

        return ", ".join(
            str(item)
            for item in value
            if str(item).strip()
        ) or "None identified"

    value = str(value).strip()

    return value or "Not identified"


def _print_nlp_state(
    candidate_state: dict
):
    _print_section("NLP EXTRACTION")

    fields = [
        ("Approach", "approach"),
        ("Algorithms", "algorithms"),
        ("Concepts", "concepts"),
        ("Operations", "operations"),
        ("Data Structures", "data_structures"),
        ("Time Complexity", "time_complexity"),
        ("Space Complexity", "space_complexity"),
        ("Edge Cases", "edge_cases"),
        ("Reasoning Summary", "reasoning_summary"),
        ("Assumptions", "assumptions"),
        ("Optimization", "optimization"),
    ]

    for label, key in fields:
        print(
            f"{label:<24}: {_display(candidate_state.get(key))}"
        )


def _print_evaluation(
    llm_evaluation: dict
):
    _print_section("EVALUATION")

    scores = llm_evaluation.get(
        "scores",
        {}
    )

    if not isinstance(scores, dict):
        scores = {}

    dimensions = [
        (
            "Algorithm Correctness",
            "algorithm_correctness"
        ),
        (
            "Logical Reasoning",
            "logical_reasoning"
        ),
        (
            "Concept Coverage",
            "concept_coverage"
        ),
        (
            "Completeness",
            "completeness"
        ),
        (
            "Data Structure",
            "data_structure"
        ),
        (
            "Complexity",
            "complexity"
        ),
        (
            "Edge Cases",
            "edge_cases"
        ),
    ]

    for label, key in dimensions:

        dimension = scores.get(
            key,
            {}
        )

        if not isinstance(
            dimension,
            dict
        ):
            dimension = {}

        score = dimension.get(
            "score"
        )

        if score is None:
            display_score = "NOT ASSESSED"
        else:
            display_score = f"{score}/100"

        print(
            f"{label:<24}: {display_score}"
        )

    classification = llm_evaluation.get(
        "classification"
    )

    if classification:
        print(
            f"{'Classification':<24}: "
            f"{_display(classification)}"
        )


def _print_classification(
    classification: dict
):
    primary = classification.get(
        "primary_classification"
    )

    secondary = classification.get(
        "secondary_classification"
    )

    if primary:
        print(
            f"{'Primary Classification':<24}: "
            f"{primary}"
        )

    if secondary:
        print(
            f"{'Secondary Classification':<24}: "
            f"{secondary}"
        )


def _print_adaptive(
    should_continue: bool,
    primary_adaptive_gap,
    adaptive_probe
):
    _print_section("ADAPTIVE")

    decision = (
        "CONTINUE"
        if should_continue
        else "FINISH"
    )

    print(
        f"{'Decision':<24}: {decision}"
    )

    if primary_adaptive_gap:
        print(
            f"{'Gap':<24}: "
            f"{primary_adaptive_gap}"
        )

    elif adaptive_probe:
        print(
            f"{'Probe':<24}: "
            f"{adaptive_probe}"
        )


def _print_followup(
    followup_strategy,
    followup_question
):
    _print_section("FOLLOW-UP")

    print(
        f"{'Strategy':<24}: "
        f"{_display(followup_strategy)}"
    )

    print(
        f"{'Question':<24}: "
        f"{followup_question}"
    )


# ============================================================
# MAIN EVALUATION PIPELINE
# ============================================================

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
        Candidate NLP State
              |
              v
        Reference Matching
              |
              v
        Current Reference
        + Match Confidence
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
    # TURN NUMBER
    # ==================================================

    current_turn = (
        len(state.history) + 1
    )

    print()
    print("=" * 60)
    print(
        f"TURN {current_turn}"
        .center(60)
    )
    print("=" * 60)

    # ==================================================
    # 1. CANDIDATE NLP STATE
    # ==================================================

    new_nlp_state = CandidateNLPState(
        approach=candidate_features.get(
            "approach"
        ),

        algorithms=list(
            candidate_features.get(
                "algorithms"
            ) or []
        ),

        concepts=list(
            candidate_features.get(
                "concepts"
            )
            or candidate_features.get(
                "concepts_detected"
            )
            or []
        ),

        operations=list(
            candidate_features.get(
                "operations"
            ) or []
        ),

        data_structures=list(
            candidate_features.get(
                "data_structures"
            ) or []
        ),

        time_complexity=(
            candidate_features.get(
                "time_complexity"
            )
            or (
                candidate_features.get(
                    "complexity_claim"
                ) or {}
            ).get("time")
        ),

        space_complexity=(
            candidate_features.get(
                "space_complexity"
            )
            or (
                candidate_features.get(
                    "complexity_claim"
                ) or {}
            ).get("space")
        ),

        edge_cases=list(
            candidate_features.get(
                "edge_cases"
            ) or []
        ),

        reasoning_summary=(
            candidate_features.get(
                "reasoning_summary"
            )
            or " ".join(
                candidate_features.get(
                    "reasoning"
                ) or []
            )
            or None
        ),

        assumptions=list(
            candidate_features.get(
                "assumptions"
            ) or []
        ),

        optimization=(
            candidate_features.get(
                "optimization"
            )
        ),
    )

    # Merge this turn's newly extracted NLP
    # information into the persistent candidate state.
    state.update_nlp_state(
        new_nlp_state
    )

    candidate_state = (
        state.nlp_state.to_dict()
    )

    _print_nlp_state(
        candidate_state
    )

    # ==================================================
    # 2. REFERENCE MATCHING
    # ==================================================

    reference_solutions, rubric = (
        load_evaluation_context(
            problem
        )
    )

    (
        matched_reference_id,
        match_confidence,
    ) = match_reference_solution_with_confidence(
        candidate_state=candidate_state,
        reference_solutions=reference_solutions
    )

    # Persist the matcher result.
    #
    # At session start these fields are None.
    # After a candidate answer is processed, the matcher
    # populates them when a match is found.
    state.reference_answer_id = (
        matched_reference_id
    )

    state.reference_match_confidence = (
        match_confidence
    )

    _print_section(
        "REFERENCE MATCH"
    )

    print(
        f"{'Selected':<24}: "
        f"{_display(matched_reference_id)}"
    )

    print(
        f"{'Confidence':<24}: "
        f"{_display(match_confidence)}"
    )

    # ==================================================
    # 3. FIND SELECTED REFERENCE
    # ==================================================

    matched_reference = None

    evaluation_reference_id = (
        matched_reference_id
    )

    if evaluation_reference_id is not None:

        for reference in reference_solutions:

            if not isinstance(
                reference,
                dict
            ):
                continue

            reference_id = (
                reference.get(
                    "Reference ID"
                )
                or reference.get(
                    "reference_id"
                )
            )

            if reference_id == evaluation_reference_id:
                matched_reference = reference
                break

    if matched_reference is None and evaluation_reference_id is not None:
        raise RuntimeError(
        "Matched reference ID was not found "
        "in the supplied reference set.")

    # ==================================================
    # 4. LLM EVALUATION
    # ==================================================

    llm_evaluation = evaluate_with_llm(
        candidate_features=candidate_features,
        problem=problem,
        reference_solution=matched_reference,
        rubric=rubric,
        candidate_state=candidate_state
    )

    if not isinstance(
        llm_evaluation,
        dict
    ):
        raise RuntimeError(
            "LLM evaluator must return a dictionary."
        )

    _print_evaluation(
        llm_evaluation
    )

    # ==================================================
    # 5. CLASSIFICATION
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

    _print_classification(
        classification
    )

    # ==================================================
    # 6. SCORES
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
    # 8. ADAPTIVE GAP
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
    # 9. UNASSESSED PROBE
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
    # 10. UPDATE HISTORY
    # ==================================================

    if state.history:

        state.history[-1][
            "primary_adaptive_gap"
        ] = primary_adaptive_gap


    return state