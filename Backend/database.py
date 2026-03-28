"""
Database connection module.
Provides SQLAlchemy engine, session factory, and FastAPI dependency.
Uses 'fms' schema in enabler_db.
"""
import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, pool_pre_ping=True)


def _set_search_path(dbapi_conn, connection_record):
    """Set search_path to fms schema on every new connection."""
    cursor = dbapi_conn.cursor()
    cursor.execute("SET search_path TO fms, public")
    cursor.close()


event.listen(engine, "connect", _set_search_path)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
