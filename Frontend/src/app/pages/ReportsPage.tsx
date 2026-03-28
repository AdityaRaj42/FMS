import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from "recharts";
import { FileText, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const API = "http://localhost:8000/api/v1";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,168,255,0.15)", borderRadius: 6, padding: "8px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ fontSize: 10, color: p.color }}>{p.name}: {p.value}{p.name === "utilization" || p.name === "coverage" ? "%" : ""}</div>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/reports/weekly`).then(r => r.json()).then(d => { if (d.weeklyData?.length) setWeeklyData(d.weeklyData); }),
      fetch(`${API}/reports/monthly-trend`).then(r => r.json()).then(d => { if (d.monthlyTrend?.length) setMonthlyTrend(d.monthlyTrend); }),
      fetch(`${API}/reports/kpis`).then(r => r.json()).then(d => { if (d.kpis?.length) setKpis(d.kpis); }),
      fetch(`${API}/reports/generated`).then(r => r.json()).then(d => { if (d.reports?.length) setReports(d.reports); }),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, padding: "12px 16px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, height: 220 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LoadingSkeleton variant="heatmap" />
            </div>
          ))}
        </div>
        <LoadingSkeleton variant="cards" />
        <LoadingSkeleton variant="list" />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "12px 16px", overflow: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Top row: 3 charts */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0, height: 220 }}>
        {/* Workers chart */}
        <div className="glass-card" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Weekly Worker Volume
          </div>
          {weeklyData.length > 0 ? (
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="workers" fill="#00A8FF" opacity={0.7} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>No data</div>
          )}
        </div>

        {/* Utilization chart */}
        <div className="glass-card" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Utilization & Coverage Trend
          </div>
          {weeklyData.length > 0 ? (
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="utilization" stroke="#FFB300" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="coverage" stroke="#00E676" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>No data</div>
          )}
        </div>

        {/* Monthly efficiency */}
        <div className="glass-card" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            6-Month Efficiency vs Risk
          </div>
          {monthlyTrend.length > 0 ? (
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <defs>
                    <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E676" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="efficiency" stroke="#00E676" strokeWidth={2} fill="url(#effGrad)" dot={false} />
                  <Line type="monotone" dataKey="risk" stroke="#FF4C4C" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>No data</div>
          )}
        </div>
      </div>

      {/* KPI Row — from real API data */}
      {kpis.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          {kpis.map((k: any) => (
            <div key={k.label} className="glass-card" style={{ flex: 1, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k.label}</div>
              <div className="tabular" style={{ fontSize: 20, fontWeight: 700, color: k.color, marginBottom: 3 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: k.up ? "#00E676" : "#FF4C4C", display: "flex", alignItems: "center", gap: 3 }}>
                {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {k.delta} vs last month
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports list — real data-driven reports */}
      <div className="glass-card" style={{ padding: "12px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
          Generated Reports
        </div>
        {reports.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            No reports available
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {reports.map((r, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 10px",
                    background: expandedReport === i ? "rgba(0,168,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${expandedReport === i ? "rgba(0,168,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: expandedReport === i ? "6px 6px 0 0" : 6,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => setExpandedReport(expandedReport === i ? null : i)}
                >
                  <FileText size={14} color="rgba(0,168,255,0.6)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{r.date}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: r.color, background: `${r.color}15`, padding: "2px 8px", borderRadius: 10, border: `1px solid ${r.color}30` }}>
                    {r.status}
                  </span>
                  {expandedReport === i ? (
                    <ChevronUp size={14} color="rgba(0,168,255,0.5)" />
                  ) : (
                    <ChevronDown size={14} color="rgba(255,255,255,0.2)" />
                  )}
                </div>

                {/* Expanded report metrics */}
                {expandedReport === i && r.metrics && (
                  <div
                    style={{
                      background: "rgba(0,168,255,0.02)",
                      border: "1px solid rgba(0,168,255,0.12)",
                      borderTop: "none",
                      borderRadius: "0 0 6px 6px",
                      padding: "10px 12px",
                    }}
                  >
                    {r.summary && (
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, lineHeight: 1.4 }}>
                        {r.summary}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {r.metrics.map((m: any) => (
                        <div
                          key={m.label}
                          style={{
                            flex: 1,
                            textAlign: "center",
                            padding: "8px 6px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 5,
                          }}
                        >
                          <div className="tabular" style={{ fontSize: 16, fontWeight: 700, color: "#00A8FF", marginBottom: 2 }}>{m.value}</div>
                          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
