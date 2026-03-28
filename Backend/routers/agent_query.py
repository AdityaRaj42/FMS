"""
Agent Query API endpoint.
Exposes the multi-agent LangGraph workflow via POST /api/v1/agent/query.
"""
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    response: str
    sql: Optional[str] = None
    data: Optional[list] = None
    error: Optional[str] = None


@router.post("/query", response_model=QueryResponse)
async def agent_query(request: QueryRequest):
    """
    Process a natural language query through the multi-agent pipeline.

    Flow: Orchestrator → NL2SQL → Sensor → Analyzer → Responder
    """
    from agents.workflow import agent_graph

    initial_state = {
        "query": request.query,
        "plan": None,
        "sql": None,
        "data": None,
        "analysis": None,
        "response": None,
        "error": None,
    }

    try:
        result = agent_graph.invoke(initial_state)

        return QueryResponse(
            response=result.get("response", "Unable to process your query."),
            sql=result.get("sql"),
            data=result.get("data", [])[:20],  # Limit data in response
            error=result.get("error"),
        )
    except Exception as e:
        return QueryResponse(
            response=f"An error occurred while processing your query: {str(e)}",
            error=str(e),
        )
