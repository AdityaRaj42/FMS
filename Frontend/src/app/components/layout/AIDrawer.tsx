import { X, AlertTriangle, ChevronRight, Users, Mail, Calendar, CheckCircle, Zap } from "lucide-react";

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: any;
}

const steps = [
  { label: "Data Spike", desc: "Utilization exceeded 91%", done: true },
  { label: "Pattern Matched", desc: "HVAC overload signature identified", done: true },
  { label: "Threshold Breached", desc: "Critical threshold > 90% for 8+ min", done: true },
  { label: "Agent Fired", desc: "THETA-7 activated at 00:12 UTC", done: true },
];

const actions = [
  {
    icon: Users,
    title: "Reallocate Workers",
    desc: "Move 4 HVAC-certified workers from Zone A to Building C",
    impact: "ETA 12 min",
    impactColor: "#00A8FF",
    tag: "HIGH IMPACT",
    tagColor: "#00E676",
  },
  {
    icon: Mail,
    title: "Send Escalation Email",
    desc: "Notify Facility Manager + on-call technician of HVAC anomaly",
    impact: "Instant",
    impactColor: "#FFB300",
    tag: "RECOMMENDED",
    tagColor: "#00A8FF",
  },
  {
    icon: Calendar,
    title: "Auto-generate Schedule",
    desc: "Create emergency maintenance schedule for next 24h coverage",
    impact: "Saves 3.2hr",
    impactColor: "#00E676",
    tag: "AUTOMATED",
    tagColor: "#FFB300",
  },
];

export function AIDrawer({ isOpen, onClose, agent }: AIDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fade-in"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 90,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div
        className="drawer-slide-in"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          background: "rgba(8,14,26,0.97)",
          borderLeft: "1px solid rgba(0,168,255,0.2)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Cyan top border glow */}
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #00A8FF, #00A8FF, transparent)",
            boxShadow: "0 0 20px rgba(0,168,255,0.8)",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(0,168,255,0.1)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div
                className="pulse-red"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF4C4C",
                }}
              />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#FF4C4C", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                AGENT ACTIVATED
              </span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
              Agent {agent?.name || "System Monitor"}
            </h2>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              Triggered at {agent?.lastSeen || "Unknown"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Anomaly Card */}
          <div
            style={{
              background: "rgba(255,76,76,0.06)",
              border: "1px solid rgba(255,76,76,0.3)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertTriangle size={14} color="#FF4C4C" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#FF4C4C", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                CRITICAL ALERT
              </span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
              {agent?.trigger || "System generated an automatic anomaly alert."}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.6 }}>
              AI Confidence score highlights immediate action may be required.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Severity ring */}
              <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: 64, height: 64, transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,76,76,0.12)" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke="#FF4C4C"
                    strokeWidth="2.5"
                    strokeDasharray="82 100"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 3px rgba(255,76,76,0.8))" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span className="tabular" style={{ fontSize: 14, fontWeight: 700, color: "#FF4C4C", lineHeight: 1 }}>{agent?.confidence || 85}%</span>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>CONF</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Severity</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FF4C4C" }}>CRITICAL</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Priority</span>
                  <span className="tabular" style={{ fontSize: 11, fontWeight: 700, color: "#FFB300" }}>HIGH</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Type</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#00E676" }}>{agent?.name?.split(' ')[0] || "Alert"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Root Cause Stepper */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
              Root Cause Analysis
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: step.done ? "#00E676" : "rgba(255,255,255,0.1)",
                        border: `2px solid ${step.done ? "#00E676" : "rgba(255,255,255,0.1)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: step.done ? "0 0 8px rgba(0,230,118,0.4)" : "none",
                      }}
                    >
                      {step.done && <CheckCircle size={10} color="#080C14" strokeWidth={3} />}
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: step.done ? "rgba(0,230,118,0.3)" : "rgba(255,255,255,0.08)", margin: "2px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < steps.length - 1 ? 12 : 0, paddingTop: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action cards */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
              Recommended Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(0,168,255,0.12)",
                      borderRadius: 8,
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          background: "rgba(0,168,255,0.1)",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={13} color="#00A8FF" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{action.title}</span>
                          <span
                            style={{
                              fontSize: 8,
                              fontWeight: 700,
                              color: action.tagColor,
                              background: `${action.tagColor}18`,
                              padding: "1px 5px",
                              borderRadius: 3,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {action.tag}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{action.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: action.impactColor, fontWeight: 600 }}>
                        ↯ Impact: {action.impact}
                      </span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 4,
                            padding: "4px 10px",
                            fontSize: 10,
                            color: "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          Simulate
                        </button>
                        <button
                          style={{
                            background: "rgba(0,168,255,0.15)",
                            border: "1px solid rgba(0,168,255,0.3)",
                            borderRadius: 4,
                            padding: "4px 10px",
                            fontSize: 10,
                            color: "#00A8FF",
                            cursor: "pointer",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          Execute
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,168,255,0.1)", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="glow-btn-cyan"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Zap size={14} />
            Approve All & Execute
          </button>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
}
