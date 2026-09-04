import json
import urllib.request

from evaluation.configs.ai_config import (
    OLLAMA_BASE_URL,
    EXTRACTOR_MODEL,
)


# ============================================================
# OUTPUT SCHEMA
# ============================================================

EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "approach": {
            "type": ["string", "null"]
        },
        "algorithms": {
            "type": "array",
            "items": {"type": "string"}
        },
        "concepts": {
            "type": "array",
            "items": {"type": "string"}
        },
        "operations": {
            "type": "array",
            "items": {"type": "string"}
        },
        "data_structures": {
            "type": "array",
            "items": {"type": "string"}
        },
        "time_complexity": {
            "type": ["string", "null"]
        },
        "space_complexity": {
            "type": ["string", "null"]
        },
        "reasoning_summary": {
            "type": ["string", "null"]
        },
        "edge_cases": {
            "type": "array",
            "items": {"type": "string"}
        },
        "assumptions": {
            "type": "array",
            "items": {"type": "string"}
        },
        "optimization": {
            "type": ["boolean", "null"]
        },
    },
    "required": [
        "approach",
        "algorithms",
        "concepts",
        "operations",
        "data_structures",
        "time_complexity",
        "space_complexity",
        "reasoning_summary",
        "edge_cases",
        "assumptions",
        "optimization",
    ],
    "additionalProperties": False,
}


# ============================================================
# STRUCTURAL CLEANING
# ============================================================

def _clean_string(value):
    """
    Structural cleanup only.

    This function must remain domain-agnostic.

    It does not:
        - infer algorithms
        - infer data structures
        - rewrite technical terminology
        - add missing information
        - apply problem-specific rules
    """

    if value is None:
        return None

    if not isinstance(value, str):
        value = str(value)

    value = value.strip()

    return value if value else None


def _clean_list(value):
    """
    Structural cleanup only.

    Semantic interpretation and canonical terminology
    are handled by the LLM.
    """

    if not isinstance(value, list):
        return []

    result = []

    for item in value:
        if not isinstance(item, str):
            continue

        item = item.strip()

        if not item:
            continue

        if item not in result:
            result.append(item)

    return result


def _clean_complexity(value):
    """
    Complexity is extracted, not calculated.

    No correctness judgment is performed here.
    """

    if value is None:
        return None

    if not isinstance(value, str):
        value = str(value)

    value = value.strip()

    return value if value else None


def _clean_optimization(value):
    """
    Keep optimization tri-state:

        True  = explicitly discussed optimization
        False = explicitly said unnecessary/already optimal
        None  = not communicated
    """

    if value is True:
        return True

    if value is False:
        return False

    return None


# ============================================================
# OLLAMA CALL
# ============================================================

def _call_ollama(prompt: str) -> dict:
    """
    Send the extraction prompt to Ollama.

    Python is responsible for:
        - HTTP communication
        - JSON parsing
        - structural validation

    The LLM is responsible for:
        - semantic interpretation
        - canonical terminology
        - deciding what the candidate communicated
    """

    payload = {
        "model": EXTRACTOR_MODEL,
        "prompt": prompt,
        "stream": False,

        # Use the actual JSON schema instead of unconstrained
        # JSON output.
        "format": EXTRACTION_SCHEMA,

        "think": False,

        "options": {
            "temperature": 0,
            "seed": 42,
        },
    }

    data = json.dumps(payload).encode("utf-8")

    ollama_url = (
        f"{OLLAMA_BASE_URL.rstrip('/')}"
        "/api/generate"
    )

    request = urllib.request.Request(
        ollama_url,
        data=data,
        headers={
            "Content-Type": "application/json"
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=300,
        ) as response:
            raw_response = response.read().decode("utf-8")

    except Exception as exc:
        raise RuntimeError(
            f"Ollama extraction request failed: {exc}"
        ) from exc

    # --------------------------------------------------------
    # Parse Ollama HTTP response
    # --------------------------------------------------------

    try:
        outer = json.loads(raw_response)

    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Ollama returned invalid JSON."
        ) from exc

    response_text = outer.get("response")

    if not isinstance(response_text, str):
        raise RuntimeError(
            "Ollama response did not contain "
            "a valid 'response' field."
        )

    response_text = response_text.strip()

    if not response_text:
        raise RuntimeError(
            "Ollama returned an empty extraction response."
        )

    # --------------------------------------------------------
    # Parse model-generated JSON
    # --------------------------------------------------------

    try:
        result = json.loads(response_text)

    except json.JSONDecodeError:
        start = response_text.find("{")
        end = response_text.rfind("}")

        if (
            start == -1
            or end == -1
            or end <= start
        ):
            raise RuntimeError(
                "Ollama extraction response "
                "contained invalid JSON."
            )

        candidate = response_text[start:end + 1]

        try:
            result = json.loads(candidate)

        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "Ollama extraction response "
                "contained invalid JSON."
            ) from exc

    if not isinstance(result, dict):
        raise RuntimeError(
            "Semantic extraction result "
            "must be a JSON object."
        )

    return result


