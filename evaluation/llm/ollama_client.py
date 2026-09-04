import json
import time
import urllib.request
import urllib.error


from evaluation.configs.ai_config import (
    OLLAMA_BASE_URL,
    EVALUATOR_MODEL,
)


# ============================================================
# EVALUATION OUTPUT SCHEMA
# ============================================================

EVALUATION_SCHEMA = {
    "type": "object",
    "properties": {
        "scores": {
            "type": "object",
            "properties": {

                "algorithm_correctness": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "logical_reasoning": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "concept_coverage": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "completeness": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "data_structure": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "complexity": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },

                "edge_cases": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": ["integer", "null"]
                        },
                        "assessment_status": {
                            "type": "string",
                            "enum": [
                                "ASSESSED",
                                "NOT_ASSESSED"
                            ]
                        },
                        "evidence": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "score",
                        "assessment_status",
                        "evidence"
                    ],
                    "additionalProperties": False
                },
            },

            "required": [
                "algorithm_correctness",
                "logical_reasoning",
                "concept_coverage",
                "completeness",
                "data_structure",
                "complexity",
                "edge_cases"
            ],

            "additionalProperties": False
        }
    },

    "required": [
        "scores"
    ],

    "additionalProperties": False
}


# ============================================================
# OLLAMA URL
# ============================================================

def _build_ollama_url() -> str:
    """
    Build the Ollama generation endpoint from the
    generic Ollama base URL.
    """

    return (
        f"{OLLAMA_BASE_URL.rstrip('/')}"
        "/api/generate"
    )


# ============================================================
# JSON PARSER
# ============================================================

def _parse_json_response(response_text: str) -> dict:
    """
    Parse the JSON object generated by the model.

    Handles occasional markdown/code-fence wrapping.

    No semantic interpretation is performed here.
    """

    if not isinstance(response_text, str):
        raise RuntimeError(
            "Ollama returned a non-string response."
        )

    response_text = response_text.strip()

    if not response_text:
        raise RuntimeError(
            "Ollama returned an empty evaluation response."
        )

    # --------------------------------------------------------
    # Direct JSON
    # --------------------------------------------------------

    try:

        result = json.loads(
            response_text
        )

        if isinstance(result, dict):
            return result

    except json.JSONDecodeError:
        pass

    # --------------------------------------------------------
    # Recover JSON from surrounding text
    # --------------------------------------------------------

    start = response_text.find("{")
    end = response_text.rfind("}")

    if (
        start == -1
        or end == -1
        or end <= start
    ):
        raise RuntimeError(
            "Ollama evaluation response contained "
            "invalid JSON."
        )

    candidate_json = response_text[
        start:end + 1
    ]

    try:

        result = json.loads(
            candidate_json
        )

    except json.JSONDecodeError as exc:

        raise RuntimeError(
            "Ollama evaluation response contained "
            "invalid JSON."
        ) from exc

    if not isinstance(result, dict):

        raise RuntimeError(
            "Ollama evaluation response must be "
            "a JSON object."
        )

    return result


# ============================================================
# GENERATE EVALUATION
# ============================================================

