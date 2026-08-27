from dataclasses import dataclass, field
from typing import Optional, Dict, List, Any

@dataclass
class CandidateNLPState:
    """
    Structured representation of information extracted from
    the candidate's natural-language coding response.

    This state represents what the candidate said or expressed.
    It does NOT determine whether the candidate's claims are correct
    and does NOT assign evaluation scores.
    """

    approach: str = ""

    algorithms: List[str] = field(
        default_factory=list
    )

    concepts: List[str] = field(
        default_factory=list
    )

    data_structures: List[str] = field(
        default_factory=list
    )

    time_complexity: Optional[str] = None

    space_complexity: Optional[str] = None

    edge_cases: List[str] = field(
        default_factory=list
    )

    reasoning_summary: str = ""

    confidence: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert NLP state into a dictionary suitable for
        passing to the evaluation layer.
        """

        return {
            "approach": self.approach,
            "algorithms": self.algorithms.copy(),
            "concepts": self.concepts.copy(),
            "data_structures": self.data_structures.copy(),
            "time_complexity": self.time_complexity,
            "space_complexity": self.space_complexity,
            "edge_cases": self.edge_cases.copy(),
            "reasoning_summary": self.reasoning_summary,
            "confidence": self.confidence
        }
@dataclass
class CandidateEvaluationState:
    """
    Represents the candidate's current evaluation state
    for one coding interview question.

    The state is updated after every candidate response.

    Newly assessed scores replace previous scores.

    NOT_ASSESSED dimensions do not erase previously
    established scores.

    Interviewer questions are stored so the system can
    maintain conversational context and avoid repetition.
    """

    # ==================================================
    # IDENTIFICATION
    # ==================================================

    candidate_id: str
    question_id: str

    # ==================================================
    # CONVERSATION
    # ==================================================

    turn_number: int = 1

    current_answer: str = ""

    current_interviewer_question: Optional[str] = None
    
    # ==================================================
    # NLP / CONTEXT STATE
    # ==================================================

    nlp_state: CandidateNLPState = field(
        default_factory=CandidateNLPState
    )

    # ==================================================
    # CURRENT SCORES
    # ==================================================

    scores: dict = field(
        default_factory=lambda: {
            "algorithm_correctness": None,
            "logical_reasoning": None,
            "concept_coverage": None,
            "completeness": None,
            "data_structure": None,
            "complexity": None,
            "edge_cases": None
        }
    )

    # ==================================================
    # CURRENT CLASSIFICATION
    # ==================================================

    primary_classification: Optional[str] = None

    secondary_classification: Optional[str] = None

    adaptive_classifications: list = field(
        default_factory=list
    )

    primary_adaptive_gap: Optional[str] = None

    # ==================================================
    # DIMENSION EVIDENCE
    # ==================================================

    evidence: dict = field(
        default_factory=lambda: {
            "algorithm_correctness": None,
            "logical_reasoning": None,
            "concept_coverage": None,
            "completeness": None,
            "data_structure": None,
            "complexity": None,
            "edge_cases": None
        }
    )

    # ==================================================
    # HISTORY
    # ==================================================

    history: list = field(
        default_factory=list
    )

    # ==================================================
    # UPDATE STATE
    # ==================================================

        # ==================================================
    # UPDATE NLP STATE
    # ==================================================

    def update_nlp_state(
        self,
        nlp_state: CandidateNLPState
    ):
        """
        Replace the current NLP state with the structured
        information extracted from the latest candidate response.

        This method does not perform scoring or correctness
        evaluation.
        """

        if not isinstance(
            nlp_state,
            CandidateNLPState
        ):
            raise TypeError(
                "nlp_state must be a CandidateNLPState instance."
            )

        if not 0.0 <= nlp_state.confidence <= 1.0:
            raise ValueError(
                "NLP confidence must be between 0.0 and 1.0."
            )

        self.nlp_state = nlp_state
        
    def update(
        self,
        candidate_answer: str,
        scores: dict,
        primary_classification: Optional[str],
        secondary_classification: Optional[str],
        adaptive_classifications: list,
        primary_adaptive_gap: Optional[str],
        evidence: Optional[dict] = None,
        interviewer_question: Optional[str] = None
    ):
        """
        Update candidate state after a new response.

        The previous state is saved into history first.

        Only newly assessed scores replace previous scores.

        NOT_ASSESSED dimensions retain their previous scores.

        New evidence replaces previous evidence for the
        dimensions that were assessed.

        The interviewer question associated with the
        candidate response is stored.
        """

        # ==================================================
        # SAVE PREVIOUS STATE
        # ==================================================

        self.history.append(
            self.to_dict(
                include_history=False
            )
        )

        # ==================================================
        # MOVE TO NEXT TURN
        # ==================================================

        self.turn_number += 1

        # ==================================================
        # UPDATE CURRENT ANSWER
        # ==================================================

        self.current_answer = candidate_answer

        # ==================================================
        # UPDATE INTERVIEWER QUESTION
        # ==================================================

        if interviewer_question is not None:

            self.current_interviewer_question = (
                interviewer_question
            )

        # ==================================================
        # MERGE SCORES
        # ==================================================

        for dimension_name in self.scores:

            new_score = scores.get(
                dimension_name
            )

            # Only replace when the new response
            # actually assessed this dimension.

            if new_score is not None:

                self.scores[
                    dimension_name
                ] = new_score

        # ==================================================
        # MERGE EVIDENCE
        # ==================================================

        if evidence is not None:

            for dimension_name in self.evidence:

                new_evidence = evidence.get(
                    dimension_name
                )

                if (
                    new_evidence is not None
                    and str(new_evidence).strip()
                ):

                    self.evidence[
                        dimension_name
                    ] = new_evidence

        # ==================================================
        # UPDATE CLASSIFICATIONS
        # ==================================================

        self.primary_classification = (
            primary_classification
        )

        self.secondary_classification = (
            secondary_classification
        )

        self.adaptive_classifications = (
            adaptive_classifications
        )

        self.primary_adaptive_gap = (
            primary_adaptive_gap
        )

    # ==================================================
    # ADD INTERVIEWER QUESTION
    # ==================================================

    def set_interviewer_question(
        self,
        question: str
    ):
        """
        Store the latest interviewer question.

        This is useful when a question is generated after
        the candidate state has already been updated.
        """

        if not isinstance(
            question,
            str
        ):
            raise TypeError(
                "Interviewer question must be a string."
            )

        question = question.strip()

        if not question:
            raise ValueError(
                "Interviewer question cannot be empty."
            )

        self.current_interviewer_question = (
            question
        )

    # ==================================================
    # GET PREVIOUS QUESTIONS
    # ==================================================

    def get_previous_questions(self) -> list:
        """
        Return all interviewer questions stored in
        previous conversation turns.
        """

        questions = []

        # --------------------------------------------------
        # Questions from history
        # --------------------------------------------------

        for previous_turn in self.history:

            if not isinstance(
                previous_turn,
                dict
            ):
                continue

            question = previous_turn.get(
                "current_interviewer_question"
            )

            if (
                isinstance(question, str)
                and question.strip()
            ):
                questions.append(
                    question.strip()
                )

        # --------------------------------------------------
        # Include current question
        # --------------------------------------------------

        if (
            isinstance(
                self.current_interviewer_question,
                str
            )
            and self.current_interviewer_question.strip()
        ):
            questions.append(
                self.current_interviewer_question.strip()
            )

        return questions

    # ==================================================
    # SERIALIZATION
    # ==================================================

    def to_dict(
        self,
        include_history: bool = True
    ) -> dict:
        """
        Convert current state into a dictionary.
        """

        state = {
            "candidate_id": self.candidate_id,

            "question_id": self.question_id,

            "turn_number": self.turn_number,

            "current_answer": self.current_answer,

            "current_interviewer_question": (
                self.current_interviewer_question
            ),

            "nlp_state": self.nlp_state.to_dict(),
            
            "scores": self.scores.copy(),

            "primary_classification": (
                self.primary_classification
            ),

            "secondary_classification": (
                self.secondary_classification
            ),

            "adaptive_classifications": (
                self.adaptive_classifications.copy()
            ),

            "primary_adaptive_gap": (
                self.primary_adaptive_gap
            ),

            "evidence": self.evidence.copy()
        }

        if include_history:

            state["history"] = (
                self.history.copy()
            )

        return state