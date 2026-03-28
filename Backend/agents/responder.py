"""
Responder (Report Generator) Agent
Formats analyzed data into a clean, professional markdown response.
"""
import os
from langchain_groq import ChatGroq
from agents.state import AgentState

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2,
)

SYSTEM_PROMPT = """You are the response formatter for a Facility Management System (Enabler.in).
Take the analysis and format it into a clean, professional response for the dashboard user.

FORMAT RULES:
1. Start with a brief 1-sentence summary answering the user's question directly
2. Use bullet points for key findings (max 5 bullets)
3. Include specific numbers and percentages from the analysis
4. If there are actionable recommendations, list them clearly
5. Keep the total response under 150 words
6. Use clear, business-friendly language (no technical SQL jargon)

Do NOT include SQL queries, table names, or technical details in the response.
Write as if you're a facility management expert briefing an operations manager."""


def responder(state: AgentState) -> AgentState:
    """Format the analysis into a clean response."""
    if state.get("error"):
        # Format error as a user-friendly message
        state["response"] = f"I wasn't able to complete that analysis. {state['error']}. Please try rephrasing your question."
        return state

    analysis = state.get("analysis", "")
    if not analysis:
        state["response"] = "I couldn't find relevant data for your question. Please try a more specific query."
        return state

    response = llm.invoke([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": (
            f"User's original question: {state['query']}\n\n"
            f"Analysis:\n{analysis}"
        )},
    ])

    state["response"] = response.content
    return state
