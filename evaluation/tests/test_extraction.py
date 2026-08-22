from evaluation.extraction.extraction_service import extract_candidate_features


def test_normal_answer():
    answer = (
        "First, I store previously seen values in a hash map. "
        "Then I check whether the complement exists. "
        "Finally, I return the indices. "
        "Time complexity: O(n), Space complexity: O(n)."
    )

    result = extract_candidate_features(answer)

    assert result["original_answer"] == answer
    assert "hash map" in result["concepts_detected"]
    assert len(result["reasoning"]) > 0
    assert result["complexity_claim"]["time"] == "o(n)"
    assert result["complexity_claim"]["space"] == "o(n)"


def test_empty_answer():
    result = extract_candidate_features("")

    assert result["original_answer"] == ""
    assert result["normalized_answer"] == ""
    assert result["concepts_detected"] == []
    assert result["reasoning"] == []
    assert result["complexity_claim"]["time"] is None
    assert result["complexity_claim"]["space"] is None


def test_alternative_answer():
    answer = (
        "I will sort the array first and use two pointers "
        "to find the required pair."
    )

    result = extract_candidate_features(answer)

    assert "two pointer" in result["concepts_detected"]
    assert "sorting" in result["concepts_detected"]


def test_wrong_answer():
    answer = "I will return the first two elements without checking their sum."

    result = extract_candidate_features(answer)

    assert result["normalized_answer"] == answer
    assert result["concepts_detected"] == []


def test_verbose_answer():
    answer = (
        "First, I create a hash map. "
        "Then I iterate through every element. "
        "For each element I calculate the complement. "
        "After that I check whether the complement exists. "
        "Finally, if it exists, I return the indices. "
        "Time complexity is O(n) and space complexity is O(n)."
    )

    result = extract_candidate_features(answer)

    assert "hash map" in result["concepts_detected"]
    assert len(result["reasoning"]) >= 4
    assert result["complexity_claim"]["time"] == "o(n)"
    assert result["complexity_claim"]["space"] == "o(n)"


def test_concise_answer():
    answer = "Use a hash map. Time complexity: O(n)."

    result = extract_candidate_features(answer)

    assert "hash map" in result["concepts_detected"]
    assert result["complexity_claim"]["time"] == "o(n)"
    assert result["complexity_claim"]["space"] is None