import os
from pathlib import Path
from dotenv import load_dotenv


# ==========================================================
# Load environment variables
# ==========================================================

EVALUATION_DIR = Path(__file__).resolve().parent.parent

ENV_FILE = EVALUATION_DIR / ".env"

load_dotenv(
    ENV_FILE
)

# ==========================================================
# OpenAI Configuration
# ==========================================================

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY"
)

OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-4.1-mini"
)


# ==========================================================
# Ollama Configuration
# ==========================================================

OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434"
)


# ==========================================================
# Ollama Models
# ==========================================================

# NLP extraction model
EXTRACTOR_MODEL = os.getenv(
    "EXTRACTOR_MODEL",
    "qwen3:4b"
)

# Candidate evaluation model
EVALUATOR_MODEL = os.getenv(
    "EVALUATOR_MODEL",
    "qwen3:1.7b"
)

# Interview follow-up generation model
FOLLOWUP_MODEL = os.getenv(
    "FOLLOWUP_MODEL",
    "qwen3:1.7b"
)


# ==========================================================
# Embedding Model
# ==========================================================

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "nomic-embed-text"
)