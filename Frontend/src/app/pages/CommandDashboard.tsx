import { useState, useEffect } from "react";
import { Users, Activity, Building2, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { KPICard } from "../components/dashboard/KPICard";
import { WorkforceHeatmap } from "../components/dashboard/WorkforceHeatmap";
import { AgentStatusList } from "../components/dashboard/AgentStatusList";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const API = "/api/v1";

const iconMap: Record<string, any> = { Users, Activity, Building2, TrendingUp, Calendar, AlertTriangle };

export function CommandDashboard({ onAlertClick }: { onAlertClick?: (agent?: any) => void }) {
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/dashboard/kpis`)
      .then((r) => r.json())
      .then((data) => {
        if (data.kpis) {
          setKpis(
            data.kpis.map((k: any) => ({
              ...k,
              icon: iconMap[k.icon] || Users,
              status: k.status as "healthy" | "warning" | "critical" | "default",
            }))
          );
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "12px 16px",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Middle 2-column grid: Heatmap + Agent Status */}
      <div style={{ flex: 1, display: "flex", gap: 10, minHeight: 0 }}>
        <div className="glass-card" style={{ flex: 1.5, padding: "12px", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <WorkforceHeatmap />
        </div>
        <div className="glass-card" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <AgentStatusList onAlertClick={onAlertClick} />
        </div>
      </div>
    </div>
  );
}
