from evaluation.preprocessing.cleaner import normalize_answer
from evaluation.extraction.llm_extractor import extract_with_llm


# ============================================================
# EMPTY FEATURE STATE
# ============================================================

def _empty_feature_state(
    original_answer,
    normalized_answer,
):
    """
    Return the canonical empty extraction state.

    This function does not perform semantic inference.
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

        "reasoning_summary": None,

        "edge_cases": [],
        "assumptions": [],
        "optimization": None,

        "extraction_source": "empty",
    }


# ============================================================
# PUBLIC API
# ============================================================

def extract_candidate_features(
    answer,
    problem=None,
):
    """
    Extract candidate NLP features.

    Pipeline:

        raw answer
            ↓
        normalization
            ↓
        LLM semantic extraction
            ↓
        canonical feature dictionary

    Semantic interpretation is performed by the LLM.
    This service only coordinates the pipeline and maps
    the result into the canonical extraction contract.
    """

    if not isinstance(answer, str):
        raise TypeError(
            "Candidate answer must be a string."
        )

    # --------------------------------------------------------
    # Normalize candidate answer
    # --------------------------------------------------------

    cleaned = normalize_answer(answer)

    if not isinstance(cleaned, dict):
        raise RuntimeError(
            "Answer normalization must return a dictionary."
        )

    original_answer = cleaned.get(
        "original_answer",
        "",
    )

    normalized_answer = cleaned.get(
        "normalized_answer",
        "",
    )

    # --------------------------------------------------------
    # Empty answer after normalization
    # --------------------------------------------------------

    if not normalized_answer:
        return _empty_feature_state(
            original_answer=original_answer,
            normalized_answer=normalized_answer,
        )

    # --------------------------------------------------------
    # Semantic extraction
    # --------------------------------------------------------

    semantic = extract_with_llm(
        normalized_answer,
        problem=problem,
    )

    if not isinstance(semantic, dict):
        raise RuntimeError(
            "LLM semantic extraction must return a dictionary."
        )

    # --------------------------------------------------------
    # Canonical extraction contract
    # --------------------------------------------------------

    return {
        "original_answer": original_answer,
        "normalized_answer": normalized_answer,

        "approach": semantic.get(
            "approach"
        ),

        "algorithms": semantic.get(
            "algorithms",
            [],
        ),

        "concepts": semantic.get(
            "concepts",
            [],
        ),

        "operations": semantic.get(
            "operations",
            [],
        ),

        "data_structures": semantic.get(
            "data_structures",
            [],
        ),

        "time_complexity": semantic.get(
            "time_complexity"
        ),

        "space_complexity": semantic.get(
            "space_complexity"
        ),

        "reasoning_summary": semantic.get(
            "reasoning_summary"
        ),

        "edge_cases": semantic.get(
            "edge_cases",
            [],
        ),

        "assumptions": semantic.get(
            "assumptions",
            [],
        ),

        "optimization": semantic.get(
            "optimization"
        ),

        "extraction_source": "llm",
    }