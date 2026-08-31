import json
import urllib.request

from evaluation.configs.ai_config import (
    OLLAMA_BASE_URL,
    EXTRACTOR_MODEL
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
            "items": {
                "type": "string"
            }
        },

        "concepts": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "operations": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "data_structures": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "time_complexity": {
            "type": ["string", "null"]
        },

        "space_complexity": {
            "type": ["string", "null"]
        },

        "reasoning": {
            "type": ["string", "null"]
        },

        "edge_cases": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "assumptions": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "optimization": {
            "type": ["boolean", "null"]
        }
    },

    "required": [
        "approach",
        "algorithms",
        "concepts",
        "operations",
        "data_structures",
        "time_complexity",
        "space_complexity",
        "reasoning",
        "edge_cases",
        "assumptions",
        "optimization"
    ],

    "additionalProperties": False
}


# ============================================================
# CLEANING HELPERS
# ============================================================

def _clean_string(value):
    if value is None:
        return None

    if not isinstance(value, str):
        value = str(value)

    value = value.strip()

    return value if value else None


def _clean_list(value):
    """
    Structural cleanup only.

    This function does not decide what something means.
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

    No attempt is made to validate whether the claim
    is actually correct.
    """

    if value is None:
        return None

    if not isinstance(value, str):
        value = str(value)

    value = value.strip()

    return value if value else None


def _clean_optimization(value):
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

    Python is responsible only for:
        - HTTP communication
        - JSON parsing
        - structural cleanup

    Qwen is responsible for semantic interpretation.
    """

    payload = {
        "model": EXTRACTOR_MODEL,
        "prompt": prompt,
        "stream": False,

        # JSON mode rather than the large JSON schema.
        # This is more reliable with qwen3:4b in this setup.
        "format": "json",

        # We want extraction, not a long reasoning response.
        "think": False,

        "options": {
            "temperature": 0,
            "seed": 42
        }
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
        method="POST"
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=300
        ) as response:

            raw_response = response.read().decode(
                "utf-8"
            )

    except Exception as exc:

        raise RuntimeError(
            f"Ollama extraction request failed: {exc}"
        ) from exc

    # --------------------------------------------------------
    # Parse Ollama HTTP response
    # --------------------------------------------------------

    try:

        outer = json.loads(
            raw_response
        )

    except json.JSONDecodeError as exc:

        raise RuntimeError(
            "Ollama returned invalid JSON."
        ) from exc

    response_text = outer.get("response")

    if not isinstance(
        response_text,
        str
    ):

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

        result = json.loads(
            response_text
        )

    except json.JSONDecodeError:

        # Occasionally the model may wrap JSON in text.
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

        candidate = response_text[
            start:end + 1
        ]

        try:

            result = json.loads(
                candidate
            )

        except json.JSONDecodeError as exc:

            raise RuntimeError(
                "Ollama extraction response "
                "contained invalid JSON."
            ) from exc

    if not isinstance(
        result,
        dict
    ):

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
    problem: dict | None = None
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
Extract the technical information explicitly communicated
by the candidate answer.

Do NOT solve the problem.
Do NOT evaluate correctness.
Do NOT assume the standard solution.
Do NOT invent missing information.

Semantic interpretation is allowed when directly supported
by the candidate's wording.

Return ONLY one JSON object.

{{
  "approach": null,
  "algorithms": [],
  "concepts": [],
  "operations": [],
  "data_structures": [],
  "time_complexity": null,
  "space_complexity": null,
  "reasoning": null,
  "edge_cases": [],
  "assumptions": [],
  "optimization": null
}}

FIELD RULES:

approach:
The main strategy communicated by the candidate.

algorithms:
An identifiable algorithmic strategy actually described.

concepts:
Technical ideas or properties communicated by the candidate.

operations:
Actions the candidate describes performing.

data_structures:
Only structures explicitly named or clearly described.
Do not infer a specific structure from vague wording.

time_complexity:
Only if the candidate explicitly states it.
Never calculate it.

space_complexity:
Only if the candidate explicitly states it.
Never calculate it.

reasoning:
Only reasoning actually communicated by the candidate.

edge_cases:
Only explicitly mentioned edge cases.

assumptions:
Only explicitly stated assumptions.

optimization:
true if optimization is explicitly discussed,
false if the candidate explicitly says optimization is
unnecessary/already optimal,
otherwise null.

IMPORTANT:

Keep concepts and operations separate.

Concept:
"stack"

Operation:
"push opening brackets onto stack"

Concept:
"complement"

Operation:
"search for the required complement"

Do not add information just because it is normally used
to solve the problem.

EXAMPLES:

Candidate:
"I will keep track of numbers I have already seen and
find the value that completes the target."

Output should contain information such as:

"approach":
"Track previously seen values and search for the required complement"

"concepts":
["previously seen values", "complement"]

"operations":
[
  "track previously seen numbers",
  "search for the required complement"
]

"data_structures":
[]

Do NOT invent "hash map".

---

Candidate:
"I will push every opening bracket onto a stack and
compare each closing bracket with the top of the stack."

Output should contain:

"approach":
"Use a stack to track opening brackets and compare closing brackets with the stack top"

"concepts":
["stack", "bracket matching"]

"operations":
[
  "push opening brackets onto stack",
  "compare closing brackets with stack top"
]

"data_structures":
["stack"]

---

Candidate:
"I would sort the elements first and then use two pointers
from opposite ends."

Extract the sorting and two-pointer strategy.

---

Candidate:
"I would recursively divide the input into smaller pieces
and combine the results."

Extract the recursive divide-and-combine strategy.

---

Candidate:
"I would use two nested loops and check every possible pair.
This takes O(n^2) time and O(1) extra space."

Extract:

"operations":
["check every possible pair"]

"time_complexity":
"O(n^2)"

"space_complexity":
"O(1)"

Do not calculate anything.

---

Candidate:
"If the input is empty, I return immediately. I assume the
input contains only positive numbers."

Extract:

"edge_cases":
["empty input"]

"assumptions":
["input contains only positive numbers"]

---

CANDIDATE ANSWER:
{answer}

{problem_context}
""".strip()


# ============================================================
# VALIDATION
# ============================================================

def _validate_result(
    result: dict
) -> dict:

    if not isinstance(
        result,
        dict
    ):

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

        "reasoning": _clean_string(
            result.get("reasoning")
        ),

        "edge_cases": _clean_list(
            result.get("edge_cases", [])
        ),

        "assumptions": _clean_list(
            result.get("assumptions", [])
        ),

        "optimization": _clean_optimization(
            result.get("optimization")
        )
    }


# ============================================================
# PUBLIC API
# ============================================================

def extract_with_llm(
    answer: str,
    problem: dict | None = None
) -> dict:

    if not isinstance(
        answer,
        str
    ):

        raise TypeError(
            "Candidate answer must be a string."
        )

    if not answer.strip():

        raise ValueError(
            "Candidate answer cannot be empty."
        )

    prompt = _build_user_prompt(
        answer=answer,
        problem=problem
    )

    result = _call_ollama(
        prompt
    )

    return _validate_result(
        result
    )