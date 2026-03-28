"""Verify all tables exist in the fms schema."""
import os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from sqlalchemy import create_engine, text, event
from dotenv import load_dotenv

load_dotenv()
url = f"postgresql+psycopg://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(url)
event.listen(engine, "connect", lambda c, r: c.cursor().execute("SET search_path TO fms, public") or None)

with engine.connect() as conn:
    tables = conn.execute(text(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='fms' ORDER BY table_name"
    )).fetchall()
    print(f"Total tables in fms schema: {len(tables)}")
    for t in tables:
        count = conn.execute(text(f"SELECT COUNT(*) FROM fms.{t[0]}")).scalar()
        print(f"  {t[0]}: {count} rows")

engine.dispose()
