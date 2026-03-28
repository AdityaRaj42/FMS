import { useState, useEffect } from "react";
import { Bot, Mail, AlertTriangle, Brain, CheckCircle, Zap } from "lucide-react";

// Map strings returned from API to actual Lucide icons
const iconMap: Record<string, any> = {
  Bot, Mail, AlertTriangle, Brain, CheckCircle, Zap
};

const API = "http://localhost:8000/api/v1";

export function ActivityTicker() {
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/dashboard/ticker`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ticker && data.ticker.length > 0) {
          setTickerItems(data.ticker);
        }
      })
      .catch((err) => console.error("Failed to load ticker", err));
  }, []);

  const doubled = tickerItems.length > 0 ? [...tickerItems, ...tickerItems] : [];

  return (
    <div
      style={{
        height: 40,
        background: "rgba(8,12,20,0.9)",
        borderTop: "1px solid rgba(0,168,255,0.1)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to right, #080C14, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          gap: 6,
          zIndex: 11,
          background: "rgba(8,12,20,0.95)",
          borderRight: "1px solid rgba(0,168,255,0.1)",
        }}
      >
        <div
          className="blink"
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#00A8FF", boxShadow: "0 0 6px #00A8FF" }}
        />
        <span style={{ fontSize: 9, fontWeight: 700, color: "#00A8FF", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          LIVE
        </span>
      </div>

      {/* Scrolling content */}
        <div className="ticker-wrap" style={{ flex: 1, paddingLeft: 92 }}>
          {tickerItems.length > 0 ? (
            <div className="ticker-content" style={{ gap: 0 }}>
              {doubled.map((item, i) => {
                const Icon = iconMap[item.icon] || Bot;
                return (
                  <div
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0 20px",
                      borderRight: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon size={11} color={item.color} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
                      {item.text}
                    </span>
                    <span
                      className="tabular"
                      style={{ fontSize: 10, color: item.color, opacity: 0.7, fontWeight: 600, minWidth: 32 }}
                    >
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Loading live activity...</span>
            </div>
          )}
        </div>

      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to left, #080C14, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