def generate_evaluation(prompt: str) -> dict:
    """
    Send an evaluation prompt to the local Ollama LLM
    and return the generated evaluation.

    Architecture:

        Evaluation prompt
              |
              v
        Ollama /api/generate
              |
              v
        Qwen3 Evaluator
              |
              v
        Structured JSON
              |
              v
        Parsed evaluation

    This client performs transport and JSON parsing only.

    It does NOT:

        - evaluate the candidate
        - infer scores
        - extract concepts
        - modify semantic content
        - calculate complexity
    """

    if not isinstance(prompt, str):
        raise TypeError(
            "Evaluation prompt must be a string."
        )

    if not prompt.strip():
        raise ValueError(
            "Evaluation prompt cannot be empty."
        )

    # --------------------------------------------------------
    # Confirm client is being called
    # --------------------------------------------------------

    print(
        "\n>>> OLLAMA EVALUATOR CLIENT WAS CALLED <<<\n",
        flush=True,
    )

    # --------------------------------------------------------
    # Endpoint
    # --------------------------------------------------------

    ollama_url = _build_ollama_url()

    # --------------------------------------------------------
    # Request payload
    # --------------------------------------------------------

    payload = {
        "model": EVALUATOR_MODEL,

        "prompt": prompt,

        "stream": False,

        "think": False,

        # IMPORTANT:
        #
        # Use the complete JSON schema instead of simply
        # asking for generic JSON.
        #
        # This forces Ollama to generate the structure
        # expected by llm_evaluator.py.

        "format": EVALUATION_SCHEMA,

        "options": {
            "temperature": 0.1,
            "num_predict": 1600,
        },
    }

    print(
        f"Model        : {EVALUATOR_MODEL}"
    )

    print(
        "Role         : Evaluator"
    )

    print(
        f"Prompt length: {len(prompt)} characters"
    )

    print(
        f"Prompt tokens approximately: "
        f"{len(prompt.split())}"
    )

    print(
        f"num_predict  : "
        f"{payload['options']['num_predict']}"
    )

    data = json.dumps(
        payload
    ).encode("utf-8")

    request = urllib.request.Request(
        ollama_url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    # --------------------------------------------------------
    # Show evaluation started
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("              AI EVALUATION IN PROGRESS")
    print("=" * 60)
    print(
        f"Model        : {EVALUATOR_MODEL}"
    )
    print(
        "Role         : Evaluator"
    )
    print(
        f"Endpoint     : {ollama_url}"
    )
    print(
        "Status       : Evaluating candidate solution..."
    )
    print(
        "Please wait..."
    )
    print("=" * 60)
    print(
        flush=True
    )

    start_time = time.time()

    # --------------------------------------------------------
    # Send request
    # --------------------------------------------------------

    try:

        with urllib.request.urlopen(
            request,
            timeout=300,
        ) as response:

            raw_response = response.read().decode(
                "utf-8"
            )

    except urllib.error.HTTPError as error:

        try:

            error_body = error.read().decode(
                "utf-8",
                errors="replace",
            )

        except Exception:

            error_body = ""

        message = (
            f"HTTP {error.code}: {error.reason}"
        )

        if error_body.strip():

            message += (
                f" | Ollama response: "
                f"{error_body.strip()}"
            )

        print()
        print("=" * 60)
        print("                 EVALUATION FAILED")
        print("=" * 60)
        print(
            f"Error: {message}"
        )
        print(
            f"URL  : {ollama_url}"
        )
        print("=" * 60)
        print()

        raise RuntimeError(
            "Ollama evaluation request failed: "
            f"{message}"
        ) from error

    except Exception as error:

        print()
        print("=" * 60)
        print("                 EVALUATION FAILED")
        print("=" * 60)
        print(
            f"Error: {error}"
        )
        print(
            f"URL  : {ollama_url}"
        )
        print("=" * 60)
        print()

        raise RuntimeError(
            "Ollama evaluation request failed: "
            f"{error}"
        ) from error

    # --------------------------------------------------------
    # Execution time
    # --------------------------------------------------------

    elapsed_time = (
        time.time() - start_time
    )

    # --------------------------------------------------------
    # Parse Ollama HTTP JSON
    # --------------------------------------------------------

    try:

        result = json.loads(
            raw_response
        )

    except json.JSONDecodeError as exc:

        raise RuntimeError(
            "Ollama returned invalid HTTP JSON."
        ) from exc

    if not isinstance(result, dict):

        raise RuntimeError(
            "Ollama HTTP response must be "
            "a JSON object."
        )

    # --------------------------------------------------------
    # Extract generated response
    # --------------------------------------------------------

    response_text = result.get(
        "response"
    )

    if not isinstance(
        response_text,
        str,
    ):

        raise RuntimeError(
            "Ollama response did not contain a valid "
            "'response' field."
        )

    response_text = response_text.strip()

    if not response_text:

        raise RuntimeError(
            "Ollama returned an empty evaluation response."
        )

    # --------------------------------------------------------
    # Parse generated JSON
    # --------------------------------------------------------

    evaluation = _parse_json_response(
        response_text
    )

    # --------------------------------------------------------
    # Show completion
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("              AI EVALUATION COMPLETED")
    print("=" * 60)
    print(
        f"Model        : "
        f"{result.get('model', EVALUATOR_MODEL)}"
    )
    print(
        "Role         : Evaluator"
    )
    print(
        f"Time Taken   : "
        f"{elapsed_time:.2f} seconds"
    )
    print("=" * 60)
    print()

    # --------------------------------------------------------
    # Debug output
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("              RAW OLLAMA EVALUATION")
    print("=" * 60)

    print(
        json.dumps(
            evaluation,
            indent=2,
            ensure_ascii=False,
        )
    )

    print("=" * 60)
    print()

    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    return {
        "model": result.get(
            "model",
            EVALUATOR_MODEL,
        ),
        "evaluation": evaluation,
    }
    
def generate_structured_json(
    prompt: str,
    model: str,
    schema: dict,
    num_predict: int = 800,
) -> dict:
    """
    Send a prompt to Ollama requesting a structured JSON response.

    This is a generic LLM transport function. It does not perform
    evaluation or semantic interpretation.
    """

    if not isinstance(prompt, str):
        raise TypeError(
            "Prompt must be a string."
        )

    if not prompt.strip():
        raise ValueError(
            "Prompt cannot be empty."
        )

    if not isinstance(model, str) or not model.strip():
        raise ValueError(
            "Model must be a non-empty string."
        )

    if not isinstance(schema, dict):
        raise TypeError(
            "schema must be a dictionary."
        )

    ollama_url = _build_ollama_url()

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "think": False,
        "format": schema,
        "options": {
            "temperature": 0.1,
            "num_predict": num_predict,
        },
    }

    data = json.dumps(
        payload
    ).encode("utf-8")

    request = urllib.request.Request(
        ollama_url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    start_time = time.time()

    try:

        with urllib.request.urlopen(
            request,
            timeout=300,
        ) as response:

            raw_response = response.read().decode(
                "utf-8"
            )

    except urllib.error.HTTPError as error:

        try:
            error_body = error.read().decode(
                "utf-8",
                errors="replace",
            )
        except Exception:
            error_body = ""

        message = (
            f"HTTP {error.code}: {error.reason}"
        )

        if error_body.strip():
            message += (
                f" | Ollama response: "
                f"{error_body.strip()}"
            )

        raise RuntimeError(
            f"Ollama structured JSON request failed: "
            f"{message}"
        ) from error

    except Exception as error:

        raise RuntimeError(
            f"Ollama structured JSON request failed: "
            f"{error}"
        ) from error

    try:

        result = json.loads(
            raw_response
        )

    except json.JSONDecodeError as error:

        raise RuntimeError(
            "Ollama returned invalid HTTP JSON."
        ) from error

    if not isinstance(result, dict):
        raise RuntimeError(
            "Ollama HTTP response must be a JSON object."
        )

    response_text = result.get(
        "response"
    )

    if not isinstance(
        response_text,
        str
    ):
        raise RuntimeError(
            "Ollama response did not contain a valid "
            "'response' field."
        )

    response_text = response_text.strip()

    if not response_text:
        raise RuntimeError(
            "Ollama returned an empty response."
        )

    return _parse_json_response(
        response_text
    )  