# ============================================================
# PROMPT
# ============================================================

def _build_user_prompt(
    answer: str,
    problem: dict | None = None,
) -> str:

    problem_context = ""

    if isinstance(problem, dict):
        title = problem.get("title")
        description = problem.get("description")

        if title:
            problem_context += f"\nProblem: {title}"

        if description:
            problem_context += f"\nDescription: {description}"

    return f"""
You are a technical interview NLP extraction system.

Extract only the technical information communicated by the
candidate.

You are NOT an evaluator.

You are NOT a solution generator.

You must NOT replace the candidate's answer with the standard
or expected solution.

You must NOT invent information.

Semantic interpretation is allowed when the candidate's
wording provides sufficient evidence for that interpretation.


============================================================
CORE RULES
============================================================

1. Extract what the candidate communicated.

2. Do not solve the problem.

3. Do not evaluate correctness.

4. Do not assume the standard solution.

5. Do not calculate complexity.

6. Do not infer information merely because it is normally
   associated with a particular problem.

7. Generic actions are not automatically an approach.

8. When a candidate explicitly names a strategy, algorithm,
   technique, or data structure as their solution strategy,
   that named item MUST appear in "approach".

9. When semantic wording is sufficiently specific to identify
   a technical concept, extract that concept.

10. When semantic evidence is ambiguous, do not guess.

11. Use the most specific canonical technical terminology
    supported by the candidate.

12. Canonicalization must be generic and apply consistently
    across all algorithms, data structures, concepts, and
    technical terms.

13. Preserve the meaning of the candidate's statement.

14. Do not add information just because it would normally be
    present in the solution.


============================================================
CANONICAL TERMINOLOGY
============================================================

Normalize equivalent technical expressions to a consistent
canonical technical name.

Use:

- lowercase technical names where appropriate
- conventional terminology
- concise phrases
- consistent terminology across fields

Do not create Python-side special cases for individual
algorithms, data structures, or problems.

Examples of the GENERAL principle:

"Binary Search"
"binary-search"
"binary search"
-> "binary search"

"HashMap"
"Hash Map"
"hash-map"
-> "hash map"

"Two Pointer"
"two-pointers"
-> "two pointers"

These are examples of the canonicalization principle.


============================================================
OUTPUT
============================================================

Return ONLY one JSON object.

Use exactly these fields:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
APPROACH
============================================================

The "approach" field represents the candidate's meaningful
problem-solving strategy.

If the candidate explicitly states:

"I'll use a HashMap."

then:

"approach": "hash map"

If the candidate explicitly states:

"I'll use a stack."

then:

"approach": "stack"

If the candidate explicitly states:

"I'll use binary search."

then:

"approach": "binary search"

If the candidate explicitly states:

"I'll use two pointers."

then:

"approach": "two pointers"

This rule applies GENERICALLY to all explicitly named
strategies, algorithms, techniques, and data structures.

Do NOT omit an explicitly stated approach merely because the
same item also appears in "algorithms" or "data_structures".


Generic actions alone are NOT approaches.

For example:

"I'll iterate through the array."

-> "approach": null

"I'll check every element."

-> "approach": null

"I'll remember what I have seen."

-> "approach": null

"I'll iterate through the array and remember what I have
seen so far."

-> "approach": null

These statements do not uniquely identify a meaningful
algorithmic strategy.

A technical item can belong to more than one field.

If a candidate names a data structure as the mechanism they
intend to use to solve the problem, that data structure is
also the approach.

For example:

"I would use a HashMap to store previously seen values."
-> "approach": "hash map"
-> "data_structures": ["hash map"]

"I would use a stack to store opening brackets."
-> "approach": "stack"
-> "data_structures": ["stack"]

Do NOT treat "approach" and "data_structures" as mutually
exclusive fields.

The fact that a named technique is also a data structure
must NOT prevent it from being extracted as the approach.

============================================================
ALGORITHMS
============================================================

Extract an algorithm or algorithmic strategy actually
communicated by the candidate.

Examples:

"I'll use binary search."
-> ["binary search"]

"I'll sort the input first."
-> ["sorting"]

"I'll recursively divide the input and combine the results."
-> ["divide and conquer"]

Do not infer an algorithm merely because it is a standard
solution to the problem.


============================================================
CONCEPTS
============================================================

Extract technical concepts communicated by the candidate.

Use the MOST SPECIFIC canonical technical phrase supported
by the candidate's wording.

Do not reduce a specific technical concept to a weaker,
generic fragment.

For example:

"find the value that completes the target"

communicates:

"complement lookup"

Therefore:

-> ["complement lookup"]

rather than:

-> ["complement"]

or:

-> ["lookup"]

More generally, when several words together describe one
specific technical concept, represent the complete concept
as one canonical phrase.

Examples:

"constant time lookup"
-> "constant-time lookup"

"matching opening and closing brackets"
-> "bracket matching"

"divide the problem into smaller pieces"
-> "divide and conquer"

Apply this principle generically.


============================================================
OPERATIONS
============================================================

Extract concrete actions described by the candidate.

Examples:

"push opening brackets onto the stack"
-> ["push opening brackets onto stack"]

"check every possible pair"
-> ["check every possible pair"]

"scan the array from left to right"
-> ["scan the array from left to right"]

Operations describe actions.

They should not simply repeat the overall approach.


============================================================
DATA STRUCTURES
============================================================

Extract data structures explicitly named by the candidate.

Semantic identification is allowed when the candidate's
description is sufficiently specific to uniquely identify
the data structure.

For example:

"I'll remember what I have seen."

-> []

This is ambiguous.

But:

"I'll keep track of numbers I've already seen and find the
value that completes the target."

strongly communicates a hash-based lookup structure.

Therefore:

-> ["hash map"]

Do not apply that inference to vague memory statements.

Use the same semantic-evidence principle for all data
structures, not only hash-based structures.


============================================================
TIME COMPLEXITY
============================================================

Extract only complexity explicitly communicated by the
candidate.

Examples:

"O(n) time"
-> "O(n)"

"quadratic time"
-> "quadratic time"

Never calculate complexity.

Never infer complexity from the algorithm.


============================================================
SPACE COMPLEXITY
============================================================

Extract only complexity explicitly communicated by the
candidate.

Examples:

"O(1) extra space"
-> "O(1)"

"linear additional space"
-> "linear additional space"

Never calculate complexity.


============================================================
REASONING SUMMARY
============================================================

Use exactly the field:

"reasoning_summary"

Extract the candidate's actual reasoning, justification,
rationale, or cause/effect explanation.

Example:

"I use a HashMap because lookup is constant time on average."

A valid result is:

"uses a hash map because lookup is constant time on average"

The reasoning must come from the candidate.

Do not invent reasoning.


============================================================
EDGE CASES
============================================================

Extract explicitly communicated edge cases.

Normalize equivalent wording into concise canonical
descriptions.

Examples:

"duplicates"
-> "duplicate values"

"duplicate elements"
-> "duplicate values"

"an empty array"
-> "empty array"

"empty input"
-> "empty input"

Example:

"I'll handle duplicates and an empty array."

-> [
     "duplicate values",
     "empty array"
   ]

Do not invent edge cases.


============================================================
ASSUMPTIONS
============================================================

Extract assumptions explicitly stated by the candidate.

Example:

"I assume the input contains at least two elements."

-> [
     "input contains at least two elements"
   ]

Example:

"I assume all values are positive."

-> [
     "all values are positive"
   ]

Do not infer assumptions from the problem statement.


============================================================
OPTIMIZATION
============================================================

This field is tri-state.

true:
The candidate explicitly discusses optimization, improving
the approach, reducing time/space usage, or replacing a less
efficient approach with a better one.

false:
The candidate explicitly says optimization is unnecessary,
impossible, or the current solution is already optimal.

null:
The candidate does not communicate optimization.

Examples:

"We can optimize this approach by reducing the space usage."

-> true

"I'll optimize the brute force approach by using a better
lookup strategy."

-> true

"This solution is already optimal."

-> false

"I'll use a hash map."

-> null


============================================================
SEMANTIC EVIDENCE RULE
============================================================

For every extracted item, use this process:

STEP 1:
Is it explicitly stated?

If yes, extract it.

STEP 2:
If not explicitly stated, does the wording strongly and
uniquely communicate the technical concept?

If yes, extract it.

STEP 3:
Could multiple technical interpretations reasonably fit?

If yes, do not guess.

STEP 4:
Is the information only something normally used in the
standard solution?

If yes, do not extract it.


============================================================
EXAMPLE: EXPLICIT APPROACH
============================================================

Candidate:

"I'll use a HashMap."

Output:

{{
  "approach": "hash map",
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": ["hash map"],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: AMBIGUOUS ACTION
============================================================

Candidate:

"I'll iterate through the array and remember what I have
seen so far."

Output:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": ["iterate through the array"],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: SEMANTIC COMPLEMENT LOOKUP
============================================================

Candidate:

"I'll keep track of numbers I've already seen and find the
value that completes the target."

Output:

{{
  "approach": "track previously seen values and search for the required complement",
  "algorithms": [],
  "concepts": [
    "previously seen values",
    "complement lookup"
  ],
  "operations": [
    "track previously seen numbers",
    "search for the required complement"
  ],
  "data_structures": ["hash map"],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: REASONING
============================================================

Candidate:

"I use a HashMap because lookup is constant time on average."

Output:

{{
  "approach": "hash map",
  "algorithms": [],
  "concepts": ["constant-time lookup"],
  "operations": [],
  "data_structures": ["hash map"],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": "uses a hash map because lookup is constant time on average",
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: EDGE CASES
============================================================

Candidate:

"I'll handle duplicates and an empty array."

Output:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [
    "duplicate values",
    "empty array"
  ],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: ASSUMPTION
============================================================

Candidate:

"I assume the input contains at least two elements."

Output:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [
    "input contains at least two elements"
  ],
  "optimization": null
}}


============================================================
EXAMPLE: OPTIMIZATION
============================================================

Candidate:

"We can optimize this approach by reducing the space usage."

Output:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": true
}}


============================================================
EXAMPLE: COMPLEXITY
============================================================

Candidate:

"The solution takes O(n) time and O(n) space."

Output:

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": "O(n)",
  "space_complexity": "O(n)",
  "reasoning_summary": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}


============================================================
EXAMPLE: STACK
============================================================

Candidate:

"I'll push every opening bracket onto a stack and compare
each closing bracket with the top of the stack."

Extract:

- stack as the data structure
- bracket matching as the concept
- pushing and comparison as operations

Do not add unrelated information.


============================================================
FINAL TASK
============================================================

Apply all rules above to the candidate answer.

Return ONLY valid JSON.

CANDIDATE ANSWER:

{answer}

{problem_context}
""".strip()


