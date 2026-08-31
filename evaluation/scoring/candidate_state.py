from dataclasses import dataclass, field, asdict
from typing import Any, Optional


# ============================================================
# HELPERS
# ============================================================

def _merge_unique(
    existing: list,
    incoming: list
) -> list:
    """
    Merge two lists while preserving order and removing
    duplicates.
    """

    result = list(
        existing or []
    )

    for value in incoming or []:

        if value is None:
            continue

        if value not in result:

            result.append(
                value
            )

    return result


# ============================================================
# CANDIDATE NLP STATE
# ============================================================

@dataclass
class CandidateNLPState:
    """
    Accumulated semantic state extracted from candidate answers.

    IMPORTANT:

    This class contains no NLP logic, regexes, or keyword rules.
    It only stores and merges results produced by the LLM extractor.
    """

    approach: Optional[str] = None

    algorithms: list[str] = field(
        default_factory=list
    )

    concepts: list[str] = field(
        default_factory=list
    )

    data_structures: list[str] = field(
        default_factory=list
    )

    time_complexity: Optional[str] = None

    space_complexity: Optional[str] = None

    edge_cases: list[str] = field(
        default_factory=list
    )

    reasoning_summary: Optional[str] = None

    assumptions: list[str] = field(
        default_factory=list
    )

    # None means optimization was not discussed.
    # True means optimization was explicitly discussed/proposed.
    # False means optimization was explicitly discussed and
    # the candidate said no further optimization is needed.
    optimization: Optional[bool] = None

    # ========================================================
    # SERIALIZATION
    # ========================================================

    def to_dict(self) -> dict:
        """
        Convert NLP state to a serializable dictionary.
        """

        return asdict(self)

    @classmethod
    def from_dict(
        cls,
        data: Optional[dict]
    ) -> "CandidateNLPState":
        """
        Reconstruct NLP state from persisted data.

        Older saved files may contain fields that no longer exist.
        Unknown or deprecated fields are ignored.
        """

        if not isinstance(data, dict):
            return cls()

        return cls(
            approach=data.get(
                "approach"
            ),

            algorithms=list(
                data.get("algorithms") or []
            ),

            concepts=list(
                data.get("concepts") or []
            ),

            data_structures=list(
                data.get("data_structures") or []
            ),

            time_complexity=data.get(
                "time_complexity"
            ),

            space_complexity=data.get(
                "space_complexity"
            ),

            edge_cases=list(
                data.get("edge_cases") or []
            ),

            reasoning_summary=data.get(
                "reasoning_summary"
            ),

            assumptions=list(
                data.get("assumptions") or []
            ),

            optimization=data.get(
                "optimization"
            ),
        )

    # ========================================================
    # MERGE
    # ========================================================

    def merge(
        self,
        new_state: "CandidateNLPState"
    ) -> None:
        """
        Merge a new turn into the accumulated state.

        Missing information from a later turn NEVER erases
        information already established in an earlier turn.
        """

        if new_state is None:
            return

        if not isinstance(
            new_state,
            CandidateNLPState
        ):
            raise TypeError(
                "new_state must be a CandidateNLPState."
            )

        # ====================================================
        # APPROACH
        # ====================================================

        if new_state.approach:

            if not self.approach:

                self.approach = (
                    new_state.approach
                )

            elif self.approach != new_state.approach:

                # Preserve the original primary approach.
                #
                # The extractor decides semantic meaning.
                # State merging must not invent or replace
                # an approach.

                pass

        # ====================================================
        # ALGORITHMS
        # ====================================================

        self.algorithms = _merge_unique(
            self.algorithms,
            new_state.algorithms
        )

        # ====================================================
        # CONCEPTS
        # ====================================================

        self.concepts = _merge_unique(
            self.concepts,
            new_state.concepts
        )

        # ====================================================
        # DATA STRUCTURES
        # ====================================================

        self.data_structures = _merge_unique(
            self.data_structures,
            new_state.data_structures
        )

        # ====================================================
        # COMPLEXITY
        # ====================================================

        # None means the candidate did not provide this
        # information in the current turn.
        #
        # Therefore a later missing value must not erase
        # an earlier explicitly stated value.

        if new_state.time_complexity is not None:

            self.time_complexity = (
                new_state.time_complexity
            )

        if new_state.space_complexity is not None:

            self.space_complexity = (
                new_state.space_complexity
            )

        # ====================================================
        # EDGE CASES
        # ====================================================

        self.edge_cases = _merge_unique(
            self.edge_cases,
            new_state.edge_cases
        )

        # ====================================================
        # ASSUMPTIONS
        # ====================================================

        self.assumptions = _merge_unique(
            self.assumptions,
            new_state.assumptions
        )

        # ====================================================
        # REASONING
        # ====================================================

        if new_state.reasoning_summary:

            if self.reasoning_summary:

                if (
                    new_state.reasoning_summary
                    != self.reasoning_summary
                ):

                    self.reasoning_summary = (
                        self.reasoning_summary.rstrip()
                        + " "
                        + new_state.reasoning_summary.strip()
                    )

            else:

                self.reasoning_summary = (
                    new_state.reasoning_summary
                )

        # ====================================================
        # OPTIMIZATION
        # ====================================================

        # None means:
        # "optimization was not discussed."
        #
        # Therefore None from a later turn must NOT erase
        # an earlier explicit optimization discussion.

        if new_state.optimization is not None:

            self.optimization = (
                new_state.optimization
            )


