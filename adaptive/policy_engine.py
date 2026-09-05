from adaptive.progress_tracker import ProgressTracker
from adaptive.config import (
    LOW_SCORE_THRESHOLD,
    FOLLOW_UP_THRESHOLD,
    MAX_DIMENSION_REVISITS,
    MORE_THAN_5_MINUTES,
    TWO_MINUTES,
    THIRTY_SECONDS,
    REFERENCE_CONFIDENCE_THRESHOLD,
)

from adaptive.gap_analyzer import analyze_gaps
from adaptive.repetition_guard import RepetitionGuard


class PolicyEngine:
    """
    Decides what the system should do next.

    Uses:
    - gap analysis
    - progress tracking
    - repetition prevention
    - score thresholds
    - candidate level
    - remaining interview time

    Updated reference-progression inputs:
    - candidate state
    - current matched reference solution
    - reference match confidence
    - target/optimal reference solution
    - possible next reference solutions
    - missing concepts
    - hints already given
    - remaining turns
    """

    def __init__(self):
        self.repetition_guard = RepetitionGuard(
            max_revisits=MAX_DIMENSION_REVISITS
        )

        self.progress_tracker = ProgressTracker()

    def decide(
        self,
        scores: dict[str, float],
        time_remaining: int,
        candidate_level: str = "medium",
        candidate_state: str | None = None,
        current_reference_solution: str | None = None,
        reference_match_confidence: float | None = None,
        target_reference_solution: str | None = None,
        possible_next_reference_solutions: list[str] | None = None,
        missing_concepts: list[str] | None = None,
        hints_given: list[str] | None = None,
        turns_remaining: int | None = None
    ) -> dict:
        """
        Generate the next adaptive policy decision.

        The policy first checks stopping conditions.

        Then it determines whether the candidate's current
        approach can be confidently identified.

        If the current approach is valid but not yet optimal,
        the policy asks a discovery question targeting the
        next useful improvement.

        Otherwise, normal gap analysis is used to identify
        the weakest evaluation dimension.
        """

        # --------------------------------------------------
        # Rule 1: Interview time is over
        # --------------------------------------------------

        if time_remaining <= 0:
            return self._stop_decision(
                "Interview time has ended."
            )

        # --------------------------------------------------
        # Rule 2: No turns remaining
        # --------------------------------------------------

        if (
            turns_remaining is not None
            and turns_remaining <= 0
        ):
            return self._stop_decision(
                "No interview turns remain."
            )

        # --------------------------------------------------
        # Step 1: Record current scores for progress tracking
        # --------------------------------------------------

        self.progress_tracker.record(scores)

        # --------------------------------------------------
        # Step 2: Check whether the current approach has
        # been identified confidently.
        #
        # Low confidence means the system should not assume
        # what the candidate is trying to do.
        # --------------------------------------------------

        if (
            reference_match_confidence is not None
            and reference_match_confidence
            < REFERENCE_CONFIDENCE_THRESHOLD
        ):
            return {
                "action": "ASK_CLARIFICATION",
                "target_dimension": None,
                "difficulty": "easy",
                "goal": "clarify_current_approach",
                "hint_level": len(hints_given or []),
                "do_not_reveal_solution": True,
                "time_policy": self._get_time_policy(
                    time_remaining
                ),
                "reason": (
                    "The candidate's current approach could "
                    "not be identified with sufficient confidence."
                ),
                "candidate_state": candidate_state,
                "current_reference_solution":
                    current_reference_solution,
                "target_reference_solution":
                    target_reference_solution,
                "missing_concepts":
                    missing_concepts or []
            }

        # --------------------------------------------------
        # Step 3: Check whether the current reference
        # approach is valid but not yet optimal.
        #
        # If so, guide the candidate toward the next useful
        # improvement without directly revealing the answer.
        # --------------------------------------------------

        if (
            current_reference_solution is not None
            and target_reference_solution is not None
            and current_reference_solution
            != target_reference_solution
        ):

            next_reference = None

            if possible_next_reference_solutions:
                next_reference = (
                    possible_next_reference_solutions[0]
                )

            # If missing concepts are available, target the
            # first missing concept. Otherwise use concept
            # coverage as the general improvement dimension.

            target_dimension = (
                missing_concepts[0]
                if missing_concepts
                else "concept_coverage"
            )

            target_score = self._get_score(
                scores,
                target_dimension
            )

            difficulty = self._determine_difficulty(
                candidate_level,
                target_score
            )

            return {
                "action": "ASK_DISCOVERY",
                "target_dimension": target_dimension,
                "difficulty": difficulty,
                "goal": (
                    f"discover_{target_dimension}"
                ),
                "hint_level": len(hints_given or []),
                "do_not_reveal_solution": True,
                "time_policy": self._get_time_policy(
                    time_remaining
                ),
                "reason": (
                    "The candidate's current approach is valid "
                    "but has not yet reached the target approach."
                ),
                "candidate_state": candidate_state,
                "current_reference_solution":
                    current_reference_solution,
                "next_reference_solution":
                    next_reference,
                "target_reference_solution":
                    target_reference_solution,
                "missing_concepts":
                    missing_concepts or []
            }

        # --------------------------------------------------
        # Step 4: Normal gap analysis
        #
        # Used when:
        # - the current approach is already optimal, or
        # - reference-progression information is not supplied.
        # --------------------------------------------------

        gap_analysis = analyze_gaps(scores)

        prioritized_gaps = (
            gap_analysis["prioritized_gaps"]
        )

        # --------------------------------------------------
        # Step 5: Remove dimensions targeted too many times
        # --------------------------------------------------

        available_gaps = (
            self.repetition_guard.filter_available(
                prioritized_gaps
            )
        )

        # --------------------------------------------------
        # Step 6: Remove gaps that are now resolved
        # --------------------------------------------------

        available_gaps = [
            dimension
            for dimension in available_gaps
            if not self._is_gap_resolved(dimension)
        ]

        # --------------------------------------------------
        # Rule 3: No unresolved gaps available
        # --------------------------------------------------

        if not available_gaps:
            return self._stop_decision(
                "No unresolved gaps are available for follow-up."
            )

        # --------------------------------------------------
        # Step 7: Select highest-priority gap
        # --------------------------------------------------

        target_dimension = available_gaps[0]

        target_score = self._get_score(
            scores,
            target_dimension
        )

        # --------------------------------------------------
        # Step 8: Check whether a follow-up is required
        # --------------------------------------------------

        if (
            target_score is not None
            and target_score >= FOLLOW_UP_THRESHOLD
        ):
            return self._stop_decision(
                "No significant weakness requires a follow-up."
            )

        # --------------------------------------------------
        # Step 9: Time-aware decision
        # --------------------------------------------------

        time_policy = self._get_time_policy(
            time_remaining
        )

        if time_policy == "STOP":
            return self._stop_decision(
                "Not enough time to start a new topic."
            )

        # --------------------------------------------------
        # Step 10: Determine difficulty
        # --------------------------------------------------

        difficulty = self._determine_difficulty(
            candidate_level,
            target_score
        )

        # --------------------------------------------------
        # Step 11: Determine follow-up goal
        # --------------------------------------------------

        goal = self._determine_goal(
            target_dimension,
            target_score
        )

        # --------------------------------------------------
        # Step 12: Record selected dimension
        # --------------------------------------------------

        self.repetition_guard.record_dimension(
            target_dimension
        )

        return {
            "action": "ASK_FOLLOW_UP",
            "target_dimension": target_dimension,
            "difficulty": difficulty,
            "goal": goal,
            "hint_level": len(hints_given or []),
            "do_not_reveal_solution": True,
            "time_policy": time_policy,
            "reason": (
                f"{target_dimension} is the highest-priority "
                f"unresolved gap."
            ),
            "candidate_state": candidate_state,
            "current_reference_solution":
                current_reference_solution,
            "target_reference_solution":
                target_reference_solution,
            "missing_concepts":
                missing_concepts or []
        }

    def _is_gap_resolved(
        self,
        dimension: str
    ) -> bool:
        """
        Check whether the latest score for a dimension
        is high enough that it no longer needs follow-up.
        """

        latest_scores = (
            self.progress_tracker.latest_scores()
        )

        if latest_scores is None:
            return False

        latest_score = self._get_score(
            latest_scores,
            dimension
        )

        if latest_score is None:
            return False

        return (
            latest_score >= FOLLOW_UP_THRESHOLD
        )

    def _get_score(
        self,
        scores: dict[str, float],
        dimension: str
    ) -> float | None:
        """
        Get the score for a normalized dimension name.
        """

        if dimension == "data_structure":
            return scores.get(
                "data_structure_usage"
            )

        return scores.get(dimension)

    def _get_time_policy(
        self,
        time_remaining: int
    ) -> str:
        """
        Determine the adaptive strategy based on
        remaining interview time.
        """

        if time_remaining <= 0:
            return "STOP"

        if time_remaining < THIRTY_SECONDS:
            return "STOP"

        if time_remaining < TWO_MINUTES:
            return "FOCUS_PRIMARY_GAP"

        if time_remaining <= MORE_THAN_5_MINUTES:
            return "TARGETED_FOLLOW_UP"

        return "EXPLORE_MULTIPLE_GAPS"

    def _determine_difficulty(
        self,
        candidate_level: str,
        score: float | None
    ) -> str:
        """
        Choose follow-up difficulty.
        """

        if candidate_level == "beginner":
            return "easy"

        if candidate_level == "advanced":
            return "hard"

        if (
            score is not None
            and score < LOW_SCORE_THRESHOLD
        ):
            return "easy"

        return "medium"

    def _determine_goal(
        self,
        dimension: str,
        score: float | None
    ) -> str:
        """
        Determine what the follow-up should achieve.
        """

        if (
            score is not None
            and score < LOW_SCORE_THRESHOLD
        ):
            return f"clarify_{dimension}"

        return f"probe_{dimension}"

    def _stop_decision(
        self,
        reason: str
    ) -> dict:
        """
        Return a consistent stop decision.
        """

        return {
            "action": "STOP",
            "target_dimension": None,
            "difficulty": None,
            "goal": None,
            "hint_level": 0,
            "do_not_reveal_solution": True,
            "reason": reason
        }
