import { useState, useEffect } from "react";
import { Bell, Search, ChevronRight, Zap } from "lucide-react";

interface TopBarProps {
  breadcrumb: string[];
  notifCount?: number;
  onSearchClick?: () => void;
}

export function TopBar({ breadcrumb, notifCount = 3, onSearchClick }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      style={{
        height: 56,
        background: "rgba(8,12,20,0.95)",
        borderBottom: "1px solid rgba(0,168,255,0.12)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        zIndex: 50,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 180 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #00A8FF 0%, #0055AA 100%)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(0,168,255,0.5)",
          }}
        >
          <Zap size={16} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>
            NEXUS<span style={{ color: "#00A8FF" }}>FM</span>
          </div>
          <div style={{ fontSize: 9, color: "rgba(0,168,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.2 }}>
            AI Command
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "rgba(0,168,255,0.15)" }} />

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        {breadcrumb.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <ChevronRight size={12} color="rgba(255,255,255,0.25)" />}
            <span
              style={{
                fontSize: 11,
                fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                color: i === breadcrumb.length - 1 ? "#fff" : "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Live clock */}
        <div style={{ textAlign: "right" }}>
          <div className="tabular" style={{ fontSize: 15, fontWeight: 600, color: "#00A8FF", letterSpacing: "0.04em", lineHeight: 1 }}>
            {formatTime(time)}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.4 }}>
            {formatDate(time)}
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }} />

        {/* Search */}
        <button
          onClick={onSearchClick}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <Search size={13} />
          <span style={{ fontSize: 11, letterSpacing: "0.04em" }}>Search...</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>⌘K</span>
        </button>

        {/* Notification bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={15} color="rgba(255,255,255,0.6)" />
          </div>
          {notifCount > 0 && (
            <div
              className="pulse-red"
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                background: "#FF4C4C",
                borderRadius: "50%",
                fontSize: 9,
                fontWeight: 700,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #080C14",
              }}
            >
              {notifCount}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #00A8FF 0%, #6C00FF 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              border: "1.5px solid rgba(0,168,255,0.4)",
            }}
          >
            JA
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1 }}>J. Anderson</span>
            <span style={{ fontSize: 9, color: "#00A8FF", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1.4 }}>
              Ops Director
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
