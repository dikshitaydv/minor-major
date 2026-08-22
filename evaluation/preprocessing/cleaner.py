def normalize_answer(answer: str) -> dict:
    """
    Normalize a candidate's programming answer while preserving
    the original answer.
    """

    if answer is None:
        answer = ""

    # Preserve the exact original answer
    original_answer = answer

    # Normalize whitespace:
    # - removes leading/trailing whitespace
    # - converts multiple whitespace characters into a single space
    normalized_answer = " ".join(answer.split())

    return {
        "original_answer": original_answer,
        "normalized_answer": normalized_answer
    }