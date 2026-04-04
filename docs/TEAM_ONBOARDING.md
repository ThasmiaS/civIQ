# Civic Spiegel: Full Team Onboarding & Sprint Logs

*Briefing on the technical decisions, architecture, and current progress of the MVP*

## 1. Core Decisions & Stack
- Budget: $0

- **Frontend:** Next.js + TypeScript + Tailwind. The app uses **Zero-Auth**; demographic user queries stay completely localized in the browser's `localStorage`, guaranteeing absolute privacy and frictionless flow.
- **Backend API:** FastAPI running in Python, bridging the Data pipeline to the Frontend via REST.
- **Database System:** We will ultimately use **Neon Serverless Postgres** integrated with the `pgvector` extension. This allows us to query traditional relational data (e.g. Council Member profiles) and run vector similarity searches (RAG mappings) out of the same database using `SQLModel`. (See `docs/DATABASE_ARCHITECTURE.md`).
- **Data Model & Schema:** The schema is defined in `backend/schema.py` and uses SQLModel.
- **Data & Pipeline:** Python scripts abstract scraping away from database logic.
- **Embeddings & LLM Engine:** **FastEmbed** generates our Semantic RAG context on the CPU for free. The **Groq API** uses `llama-3.1-8b` to summarize that context instantly to the user. Instead of downloading ML+DL packages (like PyTorch and `sentence-transformers`), we bypass API rate-limits locally using FastEmbed. It runs `BAAI/bge-small-en-v1.5` on pure ONNX/CPU context, rendering vectors practically instantly.

## 2. Current Development Environment

*You do not need to wait for the Neon Postgres database to start writing ML or scraping logic.*

We have created an **offline mock-database pipeline** in `pipeline/`.
*   All scrapers inherit from `pipeline/base_scraper.py`. 
*   Once a scraper extracts data and chunks it via the `embedding_engine.py`, the `run()` function automatically dumps the perfectly formatted output directly into `pipeline/output/mock_db.json`. 
*   This means the Frontend and Backend can immediately build APIs and Chat UIs by reading from this JSON file, entirely bypassing Neon Postgres while it's being set up. Once someone brings the Neon DB online, we just swap the `save_to_json` function with `save_to_postgres`.


