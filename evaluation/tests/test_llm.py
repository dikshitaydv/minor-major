from evaluation.llm.evaluator import evaluate_candidate


PROBLEM = "Find two numbers in an array that add up to a target."

REFERENCE_SOLUTION = (
    "Use a hash map to store previously seen values and check "
    "whether the complement exists."
)

EXPECTED_CONCEPTS = ["hash map"]

EXPECTED_COMPLEXITY = {
    "time": "O(n)",
    "space": "O(n)"
}

RUBRIC = (
    "Evaluate algorithm correctness, logical reasoning, concept coverage, "
    "completeness, data structure usage, complexity, and edge cases."
)


def test_correct_hash_map_solution():
    result = evaluate_candidate(
        PROBLEM,
        REFERENCE_SOLUTION,
        EXPECTED_CONCEPTS,
        EXPECTED_COMPLEXITY,
        [
            "I store previously seen values in a hash map.",
            "For each value I check whether its complement exists."
        ],
        RUBRIC
    )

    evaluation = result["evaluation"]

    assert "algorithm_correctness" in evaluation
    assert "logical_reasoning" in evaluation
    assert "concept_coverage" in evaluation
    assert "complexity" in evaluation
    assert "explanation" in evaluation


def test_concise_correct_solution():
    result = evaluate_candidate(
        PROBLEM,
        REFERENCE_SOLUTION,
        EXPECTED_CONCEPTS,
        EXPECTED_COMPLEXITY,
        [
            "Use a hash map and check the complement."
        ],
        RUBRIC
    )

    evaluation = result["evaluation"]

    assert "algorithm_correctness" in evaluation
    assert "explanation" in evaluation


def test_incorrect_solution():
    result = evaluate_candidate(
        PROBLEM,
        REFERENCE_SOLUTION,
        EXPECTED_CONCEPTS,
        EXPECTED_COMPLEXITY,
        [
            "I will return the first two elements without checking "
            "whether they add up to the target."
        ],
        RUBRIC
    )

    evaluation = result["evaluation"]

    assert "algorithm_correctness" in evaluation
    assert "explanation" in evaluation


def test_alternative_solution():
    result = evaluate_candidate(
        PROBLEM,
        REFERENCE_SOLUTION,
        EXPECTED_CONCEPTS,
        EXPECTED_COMPLEXITY,
        [
            "I will sort the array first and use two pointers "
            "to find the required pair."
        ],
        RUBRIC
    )

    evaluation = result["evaluation"]

    assert "algorithm_correctness" in evaluation
    assert "explanation" in evaluation