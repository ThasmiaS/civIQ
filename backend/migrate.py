from sqlmodel import SQLModel
from sqlalchemy import text
from sqlalchemy.exc import OperationalError, ProgrammingError

import schema
from db import engine


def create_db_and_tables() -> None:
    print("Connecting to database...")
    # Required for embedding VECTOR(...) columns (Neon ships pgvector; must enable per database).
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    print("Ensured pgvector extension (vector type).")
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Migration complete!")


if __name__ == "__main__":
    try:
        create_db_and_tables()
    except OperationalError as e:
        msg = str(e.orig) if hasattr(e, "orig") else str(e)
        print()
        if "password authentication failed" in msg.lower():
            print("━" * 60)
            print("DATABASE LOGIN FAILED (wrong password or stale connection string)")
            print("━" * 60)
            print(
                "1. Open Neon → your project → Connect → copy the URI (psql / Python).\n"
                "2. Or: Project settings → Roles → neondb_owner → Reset password,\n"
                "   then copy the NEW connection string.\n"
                "3. Set DATABASE_URL in backend/.env to that full URI (one line, no spaces).\n"
                "4. If your password has @ or other symbols, use the string Neon copies\n"
                "   (it URL-encodes the password).\n"
                "5. Retry: python migrate.py",
            )
            print("━" * 60)
        raise SystemExit(1) from e
    except ProgrammingError as e:
        msg = str(e.orig) if hasattr(e, "orig") else str(e)
        if "vector" in msg.lower() and "does not exist" in msg.lower():
            print()
            print("━" * 60)
            print("PGVECTOR NOT AVAILABLE")
            print("━" * 60)
            print(
                "Your Postgres user must be allowed to create extensions.\n"
                "In Neon SQL Editor, run once:\n\n"
                "  CREATE EXTENSION IF NOT EXISTS vector;\n\n"
                "Then run: python migrate.py",
            )
            print("━" * 60)
        raise SystemExit(1) from e
