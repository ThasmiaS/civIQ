

import os
from typing import List

import requests
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "BAAI/bge-small-en-v1.5"
HF_API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{MODEL_NAME}"
HF_TOKEN = os.getenv("HF_TOKEN")  # Optional but recommended — avoids rate limits


def _embed_via_api(text: str) -> List[float]:
    headers = {}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"

    response = requests.post(
        HF_API_URL,
        headers=headers,
        json={"inputs": text},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def _embed_locally(text: str) -> List[float]:
    """Fallback: load fastembed in-process. ONNX-based, no GPU needed."""
    from fastembed import TextEmbedding

    # Module-level cache so the model loads once per process
    if not hasattr(_embed_locally, "_model"):
        cache_dir = os.path.join(os.path.dirname(__file__), ".cache")
        os.makedirs(cache_dir, exist_ok=True)
        _embed_locally._model = TextEmbedding(
            model_name=MODEL_NAME, cache_dir=cache_dir
        )

    result = list(_embed_locally._model.embed([text]))
    return result[0].tolist()


def get_query_embedding(text: str) -> List[float]:
    try:
        return _embed_via_api(text)
    except Exception as e:
        print(f"HF API unavailable ({e}), falling back to local fastembed.")
        return _embed_locally(text)