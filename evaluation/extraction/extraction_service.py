from evaluation.preprocessing.cleaner import normalize_answer
from evaluation.extraction.concepts import extract_concepts
from evaluation.extraction.reasoning import extract_reasoning
from evaluation.extraction.complexity import extract_complexity


def extract_candidate_features(answer: str) -> dict:
    """
    Run the complete candidate-answer extraction pipeline.

    Returns the normalized answer, detected concepts,
    reasoning statements, and explicit complexity claims.
    """

    cleaned = normalize_answer(answer)

    normalized_answer = cleaned["normalized_answer"]

    concepts = extract_concepts(normalized_answer)
    reasoning = extract_reasoning(normalized_answer)
    complexity = extract_complexity(normalized_answer)

    return {
        "original_answer": cleaned["original_answer"],
        "normalized_answer": normalized_answer,
        "concepts_detected": concepts["concepts_detected"],
        "reasoning": reasoning["reasoning"],
        "complexity_claim": complexity["complexity_claim"]
    }