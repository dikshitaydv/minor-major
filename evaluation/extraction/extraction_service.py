from evaluation.preprocessing.cleaner import normalize_answer
from evaluation.extraction.concepts import extract_concepts
from evaluation.extraction.reasoning import extract_reasoning
from evaluation.extraction.complexity import extract_complexity
from evaluation.extraction.edge_cases import extract_edge_cases


def _extract_assumptions(answer: str) -> list[str]:
    """
    Extract assumptions explicitly stated by the candidate.

    This deliberately does not infer assumptions.
    """

    if not answer:
        return []

    assumptions = []

    sentences = [
        sentence.strip()
        for sentence in answer.replace("!", ".").replace("?", ".").split(".")
        if sentence.strip()
    ]

    assumption_markers = [
        "i assume",
        "we assume",
        "assuming",
        "given that",
        "provided that",
        "we can assume",
        "the problem guarantees",
        "the input guarantees"
    ]

    for sentence in sentences:
        sentence_lower = sentence.lower()

        if any(
            marker in sentence_lower
            for marker in assumption_markers
        ):
            assumptions.append(sentence)

    return assumptions


def _extract_optimization(answer: str):
    """
    Detect whether optimization was explicitly discussed.

    Returns:
        True  -> optimization/improvement discussed
        False -> candidate explicitly says no optimization is needed
        None  -> optimization not discussed
    """

    if not answer:
        return None

    text = answer.lower()

    optimization_markers = [
        "optimize",
        "optimized",
        "optimization",
        "improve",
        "improvement",
        "more efficient",
        "more efficient approach",
        "reduce time",
        "reduce space",
        "better approach",
        "faster approach",
        "efficient approach"
    ]

    no_optimization_markers = [
        "no optimization needed",
        "no further optimization",
        "cannot be optimized",
        "already optimal",
        "this is optimal"
    ]

    if any(
        marker in text
        for marker in no_optimization_markers
    ):
        return False

    if any(
        marker in text
        for marker in optimization_markers
    ):
        return True

    return None


def _build_reasoning_summary(reasoning: list[str]):
    """
    Convert extracted reasoning statements into the
    contract's reasoning_summary field.
    """

    if not reasoning:
        return None

    return " ".join(reasoning)


def _calculate_nlp_confidence(
    concepts: dict,
    reasoning: dict,
    complexity: dict,
    edge_cases: dict,
    assumptions: list[str],
    optimization
) -> float:
    """
    Estimate confidence in the NLP extraction itself.

    This is NOT a candidate performance score.

    The score reflects how much explicit, extractable
    information was found in the response.
    """

    signals = 0
    total_signals = 6

    if concepts.get("approach"):
        signals += 1

    if concepts.get("algorithms"):
        signals += 1

    if concepts.get("concepts"):
        signals += 1

    if reasoning.get("reasoning"):
        signals += 1

    complexity_claim = complexity.get(
        "complexity_claim",
        {}
    )

    if (
        complexity_claim.get("time") is not None
        or complexity_claim.get("space") is not None
    ):
        signals += 1

    if (
        edge_cases.get("edge_cases")
        or assumptions
        or optimization is not None
    ):
        signals += 1

    return round(
        signals / total_signals,
        2
    )


def extract_candidate_features(answer: str) -> dict:
    """
    Run the complete candidate-answer extraction pipeline.

    Produces the Janvi NLP candidate-state contract while
    retaining legacy fields for backward compatibility.
    """

    cleaned = normalize_answer(answer)

    normalized_answer = cleaned["normalized_answer"]

    concepts = extract_concepts(
        normalized_answer
    )

    reasoning = extract_reasoning(
        normalized_answer
    )

    complexity = extract_complexity(
        normalized_answer
    )

    edge_cases = extract_edge_cases(
        normalized_answer
    )

    assumptions = _extract_assumptions(
        normalized_answer
    )

    optimization = _extract_optimization(
        normalized_answer
    )

    reasoning_summary = _build_reasoning_summary(
        reasoning["reasoning"]
    )

    complexity_claim = complexity[
        "complexity_claim"
    ]

    nlp_extraction_confidence = _calculate_nlp_confidence(
        concepts=concepts,
        reasoning=reasoning,
        complexity=complexity,
        edge_cases=edge_cases,
        assumptions=assumptions,
        optimization=optimization
    )

    return {
        # --------------------------------------------------
        # Existing fields
        # --------------------------------------------------

        "original_answer": cleaned[
            "original_answer"
        ],

        "normalized_answer": normalized_answer,

        "concepts_detected": concepts[
            "concepts_detected"
        ],

        "reasoning": reasoning[
            "reasoning"
        ],

        "complexity_claim": complexity_claim,

        # --------------------------------------------------
        # Janvi Candidate State Contract
        # --------------------------------------------------

        "approach": concepts.get(
            "approach"
        ) or None,

        "algorithms": concepts[
            "algorithms"
        ],

        "concepts": concepts[
            "concepts"
        ],

        "data_structures": concepts[
            "data_structures"
        ],

        "time_complexity": complexity_claim.get(
            "time"
        ),

        "space_complexity": complexity_claim.get(
            "space"
        ),

        "edge_cases": edge_cases[
            "edge_cases"
        ],

        "reasoning_summary": reasoning_summary,

        "assumptions": assumptions,

        "optimization": optimization,

        "nlp_extraction_confidence": nlp_extraction_confidence
    }