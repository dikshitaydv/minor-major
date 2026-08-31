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

        if not isinstance(problem, dict):
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
            self.state = self.state_store.load(
                candidate_id,
                question_id
            )
        else:
            self.state = CandidateEvaluationState(
                candidate_id=candidate_id,
                question_id=question_id
            )

        self.policy_engine = PolicyEngine()

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

        if not isinstance(candidate_answer, str):
            raise TypeError(
                "Candidate answer must be a string."
            )

        candidate_answer = candidate_answer.strip()

        if not candidate_answer:
            raise ValueError(
                "Candidate answer cannot be empty."
            )

        # ====================================================
        # 1. LLM NLP EXTRACTION
        # ====================================================

        if candidate_features is None:
            candidate_features = extract_candidate_features(
                candidate_answer,
                self.problem
            )

        if not isinstance(candidate_features, dict):
            raise TypeError(
                "candidate_features must be a dictionary."
            )

        # ====================================================
        # 2. BUILD NLP STATE
        # ====================================================

        nlp_state = self._build_nlp_state(
            candidate_features
        )

        # ====================================================
        # 3. MERGE INTO ACCUMULATED STATE
        # ====================================================

        self.state.update_nlp_state(
            nlp_state
        )

        # ====================================================
        # 4. SAVE NLP STATE
        # ====================================================

        nlp_path = self.state_store.save(
            self.state
        )

        print()
        print("NLP Candidate State Saved:")
        print(nlp_path)

        # ====================================================
        # 5. EVALUATION
        # ====================================================

        self.state = evaluate_candidate_turn(
            state=self.state,
            candidate_answer=candidate_answer,
            problem=self.problem,
            candidate_features=candidate_features
        )

        # ====================================================
        # 6. SAVE COMPLETE STATE
        # ====================================================

        evaluation_path = self.state_store.save(
            self.state
        )

        print()
        print("Evaluation State Saved:")
        print(evaluation_path)

        # ====================================================
        # 7. ADAPTIVE POLICY
        # ====================================================

        policy_decision = self.policy_engine.decide(
            scores=self.state.scores,
            time_remaining=self.time_remaining,
            candidate_level=self.candidate_level
        )

        print()
        print("Policy Decision:")
        print(policy_decision)

        # ====================================================
        # 8. FINISH / CONTINUE
        # ====================================================

        if not self.state.should_continue:
            self.finished = True

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

        complexity = candidate_features.get(
            "complexity_claim",
            {}
        )

        if not isinstance(complexity, dict):
            complexity = {}

        time_complexity = complexity.get(
            "time"
        )

        if time_complexity is None:
            time_complexity = candidate_features.get(
                "time_complexity"
            )

        space_complexity = complexity.get(
            "space"
        )

        if space_complexity is None:
            space_complexity = candidate_features.get(
                "space_complexity"
            )

        # ----------------------------------------------------
        # Confidence
        #
        # The new LLM extraction schema does not contain
        # confidence. Preserve compatibility with the existing
        # CandidateNLPState structure by defaulting to 0.0.
        # ----------------------------------------------------

        confidence = candidate_features.get(
            "confidence",
            0.0
        )

        try:
            confidence = float(
                confidence
            )
        except (
            TypeError,
            ValueError
        ):
            confidence = 0.0

        confidence = max(
            0.0,
            min(
                1.0,
                confidence
            )
        )

        # ----------------------------------------------------
        # Reasoning
        # ----------------------------------------------------

        reasoning_summary = candidate_features.get(
            "reasoning_summary"
        )

        if not reasoning_summary:
            reasoning = candidate_features.get(
                "reasoning",
                []
            )

            if reasoning:
                reasoning_summary = " ".join(
                    str(item).strip()
                    for item in reasoning
                    if str(item).strip()
                ) or None

        # ----------------------------------------------------
        # Build CandidateNLPState
        # ----------------------------------------------------

        return CandidateNLPState(
            approach=candidate_features.get(
                "approach"
            ),

            algorithms=list(
                candidate_features.get(
                    "algorithms",
                    []
                ) or []
            ),

            concepts=list(
                candidate_features.get(
                    "concepts",
                    []
                ) or []
            ),

            data_structures=list(
                candidate_features.get(
                    "data_structures",
                    []
                ) or []
            ),

            time_complexity=time_complexity,

            space_complexity=space_complexity,

            edge_cases=list(
                candidate_features.get(
                    "edge_cases",
                    []
                ) or []
            ),

            reasoning_summary=reasoning_summary,

            assumptions=list(
                candidate_features.get(
                    "assumptions",
                    []
                ) or []
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

        self.state = self.state_store.load(
            candidate_id=self.state.candidate_id,
            question_id=self.state.question_id
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

        return self.state.current_interviewer_question

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