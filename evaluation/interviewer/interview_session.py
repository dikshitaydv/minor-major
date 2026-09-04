from typing import Optional

from evaluation.extraction.extraction_service import (
    extract_candidate_features
)

from evaluation.persistence.candidate_state_store import (
    CandidateStateStore
)

from adaptive.policy_engine import (
    PolicyEngine
)

from evaluation.scoring.candidate_state import (
    CandidateEvaluationState,
    CandidateNLPState
)

from evaluation.scoring.evaluation_orchestrator import (
    evaluate_candidate_turn
)

from evaluation.scoring.final_result import (
    build_final_result
)


# ============================================================
# DIAGNOSTIC HELPERS
# ============================================================

def _print_section(title: str):
    print()
    print(title)
    print("-" * len(title))


def _display(value):
    if value is None:
        return "Not identified"

    if isinstance(value, list):

        values = [
            str(item).strip()
            for item in value
            if str(item).strip()
        ]

        return (
            ", ".join(values)
            if values
            else "None identified"
        )

    value = str(value).strip()

    return (
        value
        if value
        else "Not identified"
    )


def _print_candidate_answer(
    candidate_answer: str
):
    _print_section(
        "CANDIDATE ANSWER"
    )

    print(
        candidate_answer
    )


def _print_nlp_extraction(
    candidate_features: dict
):
    _print_section(
        "NLP EXTRACTION"
    )

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
            f"{label:<24}: "
            f"{_display(candidate_features.get(key))}"
        )


# ============================================================
# INTERVIEW SESSION
# ============================================================

