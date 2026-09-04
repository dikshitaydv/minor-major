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
    Decides what the adaptive interviewer should do next.

    Dimension scores are weighted contributions out of 100.

    Therefore the policy normalizes each dimension score against
    its maximum possible weighted contribution before applying
    generic thresholds.

    Example:

        algorithm_correctness weight = 25

        score = 10

        normalized score =
            10 / 25 * 100
            = 40%

    This keeps adaptive thresholds independent of the dimension's
    individual weight.
    """

    DIMENSION_WEIGHTS = {
        "algorithm_correctness": 25,
        "logical_reasoning": 20,
        "concept_coverage": 15,
        "completeness": 10,
        "data_structure": 10,
        "complexity": 10,
        "edge_cases": 10,
    }

    def __init__(self):
        self.repetition_guard = RepetitionGuard(
            max_revisits=MAX_DIMENSION_REVISITS
        )

        self.progress_tracker = ProgressTracker()

    # ==========================================================
    # MAIN DECISION
    # ==========================================================

    def decide(
        self,
        scores: dict,
        time_remaining: int,
        candidate_level: str = "medium"
    ) -> dict:

        if time_remaining <= 0:
            return self._stop_decision(
                "Interview time has ended."
            )

        self.progress_tracker.record(scores)

        gap_analysis = analyze_gaps(scores)

        prioritized_gaps = (
            gap_analysis.get(
                "prioritized_gaps",
                []
            )
            or []
        )

        available_gaps = (
            self.repetition_guard.filter_available(
                prioritized_gaps
            )
        )

        available_gaps = [
            dimension
            for dimension in available_gaps
            if not self._is_gap_resolved(dimension)
        ]

        # ------------------------------------------------------
        # If there are no detected gaps, do not automatically
        # terminate because the interviewer may still need to
        # probe unassessed dimensions.
        # ------------------------------------------------------

        if not available_gaps:
            return self._stop_decision(
                "No assessed weakness requires a targeted follow-up."
            )

        target_dimension = available_gaps[0]

        target_score = self._get_score(
            scores,
            target_dimension
        )

        normalized_score = self._normalize_score(
            target_dimension,
            target_score
        )

        # ------------------------------------------------------
        # IMPORTANT:
        #
        # FOLLOW_UP_THRESHOLD is interpreted on a 0-100
        # normalized scale.
        # ------------------------------------------------------

        if (
            normalized_score is not None
            and normalized_score >= FOLLOW_UP_THRESHOLD
        ):
            return self._stop_decision(
                "Selected gap is no longer below the follow-up threshold."
            )

        time_policy = self._get_time_policy(
            time_remaining
        )

        if time_policy == "STOP":
            return self._stop_decision(
                "Not enough time to start a new topic."
            )

        difficulty = self._determine_difficulty(
            candidate_level,
            normalized_score
        )

        goal = self._determine_goal(
            target_dimension,
            normalized_score
        )

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

    # ==========================================================
    # SCORE HELPERS
    # ==========================================================

    def _get_score(
        self,
        scores: dict,
        dimension: str
    ) -> float | None:

        if dimension == "data_structure":
            dimension = "data_structure"

        value = scores.get(
            dimension
        )

        # ------------------------------------------------------
        # Scores normally arrive as:
        #
        # {
        #     "score": 10,
        #     "assessment_status": "ASSESSED"
        # }
        #
        # Be tolerant of a plain numeric score as well.
        # ------------------------------------------------------

        if isinstance(value, dict):

            value = value.get(
                "score"
            )

        if value is None:
            return None

        try:
            return float(value)

        except (
            TypeError,
            ValueError
        ):
            return None

    def _normalize_score(
        self,
        dimension: str,
        score: float | None
    ) -> float | None:

        if score is None:
            return None

        weight = self.DIMENSION_WEIGHTS.get(
            dimension
        )

        if weight is None or weight <= 0:
            return None

        normalized = (
            score / weight
        ) * 100

        return max(
            0.0,
            min(
                100.0,
                normalized
            )
        )

    # ==========================================================
    # GAP RESOLUTION
    # ==========================================================

    def _is_gap_resolved(
        self,
        dimension: str
    ) -> bool:

        latest_scores = (
            self.progress_tracker.latest_scores()
        )

        if latest_scores is None:
            return False

        latest_score = self._get_score(
            latest_scores,
            dimension
        )

        normalized_score = self._normalize_score(
            dimension,
            latest_score
        )

        if normalized_score is None:
            return False

        return (
            normalized_score
            >= FOLLOW_UP_THRESHOLD
        )

    # ==========================================================
    # TIME POLICY
    # ==========================================================

    def _get_time_policy(
        self,
        time_remaining: int
    ) -> str:

        if time_remaining <= 0:
            return "STOP"

        if time_remaining < THIRTY_SECONDS:
            return "STOP"

        if time_remaining < TWO_MINUTES:
            return "FOCUS_PRIMARY_GAP"

        if time_remaining <= MORE_THAN_5_MINUTES:
            return "TARGETED_FOLLOW_UP"

        return "EXPLORE_MULTIPLE_GAPS"

    # ==========================================================
    # DIFFICULTY
    # ==========================================================

    def _determine_difficulty(
        self,
        candidate_level: str,
        normalized_score: float | None
    ) -> str:

        if candidate_level == "beginner":
            return "easy"

        if candidate_level == "advanced":
            return "hard"

        if (
            normalized_score is not None
            and normalized_score < LOW_SCORE_THRESHOLD
        ):
            return "easy"

        return "medium"

    # ==========================================================
    # GOAL
    # ==========================================================

    def _determine_goal(
        self,
        dimension: str,
        normalized_score: float | None
    ) -> str:

        if (
            normalized_score is not None
            and normalized_score < LOW_SCORE_THRESHOLD
        ):
            return f"clarify_{dimension}"

        return f"probe_{dimension}"

    # ==========================================================
    # STOP
    # ==========================================================

    def _stop_decision(
        self,
        reason: str
    ) -> dict:

        return {
            "action": "STOP",
            "target_dimension": None,
            "difficulty": None,
            "goal": None,
            "hint_level": 0,
            "do_not_reveal_solution": True,
            "reason": reason
        }