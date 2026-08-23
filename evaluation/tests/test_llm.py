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

def test_malformed_llm_json():
    from unittest.mock import patch

    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {
                "response": '{"scores": {"algorithm_correctness": 10'
            }

    candidate_features = {
        "normalized_answer": "Use a hash map.",
        "concepts_detected": ["hash map"],
        "reasoning": ["Use a hash map to check the complement."],
        "complexity_claim": {
            "time": "O(n)",
            "space": "O(n)"
        }
    }

    problem = {
        "statement": "Find two numbers that add to a target."
    }

    with patch("evaluation.llm.llm_evaluator.httpx.post", return_value=FakeResponse()):
        from evaluation.llm.llm_evaluator import evaluate_with_llm

        result = evaluate_with_llm(
            candidate_features,
            problem
        )

    assert "scores" in result
    assert "errors" in result

def test_llm_timeout():
    from unittest.mock import patch
    import httpx

    candidate_features = {
        "normalized_answer": "Use a hash map.",
        "concepts_detected": ["hash map"],
        "reasoning": ["Use a hash map to check the complement."],
        "complexity_claim": {
            "time": "O(n)",
            "space": "O(n)"
        }
    }

    problem = {
        "statement": "Find two numbers that add to a target."
    }

    with patch(
        "evaluation.llm.llm_evaluator.httpx.post",
        side_effect=httpx.TimeoutException("LLM request timed out")
    ):
        from evaluation.llm.llm_evaluator import evaluate_with_llm

        result = evaluate_with_llm(
            candidate_features,
            problem
        )

    assert "scores" in result
    assert "errors" in result
    assert "LLM request timed out" in result["errors"]
def test_llm_http_error():
    from unittest.mock import patch
    import httpx

    candidate_features = {
        "normalized_answer": "Use a hash map.",
        "concepts_detected": ["hash map"],
        "reasoning": ["Use a hash map to check the complement."],
        "complexity_claim": {
            "time": "O(n)",
            "space": "O(n)"
        }
    }

    problem = {
        "statement": "Find two numbers that add to a target."
    }

    with patch(
        "evaluation.llm.llm_evaluator.httpx.post",
        side_effect=httpx.HTTPStatusError(
            "Server error",
            request=httpx.Request("POST", "http://localhost:11434"),
            response=httpx.Response(500)
        )
    ):
        from evaluation.llm.llm_evaluator import evaluate_with_llm

        result = evaluate_with_llm(
            candidate_features,
            problem
        )

    assert "scores" in result
    assert "errors" in result
    assert "LLM API error" in result["errors"]