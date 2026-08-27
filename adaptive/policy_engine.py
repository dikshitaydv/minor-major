from adaptive.progress_tracker import ProgressTracker
from adaptive.config import (
    LOW_SCORE_THRESHOLD,
    FOLLOW_UP_THRESHOLD,
    MAX_DIMENSION_REVISITS,
    MORE_THAN_5_MINUTES,
    TWO_MINUTES,
    THIRTY_SECONDS,
)

from adaptive.gap_analyzer import analyze_gaps
from adaptive.repetition_guard import RepetitionGuard


class PolicyEngine:
    """
    Decides what the system should evaluate next.

    Uses:
    - gap analysis
    - progress tracking
    - repetition prevention
    - score thresholds
    - candidate level
    - remaining interview time
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
        candidate_level: str = "medium"
    ) -> dict:
        """
        Generate the next adaptive policy decision.
        """

        # Rule 1: Interview time is over.
        if time_remaining <= 0:
            return self._stop_decision(
                "Interview time has ended."
            )

        # Record scores for progress tracking.
        self.progress_tracker.record(scores)

        # Step 1: Analyze weaknesses.
        gap_analysis = analyze_gaps(scores)

        prioritized_gaps = gap_analysis["prioritized_gaps"]

        # Step 2: Remove dimensions targeted too many times.
        available_gaps = self.repetition_guard.filter_available(
            prioritized_gaps
        )

        # Step 3: Remove gaps that are now resolved.
        available_gaps = [
            dimension
            for dimension in available_gaps
            if not self._is_gap_resolved(dimension)
        ]

        # Rule 2: No unresolved gaps are available.
        if not available_gaps:
            return self._stop_decision(
                "No unresolved gaps are available for follow-up."
            )

        # Step 4: Choose the highest-priority available gap.
        target_dimension = available_gaps[0]

        # Get the score for the selected dimension.
        target_score = self._get_score(
            scores,
            target_dimension
        )

        # Step 5: Decide whether a follow-up is needed.
        if (
            target_score is not None
            and target_score >= FOLLOW_UP_THRESHOLD
        ):
            return self._stop_decision(
                "No significant weakness requires a follow-up."
            )

        # Step 6: Time-aware decision.
        time_policy = self._get_time_policy(
            time_remaining
        )

        if time_policy == "STOP":
            return self._stop_decision(
                "Not enough time to start a new topic."
            )

        # Step 7: Determine difficulty.
        difficulty = self._determine_difficulty(
            candidate_level,
            target_score
        )

        # Step 8: Determine goal.
        goal = self._determine_goal(
            target_dimension,
            target_score
        )

        # Record selected dimension for repetition prevention.
        self.repetition_guard.record_dimension(
            target_dimension
        )

        return {
            "action": "ASK_FOLLOW_UP",
            "target_dimension": target_dimension,
            "difficulty": difficulty,
            "goal": goal,
            "hint_level": 0,
            "do_not_reveal_solution": True,
            "time_policy": time_policy,
            "reason": (
                f"{target_dimension} is the highest-priority "
                f"unresolved gap."
            )
        }

    def _is_gap_resolved(
        self,
        dimension: str
    ) -> bool:
        """
        Check whether the latest score for a dimension
        is high enough that it no longer needs follow-up.
        """

        latest_scores = self.progress_tracker.latest_scores()

        if latest_scores is None:
            return False

        latest_score = self._get_score(
            latest_scores,
            dimension
        )

        if latest_score is None:
            return False

        return latest_score >= FOLLOW_UP_THRESHOLD

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
        Determine the adaptive strategy based on time remaining.
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