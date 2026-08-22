import re


def extract_complexity(answer: str) -> dict:
    """
    Extract explicit time and space complexity claims
    from a candidate answer.
    """

    if not answer:
        return {
            "complexity_claim": {
                "time": None,
                "space": None
            }
        }

    text = answer.lower()

    time_complexity = None
    space_complexity = None

    # Look for explicit time complexity statements
    time_match = re.search(
    r"time\s*(?:complexity)?\s*(?:is|=|:|-)?\s*(o\s*\([^)]*\))",
    text
    )

    if time_match:
        time_complexity = time_match.group(1).replace(" ", "")

    # Look for explicit space complexity statements
    space_match = re.search(
    r"space\s*(?:complexity)?\s*(?:is|=|:|-)?\s*(o\s*\([^)]*\))",
    text
    )

    if space_match:
        space_complexity = space_match.group(1).replace(" ", "")

    return {
        "complexity_claim": {
            "time": time_complexity,
            "space": space_complexity
        }
    }