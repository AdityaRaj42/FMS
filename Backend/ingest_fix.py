"""Ingest only the AI Agent Operations Log file (the one that failed)."""
import os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import pandas as pd
from sqlalchemy import create_engine, text, event
from dotenv import load_dotenv

load_dotenv()

DB_URL = f"postgresql+psycopg://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
SCHEMA = "fms"

engine = create_engine(DB_URL, pool_timeout=60)
event.listen(engine, "connect", lambda dbapi_conn, rec: dbapi_conn.cursor().execute("SET search_path TO fms, public") or dbapi_conn.cursor().close())

filepath = os.path.join(DATA_DIR, "10_AI_Agent_Operations_Log.xlsx")
print(f"Processing: {filepath}")

xls = pd.ExcelFile(filepath, engine="openpyxl")
for sheet_name in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet_name)
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    table_name = sheet_name.strip().lower().replace(" ", "_")

    # Truncate very long text fields to avoid timeouts
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].astype(str).str[:2000]
            # Replace 'None' and 'nan' strings
            df[col] = df[col].replace({'None': None, 'nan': None})

    # Use smaller chunks
    df.to_sql(
        table_name,
        engine,
        schema=SCHEMA,
        if_exists="replace",
        index=False,
        method="multi",
        chunksize=100,
    )
    print(f"  [OK] {SCHEMA}.{table_name}: {len(df)} rows, {len(df.columns)} columns")

engine.dispose()
print("Done!")
