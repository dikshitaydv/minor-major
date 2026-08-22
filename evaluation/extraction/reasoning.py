import re


REASONING_PATTERNS = [
    "because",
    "therefore",
    "so that",
    "first",
    "then",
    "next",
    "finally",
    "if",
    "otherwise",
    "store",
    "check",
    "compare",
    "return",
    "iterate",
    "loop",
    "use",
    "gives",
    "allows",
    "allowing",
    "determines",
    "requires",
]


def extract_reasoning(answer: str) -> dict:
    """
    Extract reasoning-related statements from a candidate answer.

    The extractor identifies sentences containing common
    reasoning or algorithm-action indicators while preserving
    meaningful explanatory statements.
    """

    if not answer:
        return {
            "reasoning": []
        }

    # Split on sentence-ending punctuation while preserving
    # meaningful content.
    sentences = [
        sentence.strip()
        for sentence in re.split(r"[.!?]+", answer)
        if sentence.strip()
    ]

    reasoning = []

    for sentence in sentences:
        sentence_lower = sentence.lower()

        for pattern in REASONING_PATTERNS:
            # Match complete words/phrases rather than substrings.
            pattern_regex = r"(?<!\w)" + re.escape(pattern) + r"(?!\w)"

            if re.search(pattern_regex, sentence_lower):
                reasoning.append(sentence)
                break

    return {
        "reasoning": reasoning
    }