"""
Workforce Intelligence API endpoints.
Worker table, skill demand analysis, and assignment graph.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter()


@router.get("/workers")
def get_workers(db: Session = Depends(get_db)):
    """Returns workers with skills, availability, and status."""
    workers = db.execute(text("""
        SELECT
            w.worker_id,
            w.first_name || ' ' || w.last_name as name,
            COALESCE(weh.designation, w.worker_type) as role,
            UPPER(LEFT(w.first_name, 1) || LEFT(w.last_name, 1)) as avatar,
            w.primary_skill_tier,
            w.status,
            w.preferred_shift
        FROM workers w
        LEFT JOIN LATERAL (
            SELECT designation FROM worker_employment_history weh2
            WHERE weh2.worker_id = w.worker_id
            ORDER BY weh2.contract_start::date DESC NULLS LAST LIMIT 1
        ) weh ON true
        WHERE w.status != 'terminated'
        ORDER BY w.status, w.first_name
        LIMIT 50
    """)).fetchall()

    # Get availability percentages
    avail_data = db.execute(text("""
        SELECT worker_id,
            ROUND(COUNT(*) FILTER (WHERE availability_type = 'available')::numeric /
                  NULLIF(COUNT(*)::numeric, 0) * 100) as avail_pct
        FROM worker_availability_calendar
        GROUP BY worker_id
    """)).fetchall()
    avail_map = {str(r[0]): int(r[1]) if r[1] else 75 for r in avail_data}

    # Get skills
    skill_data = db.execute(text("""
        SELECT worker_id, skill_area FROM worker_skill_assessments
        WHERE score::numeric >= 60 ORDER BY score::numeric DESC
    """)).fetchall()
    worker_skills = {}
    for row in skill_data:
        wid = str(row[0])
        if wid not in worker_skills:
            worker_skills[wid] = []
        if row[1] not in worker_skills[wid]:
            worker_skills[wid].append(row[1])

    status_colors = {
        "active": "#00E676", "available": "#00A8FF",
        "on_leave": "#FFB300", "inactive": "#FF4C4C", "probation": "#FFB300",
    }

    result = []
    for w in workers:
        wid = str(w[0])
        status = w[5] or "active"
        avail = avail_map.get(wid, 75)
        color = status_colors.get(status, "#00E676")
        display_status = status.replace("_", "-")
        if avail < 50:
            display_status = "critical"
            color = "#FF4C4C"
        skills = worker_skills.get(wid, ["General"])[:3]
        result.append({
            "id": wid, "name": w[1], "role": w[2] or "Worker",
            "avatar": w[3], "skills": skills, "availability": avail,
            "status": display_status, "statusColor": color,
        })
    return {"workers": result}


@router.get("/skill-demand")
def get_skill_demand(db: Session = Depends(get_db)):
    """Skill vs demand bubble chart data."""
    data = db.execute(text("""
        WITH skill_supply AS (
            SELECT skill_area, COUNT(DISTINCT worker_id) as worker_count,
                   ROUND(AVG(score::numeric)) as avg_score
            FROM worker_skill_assessments GROUP BY skill_area
        ),
        skill_expanded AS (
            SELECT ss.skill_area, ss.worker_count, ss.avg_score,
                   (SELECT COUNT(*) FROM service_tickets st WHERE st.nlp_category ILIKE '%' || ss.skill_area || '%') * 5 + 
                   (SELECT COUNT(*) FROM work_order_tasks wot WHERE LOWER(wot.skill_required::text) = LOWER(ss.skill_area::text)) * 10 as text_demand_count
            FROM skill_supply ss
        )
        SELECT skill_area, COALESCE(avg_score, 50) as skill_level,
            text_demand_count,
            worker_count
        FROM skill_expanded
        ORDER BY worker_count DESC LIMIT 10
    """)).fetchall()

    colors = ["#00A8FF", "#FFB300", "#00E676", "#9B59B6", "#FF4C4C",
              "#00A8FF", "#7BC67E", "#FF8C00", "#00E676", "#FFB300"]
    result = []
    
    max_demand = max([row[2] for row in data] + [1])
    
    for i, row in enumerate(data):
        # Scale demand between 10% and 95% for better visual spread
        demand_pct = max(10, min(95, int((row[2] / max_demand) * 100))) if row[2] > 0 else 15 + (i * 3)
        
        result.append({
            "x": int(row[1]), "y": demand_pct, "z": int(row[3]) * 4 + 10, # increase bubble size weight
            "skill": row[0] or "Other", "color": colors[i % len(colors)],
        })
    return {"bubbleData": result}


@router.get("/assignment-graph")
def get_assignment_graph(db: Session = Depends(get_db)):
    """Worker-to-site assignment graph."""
    facilities = db.execute(text(
        "SELECT site_id, site_name FROM sites ORDER BY site_name LIMIT 5"
    )).fetchall()

    assignments = db.execute(text("""
        SELECT DISTINCT ON (sa.worker_id)
            sa.worker_id,
            w.first_name || ' ' || LEFT(w.last_name, 1) || '.' as worker_label,
            s.site_id, s.site_name,
            wsa.skill_area as connection_skill
        FROM shift_assignments sa
        JOIN shifts sh ON sa.shift_id = sh.shift_id
        JOIN sites s ON sh.site_id = s.site_id
        JOIN workers w ON sa.worker_id = w.worker_id
        LEFT JOIN worker_skill_assessments wsa ON w.worker_id = wsa.worker_id
        ORDER BY sa.worker_id, sh.shift_date::date DESC NULLS LAST
        LIMIT 8
    """)).fetchall()

    import math
    
    nodes = []
    edges = []
    
    # Store facility positions so we can cluster workers around them
    fac_positions = {}
    
    # Place facilities horizontally centered
    num_facs = len(facilities)
    spacing = 400 / max(num_facs, 1)
    start_x = 240 - ((num_facs - 1) * spacing / 2)
    
    for i, f in enumerate(facilities):
        sid = str(f[0])[:8]
        fx = start_x + (i * spacing)
        fy = 60 + (i % 2) * 20 # slight stagger
        fac_positions[sid] = (fx, fy)
        
        nodes.append({"id": sid, "x": fx, "y": fy,
                       "label": f[1][:12] if f[1] else f"Site {i+1}",
                       "color": "#00A8FF", "type": "facility"})
                       
    worker_colors = ["#00E676", "#FFB300", "#00A8FF", "#9B59B6", "#FF4C4C"]
    
    # Keep track of workers per site for radial scattering
    site_workers = {}
    
    for i, a in enumerate(assignments):
        wid = str(a[0])[:8]
        sid = str(a[2])[:8]
        
        # Track counts for radial positioning
        if sid not in site_workers:
            site_workers[sid] = 0
        idx = site_workers[sid]
        site_workers[sid] += 1
        
        fx, fy = fac_positions.get(sid, (200, 100))
        
        # Radial math: spread them in a semi-circle below the facility
        radius = 50 + (idx // 3) * 20
        angle = math.pi/4 + (math.pi/2 * (idx % 3) / max(2, 1))
        
        # Add a little jitter to prevent strict rigid lines
        jitter_x = (i % 5) * 4 - 8
        jitter_y = ((i * 3) % 5) * 4 - 8
        
        wx = fx + radius * math.cos(angle) + jitter_x
        wy = fy + radius * math.sin(angle) + jitter_y + 30
        
        nodes.append({"id": wid, "x": wx, "y": wy,
                       "label": a[1] or f"Worker {i+1}",
                       "color": worker_colors[i % len(worker_colors)], "type": "worker"})
        edges.append({"from": wid, "to": sid,
                       "color": worker_colors[i % len(worker_colors)],
                       "label": a[4] or "Assigned"})
                       
    return {"nodes": nodes, "edges": edges}
