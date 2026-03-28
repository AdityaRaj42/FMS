"""
NL2SQL Agent
Translates natural language questions into secure, read-only PostgreSQL queries.
"""
import os
import re
from langchain_groq import ChatGroq
from agents.state import AgentState

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
)

SYSTEM_PROMPT = """You are an expert PostgreSQL query generator for a Facility Management System.
Given a natural language question and an execution plan, generate a SINGLE read-only SQL SELECT query.

RULES:
1. ONLY generate SELECT statements. Never use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE.
2. Use proper JOINs between related tables.
3. Use PostgreSQL syntax (e.g., CURRENT_DATE, INTERVAL, EXTRACT, TO_CHAR).
4. Limit results to 100 rows maximum with LIMIT 100.
5. Use meaningful column aliases.
6. Handle NULLs with COALESCE where appropriate.

DATABASE SCHEMA:
- workers (worker_id UUID, employee_code, tenant_id, worker_type, first_name, last_name, date_of_birth, gender, joining_date, exit_date, exit_reason, home_lat, home_lng, primary_skill_tier INT, state_of_domicile, preferred_shift, status, created_at, updated_at)
- worker_certifications (cert_id, worker_id, certification_type, issuing_body, certificate_number, issued_date, expiry_date, verification_status, created_at)
- worker_skill_assessments (assessment_id, worker_id, assessed_by, skill_area, score INT, assessment_date, site_context, notes, created_at)
- worker_availability_calendar (availability_id, worker_id, date, availability_type, leave_type, approved_by, created_at)
- worker_employment_history (history_id, worker_id, contractor_id, contract_start, contract_end, designation, billing_rate_per_hour, payroll_rate_per_hour, state_of_deployment, created_at)
- clients (client_id, client_name, industry_sector, tier, billing_cycle, nps_score, onboarding_date, churn_date, created_at)
- sites (site_id, client_id, site_name, site_code, city, state, pincode, lat, lng, site_type, total_area_sqft, floors, high_security BOOL, operating_hours_start, operating_hours_end, created_at)
- site_zones (zone_id, site_id, zone_name, zone_type, area_sqft, cleaning_frequency_per_day, risk_level, created_at)
- contracts (contract_id, client_id, site_id, contract_type, start_date, end_date, value_inr, min_headcount, penalty_per_breach_inr, sla_response_hours, sla_resolution_hours, status, created_at)
- contract_sla_definitions (sla_id, contract_id, sla_metric, target_value, measurement_window, breach_threshold, penalty_applies BOOL, created_at)
- shifts (shift_id, site_id, shift_date DATE, shift_type, shift_start, shift_end, required_headcount INT, required_supervisors, required_skill_tiers INT, status, created_at)
- shift_assignments (assignment_id, shift_id, worker_id, assignment_type, actual_checkin TIMESTAMP, actual_checkout TIMESTAMP, no_show BOOL, no_show_reason, created_at)
- attendance_events (event_id, worker_id, site_id, shift_id, event_type, event_timestamp, capture_method, is_anomalous BOOL, anomaly_type, created_at)
- overtime_records (overtime_id, worker_id, site_id, shift_id, date, regular_hours, overtime_hours, overtime_reason, approved_by, payable_rate_multiplier, created_at)
- work_orders (work_order_id, site_id, contract_id, work_order_type, priority, status, scheduled_start, scheduled_end, actual_start, actual_end, area_sqft_covered, headcount_deployed, completion_percentage, quality_score, source, created_at)
- work_order_tasks (task_id, work_order_id, zone_id, task_type, skill_required, estimated_minutes, actual_minutes, assigned_worker_id, completion_status, checklist_items, quality_flags, created_at)
- iot_sensors (sensor_id, site_id, zone_id, sensor_type, manufacturer, model_number, is_active BOOL, created_at)
- iot_sensor_readings (reading_id, sensor_id, site_id, zone_id, reading_timestamp, metric_name, metric_value FLOAT, unit, is_anomalous BOOL, created_at)
- zone_occupancy_aggregates (agg_id, zone_id, site_id, aggregation_period, period_start, period_end, avg_occupancy, peak_occupancy, total_footfall, cleaning_trigger_score, actual_cleaning_done BOOL, created_at)
- inventory_items (item_id, site_id, item_code, item_name, category, unit_of_measure, reorder_point, current_stock, supplier_id, unit_cost_inr, is_hazardous BOOL, created_at)
- inventory_transactions (txn_id, item_id, site_id, work_order_id, transaction_type, quantity, unit_cost_inr, transaction_timestamp, created_at)
- equipment_assets (asset_id, site_id, asset_type, make, model, serial_number, purchase_date, purchase_cost_inr, warranty_expiry, cumulative_hours, status, assigned_worker_id, created_at)
- equipment_maintenance_log (log_id, asset_id, maintenance_type, description, parts_replaced, downtime_start, downtime_end, cost_inr, resolution_notes, created_at)
- demand_forecast_inputs (input_id, site_id, forecast_date, input_type, description, expected_impact_factor, source, created_at)
- workforce_demand_forecasts (forecast_id, site_id, forecast_generated_at, forecast_horizon, target_date, forecasted_headcount, confidence_interval_low, confidence_interval_high, model_version, actual_headcount, forecast_error, created_at)
- labor_regulations (regulation_id, state_code, regulation_type, worker_category, effective_from, effective_to, value, unit, source_act, created_at)
- compliance_violations (violation_id, violation_type, worker_id, site_id, shift_id, detected_by, detected_at, severity, resolution_status, resolution_notes, resolved_at, created_at)
- service_tickets (ticket_id, site_id, contract_id, raised_by, channel, raw_description, nlp_category, nlp_urgency_score, nlp_sentiment_score, sla_response_deadline, sla_resolution_deadline, first_response_at, resolved_at, csat_score, status, created_at)
- periodic_client_feedback (feedback_id, contract_id, site_id, feedback_period, overall_score, cleanliness_score, staff_professionalism, responsiveness_score, compliance_score, verbatim_feedback, created_at)
- agent_decisions (decision_id, agent_type, trigger_event, input_context, decision_type, decision_output, confidence_score, model_version, execution_time_ms, outcome_status, feedback_label, created_at)

Respond with ONLY the SQL query, no explanation, no markdown formatting, no backticks."""


def validate_sql(sql: str) -> bool:
    """Validate that the SQL is read-only."""
    dangerous = re.compile(
        r'\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXEC)\b',
        re.IGNORECASE
    )
    return not dangerous.search(sql)


def nl2sql(state: AgentState) -> AgentState:
    """Generate SQL from natural language query."""
    response = llm.invoke([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Plan: {state.get('plan', '')}\n\nQuestion: {state['query']}"},
    ])

    sql = response.content.strip()
    # Clean up any markdown formatting
    sql = sql.replace("```sql", "").replace("```", "").strip()

    if not validate_sql(sql):
        state["error"] = "Generated SQL contains unsafe operations. Query rejected."
        state["sql"] = None
    else:
        state["sql"] = sql

    return state
