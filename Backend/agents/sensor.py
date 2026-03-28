"""
Sensor (Data Collection) Agent
Executes the SQL query against PostgreSQL and retrieves raw data.
"""
from sqlalchemy import text
from database import engine
from agents.state import AgentState


def sensor(state: AgentState) -> AgentState:
    """Execute SQL query and fetch raw data."""
    if state.get("error"):
        return state

    sql = state.get("sql")
    if not sql:
        state["error"] = "No SQL query to execute."
        return state

    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            columns = list(result.keys())
            rows = result.fetchall()

            data = []
            for row in rows[:100]:  # Safety limit
                row_dict = {}
                for i, col in enumerate(columns):
                    val = row[i]
                    # Convert non-serializable types
                    if hasattr(val, 'isoformat'):
                        val = val.isoformat()
                    elif isinstance(val, (bytes, memoryview)):
                        val = str(val)
                    row_dict[col] = val
                data.append(row_dict)

            state["data"] = data

    except Exception as e:
        state["error"] = f"SQL execution error: {str(e)}"
        state["data"] = None

    return state
