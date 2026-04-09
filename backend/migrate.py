import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

import schema 

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment variables.")
    exit(1)


engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    print("Connecting to Neon and creating tables")
    SQLModel.metadata.create_all(engine)
    print("Migration complete")

if __name__ == "__main__":
    create_db_and_tables()