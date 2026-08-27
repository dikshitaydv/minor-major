import json
import urllib.request

from evaluation.configs.ai_config import (
    OLLAMA_BASE_URL,
    LLM_MODEL
)


def generate_followup_question(
    problem: dict,
    candidate_answer: str,
    candidate_state: dict,
    followup_strategy: dict
) -> str:

    # ==================================================
    # EXTRACT STRATEGY
    # ==================================================

    adaptive_gap = followup_strategy.get(
        "adaptive_gap",
        ""
    )

    objective = followup_strategy.get(
        "objective",
        ""
    )

    focus = followup_strategy.get(
        "focus",
        []
    )

    instruction = followup_strategy.get(
        "instruction",
        ""
    )

    # ==================================================
    # EXTRACT PROBLEM
    # ==================================================

    problem_title = problem.get(
        "title",
        ""
    )

    problem_description = problem.get(
        "description",
        ""
    )

    # ==================================================
    # EXTRACT STATE
    # ==================================================

    scores = candidate_state.get(
        "scores",
        {}
    )

    evidence = candidate_state.get(
        "evidence",
        {}
    )

    history = candidate_state.get(
        "history",
        []
    )

    # ==================================================
    # PREVIOUS QUESTIONS
    # ==================================================

    previous_questions = []

    for previous_turn in history:

        if not isinstance(
            previous_turn,
            dict
        ):
            continue

        question = previous_turn.get(
            "interviewer_question"
        )

        if not question:
            question = previous_turn.get(
                "followup_question"
            )

        if (
            isinstance(question, str)
            and question.strip()
        ):
            previous_questions.append(
                question.strip()
            )

    # ==================================================
    # PROMPT
    # ==================================================

    prompt = f"""
You are an adaptive technical interviewer.

Generate exactly ONE natural follow-up question
for the candidate.

Do not solve the problem.

Do not reveal scores or evaluation information.

Do not mention gaps, weaknesses, classifications,
rubrics, or evaluation.

==================================================
PROBLEM
==================================================

Title:
{problem_title}

Description:
{problem_description}

==================================================
CANDIDATE ANSWER
==================================================

{candidate_answer}

==================================================
CURRENT SCORES
==================================================

{json.dumps(scores, indent=2)}

==================================================
CURRENT EVIDENCE
==================================================

{json.dumps(evidence, indent=2)}

==================================================
CONVERSATION HISTORY
==================================================

{json.dumps(history, indent=2)}

==================================================
PREVIOUS FOLLOW-UP QUESTIONS
==================================================

{json.dumps(previous_questions, indent=2)}

==================================================
ADAPTIVE TARGET
==================================================

Target:
{adaptive_gap}

Objective:
{objective}

Focus:
{json.dumps(focus, indent=2)}

Instruction:
{instruction}

==================================================
RULES
==================================================

1. Ask exactly ONE question.

2. Target the adaptive area.

3. Make the question specific to the candidate's
   actual approach.

4. Do not repeat a previous question.

5. If this area has already been questioned,
   probe a different or deeper aspect.

6. Do not mention scores.

7. Do not mention the adaptive classification.

8. Do not reveal internal evaluation information.

9. Do not provide the answer.

10. Do not give the candidate a solution.

11. Keep the question concise.

Return ONLY valid JSON.

The JSON MUST have exactly this structure:

{{
  "question": "your question here"
}}
"""

    # ==================================================
    # OLLAMA REQUEST
    # ==================================================

    payload = {
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False,
        "think": False,
        "format": "json",
        "options": {
            "num_predict": 200
        }
    }

    data = json.dumps(
        payload
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{OLLAMA_BASE_URL}/api/generate",
        data=data,
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    # ==================================================
    # CALL OLLAMA
    # ==================================================

    try:

        with urllib.request.urlopen(
            request
        ) as response:

            result = json.loads(
                response.read().decode(
                    "utf-8"
                )
            )

    except Exception as error:

        raise RuntimeError(
            f"Failed to generate follow-up question: {error}"
        )

    # ==================================================
    # GET RAW RESPONSE
    # ==================================================

    response_text = result.get(
        "response",
        ""
    )

    if not isinstance(
        response_text,
        str
    ):
        response_text = str(
            response_text
        )

    response_text = response_text.strip()

    # --------------------------------------------------
    # IMPORTANT DEBUG OUTPUT
    # --------------------------------------------------

    print()
    print("=" * 60)
    print("          RAW FOLLOW-UP RESPONSE")
    print("=" * 60)
    print(response_text)
    print("=" * 60)
    print()

    if not response_text:

        raise RuntimeError(
            "Ollama returned an empty follow-up response."
        )

    # ==================================================
    # PARSE JSON
    # ==================================================

    try:

        followup = json.loads(
            response_text
        )

    except json.JSONDecodeError as error:

        raise RuntimeError(
            "Ollama returned invalid JSON for the "
            f"follow-up question: {error}\n\n"
            f"Raw response:\n{response_text}"
        )

    # ==================================================
    # EXTRACT QUESTION
    # ==================================================

    question = None

    # --------------------------------------------------
    # Expected format
    # --------------------------------------------------

    if isinstance(
        followup,
        dict
    ):

        question = followup.get(
            "question"
        )

        # --------------------------------------------------
        # Some models may return:
        #
        # {
        #     "follow_up_question": "..."
        # }
        # --------------------------------------------------

        if not question:

            question = followup.get(
                "follow_up_question"
            )

        # --------------------------------------------------
        # Or:
        #
        # {
        #     "followup_question": "..."
        # }
        # --------------------------------------------------

        if not question:

            question = followup.get(
                "followup_question"
            )

    # ==================================================
    # VALIDATE
    # ==================================================

    if not isinstance(
        question,
        str
    ):

        raise RuntimeError(
            "Ollama returned valid JSON, but no question "
            "field was found.\n\n"
            f"Parsed response:\n{followup}"
        )

    question = question.strip()

    if not question:

        raise RuntimeError(
            "Ollama returned an empty question."
        )

    # ==================================================
    # INTERNAL INFORMATION CHECK
    # ==================================================

    lower_question = question.lower()

    forbidden_terms = [
        "your score",
        "your scores",
        "your gap",
        "you have a gap",
        "your weakness",
        "evaluation says",
        "evaluation shows",
        "rubric"
    ]

    for term in forbidden_terms:

        if term in lower_question:

            raise RuntimeError(
                "Generated question contains internal "
                f"evaluation information: '{term}'"
            )

    # ==================================================
    # RETURN
    # ==================================================

    return question