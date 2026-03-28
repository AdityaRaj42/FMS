"""
Data Ingestion Script
Reads all XLSX files from ../data/ and pushes them to PostgreSQL (enabler_db.fms schema).
Creates/replaces 27 tables from 10 Excel files.
"""
import os
import sys

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import pandas as pd
from sqlalchemy import create_engine, text, event
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

ADMIN_URL = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres"
DB_URL = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

SCHEMA = "fms"


def create_database():
    """Create enabler_db if it doesn't exist."""
    engine = create_engine(ADMIN_URL, isolation_level="AUTOCOMMIT")
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": DB_NAME},
        )
        if not result.fetchone():
            conn.execute(text(f'CREATE DATABASE "{DB_NAME}"'))
            print(f"[OK] Created database '{DB_NAME}'")
        else:
            print(f"[OK] Database '{DB_NAME}' already exists")
    engine.dispose()


def set_search_path(dbapi_conn, connection_record):
    """Set search_path on every new connection."""
    cursor = dbapi_conn.cursor()
    cursor.execute(f"SET search_path TO {SCHEMA}, public")
    cursor.close()


def ingest_all():
    """Read all XLSX files and push each sheet as a table."""
    engine = create_engine(DB_URL)

    # Set search_path for all connections
    event.listen(engine, "connect", set_search_path)

    xlsx_files = sorted(
        [f for f in os.listdir(DATA_DIR) if f.endswith(".xlsx")]
    )

    if not xlsx_files:
        print("[ERROR] No XLSX files found in data directory!")
        sys.exit(1)

    total_tables = 0
    total_rows = 0

    for xlsx_file in xlsx_files:
        filepath = os.path.join(DATA_DIR, xlsx_file)
        print(f"\n[FILE] Processing: {xlsx_file}")

        xls = pd.ExcelFile(filepath, engine="openpyxl")

        for sheet_name in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet_name)

            # Clean column names: lowercase, strip whitespace
            df.columns = [
                col.strip().lower().replace(" ", "_") for col in df.columns
            ]

            table_name = sheet_name.strip().lower().replace(" ", "_")

            # Convert date columns
            for col in df.columns:
                if df[col].dtype == "object":
                    try:
                        parsed = pd.to_datetime(df[col], format="mixed", dayfirst=False)
                        if parsed.notna().sum() > len(df) * 0.5:
                            df[col] = parsed
                    except (ValueError, TypeError):
                        pass

            # Push to PostgreSQL in the fms schema
            df.to_sql(
                table_name,
                engine,
                schema=SCHEMA,
                if_exists="replace",
                index=False,
                method="multi",
                chunksize=500,
            )

            row_count = len(df)
            total_tables += 1
            total_rows += row_count
            print(f"  [OK] {SCHEMA}.{table_name}: {row_count} rows, {len(df.columns)} columns")

    engine.dispose()

    print(f"\n{'='*50}")
    print(f"Ingestion Complete!")
    print(f"   Tables created: {total_tables}")
    print(f"   Total rows inserted: {total_rows:,}")
    print(f"   Schema: {SCHEMA}")
    print(f"{'='*50}")


if __name__ == "__main__":
    print("Starting data ingestion...")
    print(f"   Database: {DB_HOST}:{DB_PORT}/{DB_NAME}")
    print(f"   Schema: {SCHEMA}")
    print(f"   Data dir: {os.path.abspath(DATA_DIR)}")

    create_database()
    ingest_all()
