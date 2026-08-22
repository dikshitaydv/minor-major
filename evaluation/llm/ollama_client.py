import json
import urllib.request

from evaluation.configs.ai_config import OLLAMA_BASE_URL, LLM_MODEL


def generate_evaluation(prompt: str) -> dict:
    """
    Send an evaluation prompt to the local Ollama LLM
    and return the generated response.
    """

    payload = {
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False,
        "think": False,
        "format": "json",
        "options": {
            "num_predict": 350
        }
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        f"{OLLAMA_BASE_URL}/api/generate",
        data=data,
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))

    response_text = result.get("response", "")

    try:
        evaluation = json.loads(response_text)
    except json.JSONDecodeError:
        evaluation = {
            "raw_response": response_text
        }

    return {
        "model": result.get("model"),
        "evaluation": evaluation
    }