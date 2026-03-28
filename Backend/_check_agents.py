from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Get actual agent types
    r = conn.execute(text("SELECT DISTINCT agent_type, COUNT(*) FROM fms.agent_decisions GROUP BY agent_type ORDER BY COUNT(*) DESC"))
    print("Agent types in DB:")
    for row in r:
        print(f"  {row[0]}: {row[1]} decisions")
