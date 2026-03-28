"""
Workflow Controller
Stitches the 5 agents into a LangGraph StateGraph pipeline.
"""
from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.orchestrator import orchestrator
from agents.nl2sql import nl2sql
from agents.sensor import sensor
from agents.analyzer import analyzer
from agents.responder import responder


def should_continue_after_nl2sql(state: AgentState) -> str:
    """Route based on whether SQL generation succeeded."""
    if state.get("error"):
        return "responder"  # Skip to responder for error formatting
    return "sensor"


def should_continue_after_sensor(state: AgentState) -> str:
    """Route based on whether data retrieval succeeded."""
    if state.get("error"):
        return "responder"
    return "analyzer"


def build_workflow():
    """Build and compile the multi-agent workflow graph."""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("orchestrator", orchestrator)
    workflow.add_node("nl2sql", nl2sql)
    workflow.add_node("sensor", sensor)
    workflow.add_node("analyzer", analyzer)
    workflow.add_node("responder", responder)

    # Define edges
    workflow.set_entry_point("orchestrator")
    workflow.add_edge("orchestrator", "nl2sql")

    # Conditional routing after NL2SQL
    workflow.add_conditional_edges(
        "nl2sql",
        should_continue_after_nl2sql,
        {"sensor": "sensor", "responder": "responder"},
    )

    # Conditional routing after Sensor
    workflow.add_conditional_edges(
        "sensor",
        should_continue_after_sensor,
        {"analyzer": "analyzer", "responder": "responder"},
    )

    workflow.add_edge("analyzer", "responder")
    workflow.add_edge("responder", END)

    return workflow.compile()


# Compiled graph — ready to invoke
agent_graph = build_workflow()
