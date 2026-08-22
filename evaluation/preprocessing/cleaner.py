def normalize_answer(answer: str) -> dict:
    """
    Normalize a candidate's programming answer while preserving
    the original answer and meaningful reasoning.
    """

    if answer is None:
        answer = ""

    # Preserve the exact candidate submission.
    original_answer = answer

    # Normalize whitespace:
    # - removes leading/trailing whitespace
    # - converts spaces, tabs, and newlines into single spaces
    normalized_answer = " ".join(answer.split())

    return {
        "original_answer": original_answer,
        "normalized_answer": normalized_answer
    }