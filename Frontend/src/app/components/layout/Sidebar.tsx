import { useState } from "react";
import {
  LayoutDashboard, Users, Building2, Calendar, Bot, Network, BarChart3, Settings, ChevronRight, ChevronLeft,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Workforce", id: "workforce" },
  { icon: Building2, label: "Clients", id: "clients" },
  { icon: Calendar, label: "Scheduling", id: "scheduling" },
  { icon: Bot, label: "AI Agents", id: "agents" },
  { icon: Network, label: "Graph Insights", id: "graph" },
  { icon: BarChart3, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeItem: string;
  onNavigate: (id: string) => void;
}

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const width = expanded ? 220 : 64;

  return (
    <div
      style={{
        width,
        minWidth: width,
        height: "100%",
        background: "rgba(8,12,20,0.95)",
        borderRight: "1px solid rgba(0,168,255,0.1)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
        zIndex: 40,
        position: "relative",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          position: "absolute",
          top: 12,
          right: -12,
          width: 24,
          height: 24,
          background: "#0D1829",
          border: "1px solid rgba(0,168,255,0.2)",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(0,168,255,0.7)",
          zIndex: 10,
        }}
      >
        {expanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{
                width: "100%",
                justifyContent: expanded ? "flex-start" : "center",
                whiteSpace: "nowrap",
                background: "transparent",
                border: "none",
                textAlign: "left",
              }}
              title={!expanded ? label : undefined}
            >
              <Icon size={16} style={{ flexShrink: 0, color: isActive ? "#00A8FF" : undefined }} />
              {expanded && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, letterSpacing: "0.02em" }}>
                  {label}
                </span>
              )}
              {isActive && expanded && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#00A8FF",
                    boxShadow: "0 0 6px #00A8FF",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: system health */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid rgba(0,168,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          className="pulse-green"
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#00E676",
            flexShrink: 0,
          }}
        />
        {expanded && (
          <div>
            <div style={{ fontSize: 11, color: "#00E676", fontWeight: 600 }}>Systems Nominal</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              All 24 agents online
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
