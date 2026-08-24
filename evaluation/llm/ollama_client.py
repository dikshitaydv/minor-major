import json
import urllib.request
import sys
import time
import threading

from evaluation.configs.ai_config import OLLAMA_BASE_URL, LLM_MODEL


def _show_loader(stop_event):
    """
    Display a spinner while Ollama is generating the evaluation.
    """

    spinner = ["|", "/", "-", "\\"]

    i = 0

    while not stop_event.is_set():

        sys.stdout.write(
            f"\rEvaluating with {LLM_MODEL}... "
            f"{spinner[i % len(spinner)]}"
        )

        sys.stdout.flush()

        i += 1
        time.sleep(0.2)

    # Clear the loader line after completion
    sys.stdout.write("\r" + " " * 70 + "\r")
    sys.stdout.flush()


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

    # --------------------------------------------------
    # Start loader
    # --------------------------------------------------

    stop_event = threading.Event()

    loader_thread = threading.Thread(
        target=_show_loader,
        args=(stop_event,),
        daemon=True
    )

    loader_thread.start()

    try:

        # --------------------------------------------------
        # Ollama request
        # --------------------------------------------------

        with urllib.request.urlopen(request) as response:
            result = json.loads(
                response.read().decode("utf-8")
            )

    finally:

        # --------------------------------------------------
        # Stop loader
        # --------------------------------------------------

        stop_event.set()
        loader_thread.join()

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