import re


CONCEPT_KEYWORDS = {
    "hash map": [
        "hash map",
        "hashmap",
        "unordered_map",
        "dictionary",
        "dict"
    ],
    "two pointer": [
        "two pointer",
        "two pointers"
    ],
    "binary search": [
        "binary search"
    ],
    "dynamic programming": [
        "dynamic programming",
        "dp"
    ],
    "bfs": [
        "breadth first search",
        "bfs"
    ],
    "dfs": [
        "depth first search",
        "dfs"
    ],
    "stack": [
        "stack"
    ],
    "queue": [
        "queue"
    ],
    "sorting": [
        "sorting",
        "sort"
    ],
    "greedy": [
        "greedy"
    ],
    "single pass": [
        "single pass",
        "one pass"
    ]
}


def extract_concepts(answer: str) -> dict:
    """
    Detect programming concepts explicitly mentioned
    in a candidate answer.
    """

    if not answer:
        return {
            "concepts_detected": []
        }

    text = answer.lower()
    concepts = []

    for concept, keywords in CONCEPT_KEYWORDS.items():
        for keyword in keywords:
            pattern = r"(?<!\w)" + re.escape(keyword) + r"(?!\w)"

            if re.search(pattern, text):
                concepts.append(concept)
                break

    return {
        "concepts_detected": concepts
    }