# ============================================================
# CANDIDATE EVALUATION STATE
# ============================================================

@dataclass
class CandidateEvaluationState:
    """
    Complete state for one candidate/question interview.

    NLP state is accumulated across turns and persisted so later
    evaluation stages/processes can load the same state.
    """

    candidate_id: str

    question_id: str

    candidate_answer: Optional[str] = None

    nlp_state: CandidateNLPState = field(
        default_factory=CandidateNLPState
    )

    scores: dict[str, Optional[float]] = field(
        default_factory=dict
    )

    primary_classification: Optional[str] = None

    secondary_classification: Optional[str] = None

    adaptive_classifications: list[Any] = field(
        default_factory=list
    )

    primary_adaptive_gap: Optional[str] = None

    evidence: dict[str, Optional[str]] = field(
        default_factory=dict
    )

    history: list[dict[str, Any]] = field(
        default_factory=list
    )

    current_interviewer_question: Optional[str] = None

    should_continue: bool = False

    # ========================================================
    # TURN NUMBER
    # ========================================================

    @property
    def turn_number(self) -> int:
        """
        Return the current interview turn number.

        The interview starts at turn 1.

        After an answer has been processed and stored in history,
        the next turn number is returned.

        Therefore:

            history = []       -> turn_number = 1
            history = [turn1]  -> turn_number = 2
            history = [turn1,
                       turn2]   -> turn_number = 3

        This is a derived value and is intentionally not stored
        separately in persistence.
        """

        return len(
            self.history
        ) + 1

    # ========================================================
    # NLP STATE
    # ========================================================

    def update_nlp_state(
        self,
        new_state: CandidateNLPState
    ) -> None:
        """
        Accumulate one LLM extraction result into the
        candidate's persistent NLP state.
        """

        if not isinstance(
            new_state,
            CandidateNLPState
        ):
            raise TypeError(
                "new_state must be a CandidateNLPState."
            )

        self.nlp_state.merge(
            new_state
        )

    # ========================================================
    # EVALUATION UPDATE
    # ========================================================

    def update(
        self,
        candidate_answer: Optional[str] = None,
        scores: Optional[dict] = None,
        primary_classification: Optional[str] = None,
        secondary_classification: Optional[str] = None,
        adaptive_classifications: Optional[list] = None,
        primary_adaptive_gap: Optional[str] = None,
        evidence: Optional[dict] = None,
    ) -> None:
        """
        Update the non-NLP evaluation portion of state and append
        a turn snapshot to history.
        """

        if candidate_answer is not None:

            self.candidate_answer = (
                candidate_answer
            )

        if scores is not None:

            self.scores = dict(
                scores
            )

        if primary_classification is not None:

            self.primary_classification = (
                primary_classification
            )

        if secondary_classification is not None:

            self.secondary_classification = (
                secondary_classification
            )

        if adaptive_classifications is not None:

            self.adaptive_classifications = list(
                adaptive_classifications
            )

        self.primary_adaptive_gap = (
            primary_adaptive_gap
        )

        if evidence is not None:

            self.evidence = dict(
                evidence
            )

        # ====================================================
        # TURN SNAPSHOT
        # ====================================================

        self.history.append(
            {
                "candidate_answer": (
                    self.candidate_answer
                ),

                "scores": dict(
                    self.scores
                ),

                "primary_classification": (
                    self.primary_classification
                ),

                "secondary_classification": (
                    self.secondary_classification
                ),

                "adaptive_classifications": list(
                    self.adaptive_classifications
                ),

                "primary_adaptive_gap": (
                    self.primary_adaptive_gap
                ),

                "evidence": dict(
                    self.evidence
                ),

                # Persist the accumulated NLP state
                # with every turn.
                "nlp_state": (
                    self.nlp_state.to_dict()
                ),
            }
        )

    # ========================================================
    # INTERVIEWER QUESTION
    # ========================================================

    def set_interviewer_question(
        self,
        question: Optional[str]
    ) -> None:

        self.current_interviewer_question = (
            question
        )

    # ========================================================
    # SERIALIZATION
    # ========================================================

    def to_dict(self) -> dict:
        """
        Convert complete candidate state into a dictionary.
        """

        return asdict(
            self
        )

    @classmethod
    def from_dict(
        cls,
        data: dict
    ) -> "CandidateEvaluationState":
        """
        Reconstruct candidate state from persisted JSON.

        Unknown/old fields are ignored.
        """

        if not isinstance(
            data,
            dict
        ):
            raise TypeError(
                "Saved candidate state must be a dictionary."
            )

        state = cls(

            candidate_id=data[
                "candidate_id"
            ],

            question_id=data[
                "question_id"
            ],

            candidate_answer=data.get(
                "candidate_answer"
            ),

            nlp_state=CandidateNLPState.from_dict(
                data.get(
                    "nlp_state"
                )
            ),

            scores=dict(
                data.get("scores") or {}
            ),

            primary_classification=data.get(
                "primary_classification"
            ),

            secondary_classification=data.get(
                "secondary_classification"
            ),

            adaptive_classifications=list(
                data.get(
                    "adaptive_classifications"
                ) or []
            ),

            primary_adaptive_gap=data.get(
                "primary_adaptive_gap"
            ),

            evidence=dict(
                data.get("evidence") or {}
            ),

            history=list(
                data.get("history") or []
            ),

            current_interviewer_question=data.get(
                "current_interviewer_question"
            ),

            should_continue=bool(
                data.get(
                    "should_continue",
                    False
                )
            ),
        )

        return state