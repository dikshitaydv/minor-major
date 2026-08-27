import re


EDGE_CASE_PATTERNS = {
    "empty_input": [
        "empty input",
        "input is empty",
        "empty array",
        "array is empty",
        "empty list",
        "list is empty",
        "empty string",
        "string is empty",
        "no elements",
        "zero elements"
    ],

    "single_element": [
        "single element",
        "one element",
        "only element",
        "one item"
    ],

    "duplicate_values": [
        "duplicate",
        "duplicates",
        "repeated values",
        "repeated elements"
    ],

    "negative_values": [
        "negative values",
        "negative numbers",
        "negative number",
        "less than zero"
    ],

    "max_min_values": [
        "maximum value",
        "minimum value",
        "max value",
        "min value",
        "largest value",
        "smallest value"
    ],

    "no_solution": [
        "no solution",
        "no valid solution",
        "no answer",
        "no valid pair",
        "not found",
        "cannot be found",
        "return -1",
        "return null",
        "return none",
        "return an empty result"
    ],

    "invalid_input": [
        "invalid input",
        "invalid value",
        "invalid values",
        "invalid data",
        "malformed input"
    ]
}


def extract_edge_cases(answer: str) -> dict:
    """
    Detect edge cases explicitly mentioned by the candidate.

    The extractor only records edge cases that are actually
    mentioned in the candidate's response. It does not infer
    missing edge cases.
    """

    if not answer:
        return {
            "edge_cases": []
        }

    text = answer.lower()

    edge_cases = []

    for edge_case, keywords in EDGE_CASE_PATTERNS.items():

        for keyword in keywords:

            pattern = (
                r"(?<!\w)"
                + re.escape(keyword)
                + r"(?!\w)"
            )

            if re.search(pattern, text):
                edge_cases.append(edge_case)
                break

    return {
        "edge_cases": edge_cases
    }