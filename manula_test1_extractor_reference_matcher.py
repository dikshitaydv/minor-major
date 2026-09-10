"""
Manual sanity check for the NLP extraction + reference matching pipeline.

This is NOT a pytest test — it's a script to eyeball actual match quality
on realistic candidate answers, which the automated tests can't verify
(they check the contract shape, not whether the match is a *good* one).

Run from the repo root (the folder containing evaluation/, AI/, backend/):

    python manual_reference_check.py

Requires Ollama running locally with qwen3:4b and qwen3:1.7b pulled.
"""

from evaluation.extraction.extraction_service import extract_candidate_features
from evaluation.scoring.reference_matcher import match_reference_solution_with_confidence
from evaluation.dataset_loader import load_reference_solution


PROBLEM_ID = "P001"  # Two Sum

SAMPLE_ANSWERS = {
    "brute_force": (
        "I'll use two nested loops and compare every pair of numbers "
        "to find the ones that add up to the target."
    ),
    "optimal": (
        "I'll use a HashMap to store each number I've seen along with its "
        "index. For every new number, I check if its complement (target "
        "minus the number) is already in the map."
    ),
    "names_a_real_technique_but_hedges": (
        "I think I'd maybe sort the array first and use two pointers, "
        "or I could just check pairs, not totally sure which is faster."
    ),
    "truly_no_algorithm_named": (
        "I'm not sure how to solve this, maybe check the numbers "
        "somehow or use some kind of loop, not sure what would work best."
    ),
}


def run_check(problem_id: str, label: str, answer: str) -> None:
    print("=" * 70)
    print(f"[{label}]")
    print("-" * 70)
    print(f"Answer: {answer}")

    state = extract_candidate_features(answer)
    print("\nExtracted state:")
    for key, value in state.items():
        print(f"  {key}: {value}")

    refs = load_reference_solution({"problem_id": problem_id})
    reference_id, confidence = match_reference_solution_with_confidence(
        candidate_state=state,
        reference_solutions=refs,
    )

    matched = next(
        (r for r in refs if r.get("Reference ID") == reference_id),
        None,
    )

    print(f"\nMatched reference : {reference_id}")
    if matched:
        print(f"  -> Solution Type : {matched.get('Solution Type')}")
    print(f"Match confidence  : {confidence}")
    print()


if __name__ == "__main__":
    for label, answer in SAMPLE_ANSWERS.items():
        run_check(PROBLEM_ID, label, answer)