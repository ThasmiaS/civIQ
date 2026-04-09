import os
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from dotenv import load_dotenv
from sqlmodel import create_engine

load_dotenv(Path(__file__).resolve().parent / ".env")

_RAW_URL = os.getenv("DATABASE_URL")
if not _RAW_URL:
    raise RuntimeError("DATABASE_URL not found in environment variables.")


def _normalize_database_url(url: str) -> str:
    """Trim junk from .env and drop channel_binding — Neon adds it for libpq; psycopg2 can misbehave."""
    url = url.strip().strip('"').strip("'")
    parsed = urlparse(url)
    q = parse_qs(parsed.query, keep_blank_values=False)
    q.pop("channel_binding", None)
    new_query = urlencode(q, doseq=True)
    return urlunparse(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            new_query,
            parsed.fragment,
        ),
    )


DATABASE_URL = _normalize_database_url(_RAW_URL)

engine = create_engine(DATABASE_URL, echo=False)
