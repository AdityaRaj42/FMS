"""
Enabler.in FMS Backend — FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import dashboard, workforce, agents, reports, agent_query

app = FastAPI(
    title="Enabler.in FMS API",
    description="Facility Management System Backend with AI Agent Support",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(workforce.router, prefix="/api/v1/workforce", tags=["Workforce"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["AI Agents"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(agent_query.router, prefix="/api/v1/agent", tags=["Agent Query"])


@app.get("/")
def root():
    return {"status": "ok", "service": "Enabler.in FMS API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
