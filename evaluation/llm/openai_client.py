import json
import time

from openai import OpenAI

from evaluation.configs.ai_config import (
    OPENAI_API_KEY,
    OPENAI_MODEL
)


# ==========================================================
# OpenAI Client
# ==========================================================

client = OpenAI(
    api_key=OPENAI_API_KEY
)


def generate_openai_evaluation(prompt: str) -> dict:
    """
    Send an evaluation prompt to OpenAI
    and return the generated evaluation.
    """

    # --------------------------------------------------
    # Start message
    # --------------------------------------------------

    print()
    print("=" * 60)
    print("           OPENAI EVALUATION IN PROGRESS")
    print("=" * 60)
    print(f"Model       : {OPENAI_MODEL}")
    print("Status      : Evaluating candidate solution...")
    print("Please wait...")
    print("=" * 60)
    print()

    start_time = time.time()

    try:

        # --------------------------------------------------
        # Send request to OpenAI
        # --------------------------------------------------

        response = client.chat.completions.create(
            model=OPENAI_MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0
        )

    except Exception as error:

        print()
        print("=" * 60)
        print("             OPENAI EVALUATION FAILED")
        print("=" * 60)
        print(f"Error       : {error}")
        print("=" * 60)
        print()

        raise

    # --------------------------------------------------
    # Calculate execution time
    # --------------------------------------------------

    elapsed_time = time.time() - start_time

    # --------------------------------------------------
    # Completion message
    # --------------------------------------------------

    print()
    print("=" * 60)
    print("           OPENAI EVALUATION COMPLETED")
    print("=" * 60)
    print(f"Model       : {OPENAI_MODEL}")
    print(f"Time Taken  : {elapsed_time:.2f} seconds")
    print("=" * 60)
    print()

    # --------------------------------------------------
    # Extract response text
    # --------------------------------------------------

    response_text = response.choices[0].message.content

    # --------------------------------------------------
    # Parse JSON
    # --------------------------------------------------

    try:

        evaluation = json.loads(
            response_text
        )

    except json.JSONDecodeError:

        evaluation = {
            "raw_response": response_text
        }

    # --------------------------------------------------
    # Return structured result
    # --------------------------------------------------

    return {
        "model": OPENAI_MODEL,
        "evaluation": evaluation
    }