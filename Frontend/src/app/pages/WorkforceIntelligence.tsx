import { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const API = "/api/v1";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,168,255,0.2)", borderRadius: 6, padding: "8px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{d.skill}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Demand: {d.y}% · Workers: {d.z}</div>
      </div>
    );
  }
  return null;
};

export function WorkforceIntelligence() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [bubbleData, setBubbleData] = useState<any[]>([]);
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [graphEdges, setGraphEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/workforce/workers`).then(r => r.json()).then(d => { if (d.workers?.length) setWorkers(d.workers); }),
      fetch(`${API}/workforce/skill-demand`).then(r => r.json()).then(d => { if (d.bubbleData?.length) setBubbleData(d.bubbleData); }),
      fetch(`${API}/workforce/assignment-graph`).then(r => r.json()).then(d => {
        if (d.nodes?.length) setGraphNodes(d.nodes);
        if (d.edges?.length) setGraphEdges(d.edges);
      }),
    ]).catch(() => { }).finally(() => setLoading(false));
  }, []);

  function getNodePos(id: string) {
    return graphNodes.find((n) => n.id === id);
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", gap: 10, padding: "12px 16px", overflow: "hidden", minWidth: 0 }}>
        <div style={{ width: "40%" }}><LoadingSkeleton variant="list" /></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ flex: 1 }}><LoadingSkeleton variant="heatmap" /></div>
          <div style={{ flex: 1.2 }}><LoadingSkeleton variant="heatmap" /></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", gap: 10, padding: "12px 16px", overflow: "hidden", minWidth: 0 }}>
      {/* Left: Worker Table */}
      <div
        className="glass-card"
        style={{
          width: "40%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Worker Intelligence
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{workers.length} workers</span>
        </div>

        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: 8,
            padding: "4px 8px",
            marginBottom: 4,
            flexShrink: 0,
          }}
        >
          {["Worker", "Skills & Availability", "Status"].map((h) => (
            <span key={h} style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Worker rows */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {workers.map((w) => (
            <div
              key={w.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 6,
                padding: "9px 10px",
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 10,
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              {/* Worker info */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${w.statusColor}30 0%, ${w.statusColor}10 100%)`,
                    border: `1.5px solid ${w.statusColor}50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: w.statusColor,
                    flexShrink: 0,
                  }}
                >
                  {w.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {w.role}
                  </div>
                </div>
              </div>

              {/* Skills + availability */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {w.skills.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 9,
                        padding: "1px 5px",
                        borderRadius: 10,
                        background: "rgba(0,168,255,0.1)",
                        border: "1px solid rgba(0,168,255,0.2)",
                        color: "#00A8FF",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ width: 70 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>Avail.</span>
                    <span className="tabular" style={{ fontSize: 8, color: w.statusColor, fontWeight: 600 }}>{w.availability}%</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${w.availability}%`,
                        background: w.statusColor,
                        borderRadius: 2,
                        boxShadow: `0 0 4px ${w.statusColor}60`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status chip */}
              <div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 7px",
                    borderRadius: 10,
                    background: `${w.statusColor}15`,
                    border: `1px solid ${w.statusColor}30`,
                    color: w.statusColor,
                    whiteSpace: "nowrap",
                  }}
                >
                  {w.status}
                </span>
              </div>
            </div>
          ))
          }
          {workers.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
              No worker data available
            </div>
          )}
        </div>
      </div>

      {/* Right: Charts stacked */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0, overflow: "hidden" }}>
        {/* Top: Skill Bubble Chart */}
        <div className="glass-card" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, flexShrink: 0 }}>
            Skill vs Demand Analysis
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 20, left: 0 }}>
                <XAxis
                  dataKey="x"
                  name="Skill Level"
                  label={{ value: "Skill Level →", position: "insideBottom", offset: -10, fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="y"
                  name="Demand"
                  label={{ value: "Demand %", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  tickLine={false}
                />
                <ZAxis dataKey="z" range={[60, 400]} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "rgba(0,168,255,0.2)" }} />
                <Scatter data={bubbleData} isAnimationActive={false}>
                  {bubbleData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={1} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            {bubbleData.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                No skill data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Graph RAG Visualization */}
        <div className="glass-card" style={{ flex: 1.2, padding: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,168,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, flexShrink: 0 }}>
            Client-to-Worker Assignment Graph
          </div>
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 450 260" style={{ overflow: "visible" }}>
              {/* Edges */}
              {graphEdges.map((edge, i) => {
                const from = getNodePos(edge.from);
                const to = getNodePos(edge.to);
                if (!from || !to) return null;
                const isHighlighted = selectedNode === edge.from || selectedNode === edge.to;
                return (
                  <g key={i}>
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={isHighlighted ? edge.color : "rgba(255,255,255,0.08)"}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={isHighlighted ? "none" : "3 3"}
                    />
                    {isHighlighted && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 4}
                        textAnchor="middle"
                        fill={edge.color}
                        fontSize={8}
                        fontFamily="'Space Grotesk', sans-serif"
                        opacity={0.8}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {graphNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isWorker = node.type === "worker";
                const r = isWorker ? 16 : 20;

                return (
                  <g
                    key={node.id}
                    className="graph-node"
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={r + 8} fill={`${node.color}10`} stroke={node.color} strokeWidth={1} opacity={0.5} />
                    )}
                    <circle
                      cx={node.x} cy={node.y} r={r}
                      fill={isSelected ? `${node.color}30` : `${node.color}15`}
                      stroke={node.color}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{ filter: isSelected ? `drop-shadow(0 0 8px ${node.color}80)` : "none" }}
                    />
                    <text
                      x={node.x} y={node.y + 3}
                      textAnchor="middle"
                      fill={node.color}
                      fontSize={isWorker ? 8 : 10}
                      fontWeight="700"
                      fontFamily="'Space Grotesk', sans-serif"
                    >
                      {isWorker ? node.label.split(" ")[1]?.charAt(0) || node.label.charAt(0) : node.id.toUpperCase()}
                    </text>
                    <text
                      x={node.x} y={node.y + r + 12}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.45)"
                      fontSize={8}
                      fontFamily="'Space Grotesk', sans-serif"
                    >
                      {node.label.length > 10 ? node.label.substring(0, 9) + "…" : node.label}
                    </text>
                    {/* Type badge */}
                    <text
                      x={node.x} y={node.y - r - 4}
                      textAnchor="middle"
                      fill={node.color}
                      fontSize={6}
                      fontWeight="700"
                      fontFamily="'Space Grotesk', sans-serif"
                      opacity={0.6}
                    >
                      {(node.type === "facility" ? "FAC" : "WKR").toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {graphNodes.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                No assignment graph data available
              </div>
            )}

            {/* Legend */}
            <div style={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00A8FF", border: "1.5px solid #00A8FF" }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Facility</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00E676", border: "1.5px solid #00E676" }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Worker</span>
              </div>
              <span style={{ fontSize: 9, color: "rgba(0,168,255,0.5)" }}>Click nodes to highlight connections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
