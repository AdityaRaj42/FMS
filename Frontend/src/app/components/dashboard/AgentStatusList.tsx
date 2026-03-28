import { useState, useEffect } from "react";
import { Bot, Shield, Zap, Brain, Eye, Activity, AlertTriangle } from "lucide-react";
import { LoadingSkeleton } from "../ui/LoadingSkeleton";

const API = "http://localhost:8000/api/v1";

type AgentStatus = "IDLE" | "MONITORING" | "ACTIVE" | "ALERT";

interface Agent {
  name: string;
  trigger: string;
  status: AgentStatus;
  icon: typeof Bot;
  lastSeen: string;
  confidence?: number;
}

const iconMap: Record<string, typeof Bot> = { Bot, Shield, Zap, Brain, Eye, Activity, AlertTriangle };

const statusConfig = {
  IDLE: { chipClass: "status-idle", dot: "rgba(255,255,255,0.3)", pulse: false },
  MONITORING: { chipClass: "status-monitoring", dot: "#FFB300", pulse: false },
  ACTIVE: { chipClass: "status-active", dot: "#00A8FF", pulse: true },
  ALERT: { chipClass: "status-alert", dot: "#FF4C4C", pulse: true },
};

export function AgentStatusList({ onAlertClick }: { onAlertClick?: (agent?: any) => void }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/dashboard/agents`)
      .then((r) => r.json())
      .then((data) => {
        if (data.agents && data.agents.length > 0) {
          setAgents(
            data.agents.map((a: any) => ({
              ...a,
              icon: iconMap[a.icon] || Bot,
              status: (a.status || "IDLE") as AgentStatus,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          AI Agent Status
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div className="blink" style={{ width: 5, height: 5, borderRadius: "50%", background: "#00E676" }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{agents.length} online</span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton variant="agents" />
      ) : agents.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          No agent data available
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {agents.map((agent) => {
            const cfg = statusConfig[agent.status] || statusConfig.IDLE;
            const Icon = agent.icon;
            const isAlert = agent.status === "ALERT";

            return (
              <div
                key={agent.name}
                onClick={isAlert ? () => onAlertClick?.(agent) : undefined}
                style={{
                  background: isAlert ? "rgba(255,76,76,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isAlert ? "rgba(255,76,76,0.25)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 6, padding: "9px 10px",
                  cursor: isAlert ? "pointer" : "default", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { if (!isAlert) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isAlert ? "rgba(255,76,76,0.06)" : "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 5, background: isAlert ? "rgba(255,76,76,0.15)" : "rgba(0,168,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={12} color={isAlert ? "#FF4C4C" : "#00A8FF"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{agent.name}</span>
                      <span className={`status-chip ${cfg.chipClass}`}>
                        {(agent.status === "ACTIVE" || agent.status === "ALERT") && (
                          <span className={agent.status === "ALERT" ? "blink" : ""}
                            style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                        )}
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {agent.trigger}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {agent.confidence && (
                      <div className="tabular" style={{ fontSize: 12, fontWeight: 700, color: isAlert ? "#FF4C4C" : "#00A8FF" }}>
                        {agent.confidence}%
                      </div>
                    )}
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{agent.lastSeen}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
