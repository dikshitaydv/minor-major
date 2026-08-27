import json
import urllib.request
import time

from evaluation.configs.ai_config import OLLAMA_BASE_URL, LLM_MODEL


def generate_evaluation(prompt: str) -> dict:
    """
    Send an evaluation prompt to the local Ollama LLM
    and return the generated response.
    """

    # --------------------------------------------------
    # Confirm that this file is actually being called
    # --------------------------------------------------

    print(
        "\n>>> OLLAMA CLIENT WAS CALLED <<<\n",
        flush=True
    )

    # --------------------------------------------------
    # Prepare Ollama request
    # --------------------------------------------------

    payload = {
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False,
        "think": False,
        "format": "json",
        "options": {
            "num_predict": 1200
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
    # Show evaluation started
    # --------------------------------------------------

    print()
    print("=" * 60)
    print("              AI EVALUATION IN PROGRESS")
    print("=" * 60)
    print(f"Model       : {LLM_MODEL}")
    print("Status      : Evaluating candidate solution...")
    print("Please wait...")
    print("=" * 60)
    print(flush=True)

    start_time = time.time()

    # --------------------------------------------------
    # Send request to Ollama
    # --------------------------------------------------

    try:

        with urllib.request.urlopen(request) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

    except Exception as error:

        print()
        print("=" * 60)
        print("                 EVALUATION FAILED")
        print("=" * 60)
        print(f"Error: {error}")
        print("=" * 60)
        print()

        raise

    # --------------------------------------------------
    # Calculate execution time
    # --------------------------------------------------

    elapsed_time = time.time() - start_time

    # --------------------------------------------------
    # Show evaluation completed
    # --------------------------------------------------

    print()
    print("=" * 60)
    print("              AI EVALUATION COMPLETED")
    print("=" * 60)
    print(f"Model       : {result.get('model', LLM_MODEL)}")
    print(f"Time Taken  : {elapsed_time:.2f} seconds")
    print("=" * 60)
    print()

    # --------------------------------------------------
    # Extract model response
    # --------------------------------------------------

    response_text = result.get(
        "response",
        ""
    )

    # --------------------------------------------------
    # Parse JSON returned by Ollama
    # --------------------------------------------------

    try:

        evaluation = json.loads(
            response_text
        )

        # --------------------------------------------------
        # DEBUG: Show the exact JSON returned by Qwen3
        # --------------------------------------------------

        print()
        print("=" * 60)
        print("              RAW OLLAMA EVALUATION")
        print("=" * 60)

        print(
            json.dumps(
                evaluation,
                indent=2
            )
        )

        print("=" * 60)
        print()

    except json.JSONDecodeError:

        # --------------------------------------------------
        # DEBUG: Show raw response if JSON parsing failed
        # --------------------------------------------------

        print()
        print("=" * 60)
        print("          INVALID OLLAMA JSON RESPONSE")
        print("=" * 60)

        print(response_text)

        print("=" * 60)
        print()

        evaluation = {
            "raw_response": response_text
        }

    # --------------------------------------------------
    # Return structured result
    # --------------------------------------------------

    return {
        "model": result.get(
            "model",
            LLM_MODEL
        ),
        "evaluation": evaluation
    }