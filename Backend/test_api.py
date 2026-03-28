"""Test all API endpoints."""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import urllib.request
import json

BASE = "http://localhost:8000"
endpoints = [
    "/api/v1/dashboard/kpis",
    "/api/v1/dashboard/facilities",
    "/api/v1/dashboard/heatmap",
    "/api/v1/dashboard/agents",
    "/api/v1/workforce/workers",
    "/api/v1/workforce/skill-demand",
    "/api/v1/agents/overview",
    "/api/v1/agents/list",
    "/api/v1/reports/weekly",
    "/api/v1/reports/monthly-trend",
    "/api/v1/reports/kpis",
]

for ep in endpoints:
    try:
        req = urllib.request.Request(BASE + ep)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
            # Show first key and a preview
            keys = list(data.keys())
            preview = str(data)[:150]
            print(f"[OK]  {ep}")
            print(f"      Keys: {keys} | Preview: {preview}...")
    except Exception as e:
        print(f"[ERR] {ep}")
        err_str = str(e)
        # Try to read error body
        if hasattr(e, 'read'):
            try:
                err_str = e.read().decode()[:200]
            except:
                pass
        print(f"      Error: {err_str[:200]}")
    print()
