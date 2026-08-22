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
]


def extract_reasoning(answer: str) -> dict:
    """
    Extract reasoning-related statements from a candidate answer.

    This initial version identifies sentences containing
    common reasoning or algorithm-action indicators.
    """

    if not answer:
        return {
            "reasoning": []
        }

    sentences = [
        sentence.strip()
        for sentence in answer.replace("\n", ".").split(".")
        if sentence.strip()
    ]

    reasoning = []

    for sentence in sentences:
        sentence_lower = sentence.lower()

        if any(pattern in sentence_lower for pattern in REASONING_PATTERNS):
            reasoning.append(sentence)

    return {
        "reasoning": reasoning
    }