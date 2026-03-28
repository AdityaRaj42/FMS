import { useState, useEffect } from "react";
import { LoadingSkeleton } from "../ui/LoadingSkeleton";

const API = "/api/v1";

function getColor(value: number): string {
  if (value >= 90) return "#00E676";
  if (value >= 75) return "#7BC67E";
  if (value >= 60) return "#FFB300";
  if (value >= 45) return "#FF8C00";
  return "#FF4C4C";
}

function getOpacity(value: number): number {
  return 0.2 + (value / 100) * 0.8;
}

export function WorkforceHeatmap() {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [stats, setStats] = useState<{ avgFill: number; criticalGaps: number; peakShift: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch(`${API}/dashboard/heatmap`)
    //   .then((r) => r.json())
    //   .then((data) => {
    //     if (data.data) setHeatmapData(data.data);
    //     if (data.days) setDays(data.days);
    //     if (data.shifts) setShifts(data.shifts);
    //     if (data.stats) setStats(data.stats);
    //   })
    //   .catch(() => { })
    //   .finally(() => setLoading(false));

    const dummyData = {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      shifts: [
        "AM 06-10",
        "PM 10-14",
        "PM 14-18",
        "PM 18-22",
        "PM 22-02",
        "PM 02-06"
      ],
      data: [
        [60, 55, 65, 60, 65, 50, 40],   // 00:00 - 04:00
        [85, 80, 88, 85, 80, 60, 45],   // 04:00 - 08:00
        [95, 40, 85, 92, 88, 75, 60],   // 08:00 - 12:00
        [90, 85, 95, 88, 85, 70, 55],   // 12:00 - 16:00
        [80, 85, 90, 85, 80, 30, 10],   // 16:00 - 20:00
        [70, 75, 80, 75, 70, 65, 5]     // 20:00 - 00:00
      ],
      stats: { avgFill: 71.5, criticalGaps: 4, peakShift: 95 }
    };

    setDays(dummyData.days);
    setShifts(dummyData.shifts);
    setHeatmapData(dummyData.data);
    setStats(dummyData.stats);
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="heatmap" />;
  }

  if (heatmapData.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
        No heatmap data available
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          7-Day Shift Coverage Heatmap
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Fill Rate</span>
          <div style={{ display: "flex", gap: 2 }}>
            {["#FF4C4C", "#FFB300", "#7BC67E", "#00E676"].map((c, i) => (
              <div key={i} style={{ width: 12, height: 8, background: c, borderRadius: 2, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Low → High</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, paddingLeft: 56 }}>
        {days.map((d) => (
          <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {heatmapData.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 3, flex: 1, alignItems: "center" }}>
            <div style={{ width: 50, flexShrink: 0, textAlign: "right", paddingRight: 6 }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", lineHeight: 1.3, whiteSpace: "pre-line", textAlign: "right" }}>{shifts[ri]}</div>
            </div>
            {row.map((val, ci) => {
              const isHov = hovered?.row === ri && hovered?.col === ci;
              const color = getColor(val);
              const opacity = getOpacity(val);
              return (
                <div key={ci} className="heatmap-cell" onMouseEnter={() => setHovered({ row: ri, col: ci })} onMouseLeave={() => setHovered(null)}
                  style={{
                    flex: 1, height: "100%", minHeight: 24, background: color, opacity: isHov ? 1 : opacity, borderRadius: 3,
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: isHov ? `0 0 10px ${color}80` : "none", transform: isHov ? "scale(1.08)" : "scale(1)",
                    zIndex: isHov ? 10 : 1, transition: "all 0.15s ease"
                  }}>
                  {isHov && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)",
                      background: "rgba(8,12,20,0.95)", border: `1px solid ${color}40`, borderRadius: 4, padding: "3px 6px", whiteSpace: "nowrap", zIndex: 20
                    }}>
                      <span className="tabular" style={{ fontSize: 10, fontWeight: 700, color }}>{val}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {stats && (
        <div style={{ display: "flex", gap: 12, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div className="tabular" style={{ fontSize: 14, fontWeight: 700, color: "#00E676" }}>{stats.avgFill}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Avg Fill</div>
          </div>
          <div>
            <div className="tabular" style={{ fontSize: 14, fontWeight: 700, color: "#FF4C4C" }}>{stats.criticalGaps}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Critical Gaps</div>
          </div>
          <div>
            <div className="tabular" style={{ fontSize: 14, fontWeight: 700, color: "#00A8FF" }}>{stats.peakShift}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Peak Shift</div>
          </div>
        </div>
      )}
    </div>
  );
}
