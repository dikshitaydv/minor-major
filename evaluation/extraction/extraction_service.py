from evaluation.preprocessing.cleaner import normalize_answer
from evaluation.extraction.concepts import extract_concepts
from evaluation.extraction.reasoning import extract_reasoning
from evaluation.extraction.complexity import extract_complexity
from evaluation.extraction.edge_cases import extract_edge_cases


def extract_candidate_features(answer: str) -> dict:
    """
    Run the complete candidate-answer extraction pipeline.

    Returns the normalized answer, detected concepts,
    structured algorithm/data-structure information,
    reasoning statements, explicit complexity claims,
    and explicitly mentioned edge cases.
    """

    cleaned = normalize_answer(answer)

    normalized_answer = cleaned["normalized_answer"]

    concepts = extract_concepts(normalized_answer)
    reasoning = extract_reasoning(normalized_answer)
    complexity = extract_complexity(normalized_answer)
    edge_cases = extract_edge_cases(normalized_answer)

    return {
        "original_answer": cleaned["original_answer"],
        "normalized_answer": normalized_answer,

        # Existing field — keep this because your old tests use it.
        "concepts_detected": concepts["concepts_detected"],

        # New Phase 2 NLP fields.
        "approach": concepts["approach"],
        "algorithms": concepts["algorithms"],
        "concepts": concepts["concepts"],
        "data_structures": concepts["data_structures"],

        # Existing reasoning information.
        "reasoning": reasoning["reasoning"],

        # Existing complexity information.
        "complexity_claim": complexity["complexity_claim"],

        # New Phase 2 edge-case information.
        "edge_cases": edge_cases["edge_cases"]
    }