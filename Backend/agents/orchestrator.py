"""
Orchestrator Agent
Receives the user query, analyzes intent, and creates an execution plan.
"""
import os
from langchain_groq import ChatGroq
from agents.state import AgentState

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
)

SYSTEM_PROMPT = """You are the Orchestrator agent for a Facility Management System (Enabler.in).
Your job is to analyze the user's query and create a brief execution plan.

The database has these tables:
- workers (worker_id, employee_code, first_name, last_name, worker_type, status, primary_skill_tier, preferred_shift, joining_date, etc.)
- worker_certifications (cert_id, worker_id, certification_type, expiry_date, etc.)
- worker_skill_assessments (assessment_id, worker_id, skill_area, score, etc.)
- worker_availability_calendar (worker_id, date, availability_type, leave_type, etc.)
- worker_employment_history (worker_id, contractor_id, designation, billing_rate_per_hour, etc.)
- clients (client_id, client_name, industry_sector, tier, nps_score, etc.)
- sites (site_id, client_id, site_name, city, state, total_area_sqft, floors, etc.)
- site_zones (zone_id, site_id, zone_name, zone_type, cleaning_frequency_per_day, risk_level, etc.)
- contracts (contract_id, client_id, site_id, contract_type, value_inr, status, sla_response_hours, etc.)
- contract_sla_definitions (sla_id, contract_id, sla_metric, target_value, etc.)
- shifts (shift_id, site_id, shift_date, shift_type, required_headcount, status, etc.)
- shift_assignments (assignment_id, shift_id, worker_id, actual_checkin, actual_checkout, no_show, etc.)
- attendance_events (event_id, worker_id, site_id, event_type, event_timestamp, is_anomalous, etc.)
- overtime_records (overtime_id, worker_id, site_id, overtime_hours, overtime_reason, etc.)
- work_orders (work_order_id, site_id, work_order_type, priority, status, quality_score, etc.)
- work_order_tasks (task_id, work_order_id, zone_id, task_type, skill_required, completion_status, etc.)
- iot_sensors (sensor_id, site_id, zone_id, sensor_type, is_active, etc.)
- iot_sensor_readings (reading_id, sensor_id, metric_name, metric_value, unit, is_anomalous, etc.)
- zone_occupancy_aggregates (zone_id, site_id, avg_occupancy, peak_occupancy, total_footfall, etc.)
- inventory_items (item_id, site_id, item_name, category, current_stock, reorder_point, etc.)
- inventory_transactions (txn_id, item_id, transaction_type, quantity, etc.)
- equipment_assets (asset_id, site_id, asset_type, status, cumulative_hours, etc.)
- equipment_maintenance_log (log_id, asset_id, maintenance_type, cost_inr, etc.)
- demand_forecast_inputs (input_id, site_id, forecast_date, input_type, etc.)
- workforce_demand_forecasts (forecast_id, site_id, target_date, forecasted_headcount, actual_headcount, forecast_error, etc.)
- labor_regulations (regulation_id, state_code, regulation_type, value, etc.)
- compliance_violations (violation_id, violation_type, worker_id, site_id, severity, resolution_status, etc.)
- service_tickets (ticket_id, site_id, nlp_category, nlp_urgency_score, status, csat_score, etc.)
- periodic_client_feedback (feedback_id, site_id, overall_score, cleanliness_score, etc.)
- agent_decisions (decision_id, agent_type, trigger_event, decision_type, confidence_score, etc.)

Respond with a brief plan of which tables to query and what analysis is needed.
Keep it to 2-3 sentences maximum. Be specific about table names."""


def orchestrator(state: AgentState) -> AgentState:
    """Analyze the query and create an execution plan."""
    response = llm.invoke([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": state["query"]},
    ])
    state["plan"] = response.content
    return state
