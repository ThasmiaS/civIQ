

import os
from typing import List

import requests
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "BAAI/bge-small-en-v1.5"
HF_API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{MODEL_NAME}"
HF_TOKEN = os.getenv("HF_TOKEN")  # Optional but recommended — avoids rate limits


def _mean_pool_token_embeddings(raw: list) -> List[float]:
    """
    Hugging Face feature-extraction API may return token-level embeddings
    (list[list[float]]). Convert to one fixed-size vector via mean pooling.
    """
    if not raw:
        raise ValueError("Empty embedding payload from API")

    if isinstance(raw[0], list):
        # raw shape: [tokens, dim]
        dim = len(raw[0])
        if dim == 0:
            raise ValueError("API embedding has zero dimensions")
        accum = [0.0] * dim
        token_count = 0
        for token_vec in raw:
            if not isinstance(token_vec, list) or len(token_vec) != dim:
                continue
            for i, value in enumerate(token_vec):
                accum[i] += float(value)
            token_count += 1
        if token_count == 0:
            raise ValueError("No valid token vectors in API payload")
        return [value / token_count for value in accum]

    # raw already appears to be a single vector
    return [float(v) for v in raw]


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
    payload = response.json()
    return _mean_pool_token_embeddings(payload)


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
        embedding = _embed_via_api(text)
        print(
            f"Embedding source=HF_API model={MODEL_NAME} dim={len(embedding)} sample={embedding[:5]}"
        )
        return embedding
    except Exception as e:
        print(f"HF API unavailable ({e}), falling back to local fastembed.")
        embedding = _embed_locally(text)
        print(
            f"Embedding source=FASTEMBED model={MODEL_NAME} dim={len(embedding)} sample={embedding[:5]}"
        )
        return embedding