# ============================================================
# VALIDATION
# ============================================================

def _validate_result(
    result: dict,
) -> dict:
    """
    Convert the raw LLM response into the canonical extraction
    contract.

    No domain-specific semantic rules are applied here.
    """

    if not isinstance(result, dict):
        raise RuntimeError(
            "Semantic extraction result must be an object."
        )

    return {
        "approach": _clean_string(
            result.get("approach")
        ),

        "algorithms": _clean_list(
            result.get("algorithms", [])
        ),

        "concepts": _clean_list(
            result.get("concepts", [])
        ),

        "operations": _clean_list(
            result.get("operations", [])
        ),

        "data_structures": _clean_list(
            result.get("data_structures", [])
        ),

        "time_complexity": _clean_complexity(
            result.get("time_complexity")
        ),

        "space_complexity": _clean_complexity(
            result.get("space_complexity")
        ),

        "reasoning_summary": _clean_string(
            result.get("reasoning_summary")
        ),

        "edge_cases": _clean_list(
            result.get("edge_cases", [])
        ),

        "assumptions": _clean_list(
            result.get("assumptions", [])
        ),

        "optimization": _clean_optimization(
            result.get("optimization")
        ),
    }


# ============================================================
# PUBLIC API
# ============================================================

def extract_with_llm(
    answer: str,
    problem: dict | None = None,
) -> dict:
    """
    Extract candidate NLP features using the configured
    Ollama extraction model.
    """

    if not isinstance(answer, str):
        raise TypeError(
            "Candidate answer must be a string."
        )

    if not answer.strip():
        raise ValueError(
            "Candidate answer cannot be empty."
        )

    prompt = _build_user_prompt(
        answer=answer,
        problem=problem,
    )

    result = _call_ollama(prompt)

    return _validate_result(result)