class InterviewSession:
    """
    Controls one complete adaptive interview session.

    Pipeline:

        Candidate Answer
              |
              v
        LLM NLP Extraction
              |
              v
        CandidateNLPState
              |
              v
        CandidateEvaluationState
              |
              v
        SAVE NLP STATE
              |
              v
        Evaluation Engine
              |
              v
        SAVE EVALUATION STATE
              |
              v
        Adaptive Policy
              |
              v
        Follow-Up / Finish

    Semantic NLP extraction is performed only by the LLM extractor.
    This class does not perform regex, keyword, rule-based,
    or heuristic semantic extraction.
    """

    def __init__(
        self,
        candidate_id: str,
        question_id: str,
        problem: dict,
        time_remaining: int = 600,
        candidate_level: str = "medium",
        state_store: Optional[CandidateStateStore] = None,
        resume_existing: bool = True
    ):
        if not candidate_id:
            raise ValueError(
                "candidate_id cannot be empty."
            )

        if not question_id:
            raise ValueError(
                "question_id cannot be empty."
            )

        if not isinstance(
            problem,
            dict
        ):
            raise TypeError(
                "problem must be a dictionary."
            )

        self.problem = problem
        self.time_remaining = time_remaining
        self.candidate_level = candidate_level

        self.state_store = (
            state_store
            if state_store is not None
            else CandidateStateStore()
        )

        if (
            resume_existing
            and self.state_store.exists(
                candidate_id,
                question_id
            )
        ):
            self.state = (
                self.state_store.load(
                    candidate_id,
                    question_id
                )
            )
        else:
            self.state = (
                CandidateEvaluationState(
                    candidate_id=candidate_id,
                    question_id=question_id
                )
            )

        self.policy_engine = (
            PolicyEngine()
        )

        self.finished = False

    # ========================================================
    # SUBMIT ANSWER
    # ========================================================

    def submit_answer(
        self,
        candidate_answer: str,
        candidate_features: Optional[dict] = None
    ) -> CandidateEvaluationState:
        """
        Submit one candidate answer.

        If candidate_features is omitted, the LLM extraction
        service performs semantic extraction.

        The extracted information is converted into
        CandidateNLPState and merged into the existing
        CandidateEvaluationState.

        The accumulated state is persisted BEFORE evaluation.
        """

        if self.finished:
            raise RuntimeError(
                "Interview session has already finished."
            )

        if not isinstance(
            candidate_answer,
            str
        ):
            raise TypeError(
                "Candidate answer must be a string."
            )

        candidate_answer = (
            candidate_answer.strip()
        )

        if not candidate_answer:
            raise ValueError(
                "Candidate answer cannot be empty."
            )

        current_turn = (
            len(self.state.history) + 1
        )

        print()
        print("=" * 60)
        print(
            f"TURN {current_turn}"
            .center(60)
        )
        print("=" * 60)

        # ====================================================
        # 1. CANDIDATE ANSWER
        # ====================================================

        _print_candidate_answer(
            candidate_answer
        )

        # ====================================================
        # 2. LLM NLP EXTRACTION
        # ====================================================

        if candidate_features is None:

            candidate_features = (
                extract_candidate_features(
                    candidate_answer,
                    self.problem
                )
            )

        if not isinstance(
            candidate_features,
            dict
        ):
            raise TypeError(
                "candidate_features must be a dictionary."
            )

        _print_nlp_extraction(
            candidate_features
        )

        # ====================================================
        # 3. BUILD NLP STATE
        # ====================================================

        nlp_state = (
            self._build_nlp_state(
                candidate_features
            )
        )

        # ====================================================
        # 4. MERGE NLP STATE
        # ====================================================

        self.state.update_nlp_state(
            nlp_state
        )

        # ====================================================
        # 5. SAVE NLP STATE
        # ====================================================

        nlp_path = (
            self.state_store.save(
                self.state
            )
        )

        print()
        print(
            f"NLP state saved: {nlp_path}"
        )

        # ====================================================
        # 6. EVALUATION
        # ====================================================

        self.state = (
            evaluate_candidate_turn(
                state=self.state,
                candidate_answer=candidate_answer,
                problem=self.problem,
                candidate_features=candidate_features
            )
        )

        # ====================================================
        # 7. SAVE COMPLETE STATE
        # ====================================================

        evaluation_path = (
            self.state_store.save(
                self.state
            )
        )

        print()
        print(
            f"Evaluation state saved: "
            f"{evaluation_path}"
        )

        # ====================================================
        # 8. ADAPTIVE POLICY
        # ====================================================

        policy_decision = (
            self.policy_engine.decide(
                scores=self.state.scores,
                time_remaining=self.time_remaining,
                candidate_level=self.candidate_level
            )
        )

        # Keep policy execution intact.
        # Only display its result cleanly.

        if isinstance(
            policy_decision,
            dict
        ):

            decision = (
                policy_decision.get(
                    "decision"
                )
                or policy_decision.get(
                    "action"
                )
            )

            if decision:
                print()
                print(
                    f"Policy: {decision}"
                )

        # ====================================================
        # 9. FINISH / CONTINUE
        # ====================================================

        if not self.state.should_continue:

            self.finished = True

            print()
            print(
                f"INTERVIEW FINISHED — TURN {current_turn}"
            )

        else:

            print()
            print(
                f"TURN {current_turn} COMPLETE"
            )

            if self.state.current_interviewer_question:

                print()
                print(
                    "NEXT QUESTION"
                )
                print(
                    self.state.current_interviewer_question
                )

        return self.state

    # ========================================================
    # NLP STATE MAPPING
    # ========================================================

    @staticmethod
    def _build_nlp_state(
        candidate_features: dict
    ) -> CandidateNLPState:
        """
        Convert the LLM extractor's dictionary into
        CandidateNLPState.

        No semantic extraction occurs here.

        This method performs only structural mapping.
        """

        return CandidateNLPState(
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
                ) or []
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

            time_complexity=candidate_features.get(
                "time_complexity"
            ),

            space_complexity=candidate_features.get(
                "space_complexity"
            ),

            edge_cases=list(
                candidate_features.get(
                    "edge_cases"
                ) or []
            ),

            assumptions=list(
                candidate_features.get(
                    "assumptions"
                ) or []
            ),

            reasoning_summary=candidate_features.get(
                "reasoning_summary"
            ),

            optimization=candidate_features.get(
                "optimization"
            )
        )

    # ========================================================
    # LOAD SAVED STATE
    # ========================================================

    def load_saved_state(
        self
    ) -> CandidateEvaluationState:

        self.state = (
            self.state_store.load(
                candidate_id=self.state.candidate_id,
                question_id=self.state.question_id
            )
        )

        return self.state

    # ========================================================
    # RELOAD STATE
    # ========================================================

    def reload_state(
        self
    ) -> CandidateEvaluationState:

        return self.load_saved_state()

    # ========================================================
    # FORCE SAVE
    # ========================================================

    def save_state(
        self
    ) -> str:

        return self.state_store.save(
            self.state
        )

    # ========================================================
    # NEXT QUESTION
    # ========================================================

    def get_next_question(
        self
    ):

        if self.finished:
            return None

        return (
            self.state.current_interviewer_question
        )

    # ========================================================
    # FINISHED
    # ========================================================

    def is_finished(
        self
    ) -> bool:

        return self.finished

    # ========================================================
    # CURRENT STATE
    # ========================================================

    def get_state(
        self
    ) -> CandidateEvaluationState:

        return self.state

    # ========================================================
    # FINAL STATE
    # ========================================================

    def get_final_state(
        self
    ) -> CandidateEvaluationState:

        if not self.finished:
            raise RuntimeError(
                "Interview is still in progress."
            )

        return self.state

    # ========================================================
    # FINAL RESULT
    # ========================================================

    def get_final_result(
        self
    ) -> dict:

        if not self.finished:
            raise RuntimeError(
                "Cannot generate final result while "
                "the interview is still in progress."
            )

        return build_final_result(
            self.state
        )