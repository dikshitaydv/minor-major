import os
from dotenv import load_dotenv


# ==========================================================
# Load environment variables
# ==========================================================

load_dotenv()


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

LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "qwen3:4b"
)

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "nomic-embed-text"
)