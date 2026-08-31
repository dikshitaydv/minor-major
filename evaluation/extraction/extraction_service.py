from evaluation.preprocessing.cleaner import normalize_answer
from evaluation.extraction.llm_extractor import extract_with_llm


def _empty_feature_state(
    original_answer: str,
    normalized_answer: str
) -> dict:
    """
    Return the canonical candidate NLP state.
    """

    return {
        "original_answer": original_answer,
        "normalized_answer": normalized_answer,

        "approach": None,
        "algorithms": [],
        "concepts": [],
        "operations": [],
        "data_structures": [],

        "time_complexity": None,
        "space_complexity": None,

        "reasoning": None,

        "edge_cases": [],
        "assumptions": [],

        "optimization": None,

        "extraction_source": "empty"
    }


def extract_candidate_features(
    answer: str,
    problem: dict | None = None
) -> dict:
    """
    Extract the candidate's semantic NLP state.

    Pipeline:

        Candidate answer
              ↓
        Mechanical normalization
              ↓
        LLM semantic extraction
              ↓
        Canonical NLP state

    This layer performs no semantic interpretation.

    It does not:
        - use keyword dictionaries
        - use regex semantic extraction
        - infer algorithms
        - infer data structures
        - infer complexity
        - infer edge cases
        - infer assumptions
        - infer reasoning
        - evaluate correctness
    """

    # --------------------------------------------------------
    # Input validation
    # --------------------------------------------------------

    if answer is None:
        answer = ""

    if not isinstance(
        answer,
        str
    ):

        raise TypeError(
            "Candidate answer must be a string."
        )

    # --------------------------------------------------------
    # Mechanical normalization
    # --------------------------------------------------------

    cleaned = normalize_answer(
        answer
    )

    original_answer = cleaned.get(
        "original_answer",
        ""
    )

    normalized_answer = cleaned.get(
        "normalized_answer",
        ""
    )

    # --------------------------------------------------------
    # Empty answer
    # --------------------------------------------------------

    if not normalized_answer:

        return _empty_feature_state(
            original_answer,
            normalized_answer
        )

    # --------------------------------------------------------
    # Semantic extraction
    # --------------------------------------------------------

    semantic = extract_with_llm(
        normalized_answer,
        problem=problem
    )

    if not isinstance(
        semantic,
        dict
    ):

        raise RuntimeError(
            "LLM extractor must return a dictionary."
        )

    # --------------------------------------------------------
    # Canonical feature state
    #
    # No aliases.
    # No duplicated fields.
    # No semantic transformation.
    # --------------------------------------------------------

    return {
        "original_answer": original_answer,

        "normalized_answer": normalized_answer,

        "approach": semantic.get(
            "approach"
        ),

        "algorithms": semantic.get(
            "algorithms",
            []
        ),

        "concepts": semantic.get(
            "concepts",
            []
        ),

        "operations": semantic.get(
            "operations",
            []
        ),

        "data_structures": semantic.get(
            "data_structures",
            []
        ),

        "time_complexity": semantic.get(
            "time_complexity"
        ),

        "space_complexity": semantic.get(
            "space_complexity"
        ),

        "reasoning": semantic.get(
            "reasoning"
        ),

        "edge_cases": semantic.get(
            "edge_cases",
            []
        ),

        "assumptions": semantic.get(
            "assumptions",
            []
        ),

        "optimization": semantic.get(
            "optimization"
        ),

        "extraction_source": "llm"
    }