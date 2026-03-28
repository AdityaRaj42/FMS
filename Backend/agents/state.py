"""
Shared state schema for the multi-agent LangGraph workflow.
"""
from typing import TypedDict, Optional, Any


class AgentState(TypedDict):
    """State that flows through the agent pipeline."""
    query: str                          # Original user query
    plan: Optional[str]                 # Orchestrator's plan
    sql: Optional[str]                  # Generated SQL query
    data: Optional[list[dict[str, Any]]]  # Raw data from DB
    analysis: Optional[str]             # Analysis results
    response: Optional[str]             # Final formatted response
    error: Optional[str]                # Error message if any
