"""Fix database permissions - create a schema owned by admin_user."""
import os
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DB_URL = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DB_URL, isolation_level="AUTOCOMMIT")

with engine.connect() as conn:
    # Create a schema owned by admin_user
    try:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS fms AUTHORIZATION admin_user"))
        print("[OK] Created schema 'fms' owned by admin_user")
    except Exception as e:
        print(f"[INFO] Schema create: {e}")

    # Set default search_path so queries find tables without schema prefix
    try:
        conn.execute(text("ALTER ROLE admin_user SET search_path TO fms, public"))
        print("[OK] Set search_path to fms, public")
    except Exception as e:
        print(f"[INFO] search_path: {e}")

    # Verify
    result = conn.execute(text("SELECT schema_name, schema_owner FROM information_schema.schemata WHERE schema_name = 'fms'"))
    row = result.fetchone()
    if row:
        print(f"[OK] Schema '{row[0]}' owned by '{row[1]}'")
    else:
        print("[WARN] Schema 'fms' not found")

engine.dispose()
print("\nDone! Now run ingest_data.py")
