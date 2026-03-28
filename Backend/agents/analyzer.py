"""
Analyzer Agent
Takes raw data from the Sensor and performs analysis, trend detection, anomaly identification.
"""
import os
import json
from langchain_groq import ChatGroq
from agents.state import AgentState

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1,
)

SYSTEM_PROMPT = """You are a data analyst for a Facility Management System (Enabler.in).
You receive raw data from database queries. Your job is to:
1. Identify key patterns and trends in the data
2. Detect anomalies or concerning values
3. Calculate relevant statistics (averages, percentages, correlations)
4. Draw actionable conclusions

Be concise but thorough. Focus on insights that matter for facility operations:
- Worker utilization and staffing gaps
- SLA compliance and service quality
- Equipment and maintenance issues
- Cost optimization opportunities
- Client satisfaction trends

Respond with a structured analysis (use bullet points). Keep it under 200 words."""


def analyzer(state: AgentState) -> AgentState:
    """Analyze the raw data."""
    if state.get("error"):
        return state

    data = state.get("data")
    if not data:
        state["error"] = "No data to analyze."
        return state

    # Truncate data for LLM context
    data_str = json.dumps(data[:50], indent=2, default=str)
    total_rows = len(data)

    response = llm.invoke([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": (
            f"Original question: {state['query']}\n\n"
            f"SQL executed: {state.get('sql', 'N/A')}\n\n"
            f"Data ({total_rows} rows total, showing first 50):\n{data_str}"
        )},
    ])

    state["analysis"] = response.content
    return state
