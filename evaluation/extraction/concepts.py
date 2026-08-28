import re


CONCEPT_KEYWORDS = {
    "hash map": [
        "hash map",
        "hashmap",
        "unordered_map",
        "dictionary",
        "dict",
        "previously seen values",
        "previously seen numbers",
        "seen values in a map",
        "store values in a map",
        "store numbers in a map"
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


# Algorithmic techniques and algorithms
ALGORITHM_CONCEPTS = {
    "two pointer",
    "binary search",
    "dynamic programming",
    "bfs",
    "dfs",
    "sorting",
    "greedy",
    "single pass"
}


# Data structures
DATA_STRUCTURE_CONCEPTS = {
    "hash map",
    "stack",
    "queue"
}


def extract_concepts(answer: str) -> dict:
    """
    Detect programming concepts explicitly mentioned
    in a candidate answer.

    Returns both the original concepts_detected field
    and structured NLP fields used by the evaluation state.
    """

    if not answer:
        return {
            "concepts_detected": [],
            "approach": "",
            "algorithms": [],
            "concepts": [],
            "data_structures": []
        }

    text = answer.lower()

    concepts_detected = []

    for concept, keywords in CONCEPT_KEYWORDS.items():

        for keyword in keywords:

            pattern = (
                r"(?<!\w)"
                + re.escape(keyword)
                + r"(?!\w)"
            )

            if re.search(pattern, text):
                concepts_detected.append(concept)
                break

    # Separate algorithmic techniques
    algorithms = [
        concept
        for concept in concepts_detected
        if concept in ALGORITHM_CONCEPTS
    ]

    # Separate data structures
    data_structures = [
        concept
        for concept in concepts_detected
        if concept in DATA_STRUCTURE_CONCEPTS
    ]

    # Remaining concepts
    concepts = [
        concept
        for concept in concepts_detected
        if (
            concept not in ALGORITHM_CONCEPTS
            and concept not in DATA_STRUCTURE_CONCEPTS
        )
    ]

    # Determine primary approach.
    #
    # Prefer an algorithmic approach when available.
    # Otherwise use the first detected data structure.
    approach = ""

    if algorithms:
        approach = algorithms[0]

    elif data_structures:
        approach = data_structures[0]

    return {
        "concepts_detected": concepts_detected,
        "approach": approach,
        "algorithms": algorithms,
        "concepts": concepts,
        "data_structures": data_structures
    }