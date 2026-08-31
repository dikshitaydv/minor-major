import json
from pathlib import Path


# ==========================================================
# DATASET ROOT
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_ROOT = PROJECT_ROOT / "dataset"

REFERENCES_DIR = DATASET_ROOT / "references"
RUBRICS_DIR = DATASET_ROOT / "rubrics"


# ==========================================================
# HELPERS
# ==========================================================

def _load_json(path: Path) -> dict:
    """
    Load a JSON file and return its contents.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset file not found: {path}"
        )

    try:
        with path.open(
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

    except json.JSONDecodeError as error:
        raise ValueError(
            f"Invalid JSON in dataset file: {path}"
        ) from error

    if not isinstance(data, dict):
        raise TypeError(
            f"Dataset file must contain a JSON object: {path}"
        )

    return data


def _get_problem_id(problem: dict) -> str:
    """
    Extract the dataset problem ID from the problem object.

    Supported forms:

        {
            "id": "P001"
        }

    or:

        {
            "problem_id": "P001"
        }
    """

    if not isinstance(problem, dict):
        raise TypeError(
            "problem must be a dictionary."
        )

    problem_id = (
        problem.get("problem_id")
        or problem.get("id")
    )

    if problem_id:
        return str(problem_id).strip()

    raise ValueError(
        "Problem does not contain 'id' or 'problem_id'. "
        "The dataset reference/rubric cannot be located."
    )


# ==========================================================
# PUBLIC API
# ==========================================================

def load_reference_solution(problem: dict) -> dict:
    """
    Load the reference solution for a problem.
    """

    problem_id = _get_problem_id(problem)

    path = (
        REFERENCES_DIR
        / f"{problem_id}_reference.json"
    )

    return _load_json(path)


def load_rubric(problem: dict) -> dict:
    """
    Load the evaluation rubric for a problem.
    """

    problem_id = _get_problem_id(problem)

    path = (
        RUBRICS_DIR
        / f"{problem_id}_rubric.json"
    )

    return _load_json(path)


def load_evaluation_context(problem: dict) -> tuple[dict, dict]:
    """
    Load both the reference solution and rubric
    for the given problem.

    Returns:

        (
            reference_solution,
            rubric
        )
    """

    reference_solution = load_reference_solution(
        problem
    )

    rubric = load_rubric(
        problem
    )

    return reference_solution, rubric