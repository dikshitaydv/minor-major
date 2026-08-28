from evaluation.extraction.extraction_service import (
    extract_candidate_features
)
from adaptive.policy_engine import PolicyEngine
from evaluation.scoring.candidate_state import (
    CandidateEvaluationState
)

from evaluation.scoring.evaluation_orchestrator import (
    evaluate_candidate_turn
)

from evaluation.scoring.final_result import (
    build_final_result
)


class InterviewSession:
    """
    Controls the complete adaptive interview session.

    Flow:

        Candidate Answer
              ↓
        Evaluate Turn
              ↓
        Continue?
          /       \
        YES        NO
         ↓          ↓
    Follow-up     Finish
         ↓
    Candidate Answer
         ↓
       Next Turn
    """

    def __init__(
    self,
    candidate_id: str,
    question_id: str,
    problem: dict,
    time_remaining: int = 600,
    candidate_level: str = "medium"
    ):
        self.problem = problem

        self.time_remaining = time_remaining
        self.candidate_level = candidate_level

        self.state = CandidateEvaluationState(
            candidate_id=candidate_id,
            question_id=question_id
        )

        self.policy_engine = PolicyEngine()

        self.finished = False

    # ==================================================
    # SUBMIT CANDIDATE ANSWER
    # ==================================================

    def submit_answer(
        self,
        candidate_answer: str,
        candidate_features: dict | None = None
    ) -> CandidateEvaluationState:
        """
        Submit one candidate answer to the adaptive
        evaluation pipeline.
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

        if not candidate_answer.strip():

            raise ValueError(
                "Candidate answer cannot be empty."
            )

        # ----------------------------------------------
        # Extract NLP features when they are not supplied
        # ----------------------------------------------

        if candidate_features is None:
            candidate_features = extract_candidate_features(
                candidate_answer
            )
        
        # ----------------------------------------------
        # Evaluate current turn
        # ----------------------------------------------

        self.state = evaluate_candidate_turn(
            state=self.state,

            candidate_answer=candidate_answer,

            problem=self.problem,

            candidate_features=candidate_features
        )

        # ----------------------------------------------
        # Apply adaptive interview policy
        # ----------------------------------------------

        policy_decision = self.policy_engine.decide(
        scores=self.state.scores,
        time_remaining=self.time_remaining,
        candidate_level=self.candidate_level
        )

        print()
        print("Policy Decision:")
        print(policy_decision)

        # ----------------------------------------------
        # Check whether interview continues
        # ----------------------------------------------

        should_continue = getattr(
            self.state,
            "should_continue",
            False
        )

        if not should_continue:

            self.finished = True

        return self.state

    # ==================================================
    # GET NEXT QUESTION
    # ==================================================

    def get_next_question(self):
        """
        Return the next interviewer question.

        Returns None if the interview has finished.
        """

        if self.finished:

            return None

        return getattr(
            self.state,
            "current_interviewer_question",
            None
        )

    # ==================================================
    # CHECK FINISHED
    # ==================================================

    def is_finished(self) -> bool:
        """
        Return True when the interview is complete.
        """

        return self.finished

    # ==================================================
    # GET CURRENT STATE
    # ==================================================

    def get_state(
        self
    ) -> CandidateEvaluationState:
        """
        Return the current interview state.
        """

        return self.state

    # ==================================================
    # GET FINAL STATE
    # ==================================================

    def get_final_state(
        self
    ) -> CandidateEvaluationState:
        """
        Return the final CandidateEvaluationState.

        This should only be called after the interview
        has finished.
        """

        if not self.finished:

            raise RuntimeError(
                "Interview is still in progress."
            )

        return self.state

    # ==================================================
    # GET FINAL RESULT
    # ==================================================

    def get_final_result(self) -> dict:
        """
        Build and return the final interview result.

        This can only be called after the interview
        has finished.
        """

        if not self.finished:

            raise RuntimeError(
                "Cannot generate final result while "
                "the interview is still in progress."
            )


        return build_final_result(
            self.state
        )