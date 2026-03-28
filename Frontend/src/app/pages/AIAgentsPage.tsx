import { useState, useEffect } from "react";
import { Bot, Zap, Shield, Brain, Eye, Activity, AlertTriangle, Play, Pause, Settings } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const API = "/api/v1";
const iconMap: Record<string, any> = { Bot, Zap, Shield, Brain, Eye, Activity, AlertTriangle };

const statusConfig = {
  IDLE: { chipClass: "status-idle", label: "IDLE" },
  MONITORING: { chipClass: "status-monitoring", label: "MONITORING" },
  ACTIVE: { chipClass: "status-active", label: "ACTIVE" },
  ALERT: { chipClass: "status-alert", label: "ALERT" },
};

const CustomTip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,168,255,0.15)", borderRadius: 4, padding: "4px 8px" }}>
        <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{payload[0].value} triggers</span>
      </div>
    );
  }
  return null;
};

export function AIAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/agents/overview`).then(r => r.json()).then(d => { if (d.stats?.length) setStats(d.stats); }),
      fetch(`${API}/agents/list`).then(r => r.json()).then(d => {
        if (d.agents?.length) setAgents(d.agents.map((a: any) => ({ ...a, icon: iconMap[a.icon] || Bot })));
      }),
    ])
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, padding: "12px 16px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
        <LoadingSkeleton variant="cards" />
        <LoadingSkeleton variant="grid" />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "12px 16px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header stats */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ flex: 1, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{stat.label}</div>
            <div className="tabular" style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Agent cards grid */}
      {agents.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
          No agent data available
        </div>
      ) : (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, overflow: "auto" }}>
          {agents.map((agent) => {
            const Icon = agent.icon;
            const cfg = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.IDLE;
            const chartData = (agent.history || []).map((v: number) => ({ v }));

            return (
              <div
                key={agent.name}
                className="glass-card"
                style={{
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  borderColor: agent.status === "ALERT" ? "rgba(255,76,76,0.3)" : undefined,
                  background: agent.status === "ALERT" ? "rgba(255,76,76,0.04)" : undefined,
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: `${agent.color}15`,
                        border: `1px solid ${agent.color}30`,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={16} color={agent.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{agent.type}</div>
                    </div>
                  </div>
                  <span className={`status-chip ${cfg.chipClass}`}>
                    {(agent.status === "ACTIVE" || agent.status === "ALERT") && (
                      <span
                        className={agent.status === "ALERT" ? "blink" : ""}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: agent.color, display: "inline-block" }}
                      />
                    )}
                    {cfg.label}
                  </span>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Uptime", value: agent.uptime, color: "#00E676" },
                    { label: "Triggers", value: agent.triggers, color: agent.color },
                    { label: "Accuracy", value: `${agent.accuracy}%`, color: "#00A8FF" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center", padding: "6px 4px", background: "rgba(255,255,255,0.02)", borderRadius: 5 }}>
                      <div className="tabular" style={{ fontSize: 15, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini chart */}
                {chartData.length > 0 && (
                  <div style={{ height: 48 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id={`ag-${agent.name}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={agent.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={agent.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTip />} />
                        <Area type="monotone" dataKey="v" stroke={agent.color} strokeWidth={1.5} fill={`url(#ag-${agent.name})`} dot={false} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Controls */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: "rgba(0,168,255,0.08)",
                      border: "1px solid rgba(0,168,255,0.15)",
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      cursor: "pointer",
                      color: "#00A8FF",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    <Play size={10} /> Run
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    <Pause size={10} /> Pause
                  </button>
                  <button
                    style={{
                      width: 28,
                      padding: "6px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <Settings size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
