import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  status: "healthy" | "warning" | "critical" | "default";
  sparkData?: number[];
  altTitle?: string | null;
  altValue?: string | number | null;
}

const statusColors = {
  healthy: "#00E676",
  warning: "#FFB300",
  critical: "#FF4C4C",
  default: "#00A8FF",
};

export function KPICard({ title, value, unit, delta, deltaPositive, icon: Icon, status, sparkData = [], altTitle, altValue }: KPICardProps) {
  const color = statusColors[status];
  const isCritical = status === "critical";

  // Smart fallback: if value is 0 and altValue exists, show the alt info
  const hasAlt = (value === 0 || value === "0" || value === "0.0") && altTitle && altValue;
  const displayTitle = hasAlt ? altTitle! : title;
  const displayValue = hasAlt ? altValue! : value;
  const displayUnit = hasAlt ? "" : unit;

  const chartData = sparkData.map((v) => ({ v }));

  return (
    <div
      className={`glass-card ${isCritical ? "critical-card" : ""}`}
      style={{
        padding: "14px 16px",
        flex: 1,
        minWidth: 0,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {displayTitle}
        </span>
        <div
          style={{
            width: 26,
            height: 26,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={13} color={color} />
        </div>
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          className="tabular"
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {displayValue}
        </span>
        {displayUnit && (
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{displayUnit}</span>
        )}
      </div>

      {/* Alt label indicator */}
      {hasAlt && (
        <div style={{ fontSize: 9, color: "rgba(0,168,255,0.5)", fontStyle: "italic", marginTop: -4 }}>
          computed from available data
        </div>
      )}

      {/* Status dot + delta */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          className={isCritical ? "pulse-red" : status === "warning" ? "" : "pulse-green"}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
            flexShrink: 0,
          }}
        />
        {delta && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: deltaPositive ? "#00E676" : "#FF4C4C",
            }}
          >
            {deltaPositive ? "↑" : "↓"} {delta}
          </span>
        )}
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>vs last week</span>
      </div>

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div style={{ height: 36, marginTop: -4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${displayTitle}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#spark-${displayTitle})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Background glow accent */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `${color}08`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
