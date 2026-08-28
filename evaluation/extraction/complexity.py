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

        # Look for time complexity in either form:
    #
    #   O(n) time
    #   time complexity: O(n)
    #   time is O(n)
    #   time = O(n)

    time_match = re.search(
        r"(?:"
        r"o\s*\([^)]*\)\s*time"
        r"|"
        r"time\s*(?:complexity)?\s*(?:is|=|:|-)?\s*"
        r"o\s*\([^)]*\)"
        r")",
        text
    )

    if time_match:
        complexity_match = re.search(
            r"o\s*\([^)]*\)",
            time_match.group(0)
        )

        if complexity_match:
            time_complexity = (
                complexity_match.group(0)
                .replace(" ", "")
            )
            
            time_complexity = (
                "O" + time_complexity[1:]
            )

    # Look for space complexity in either form:
    #
    #   O(n) space
    #   space complexity: O(n)
    #   space is O(n)
    #   space = O(n)

    space_match = re.search(
        r"(?:"
        r"o\s*\([^)]*\)\s*space"
        r"|"
        r"space\s*(?:complexity)?\s*(?:is|=|:|-)?\s*"
        r"o\s*\([^)]*\)"
        r")",
        text
    )

    if space_match:
        complexity_match = re.search(
            r"o\s*\([^)]*\)",
            space_match.group(0)
        )

        if complexity_match:
            space_complexity = (
                complexity_match.group(0)
                .replace(" ", "")
            )
            
            space_complexity = (
                "O" + space_complexity[1:]
            )

    return {
        "complexity_claim": {
            "time": time_complexity,
            "space": space_complexity
        }
    }