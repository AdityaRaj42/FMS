import { useState } from "react";
import { TopBar } from "./components/layout/TopBar";
import { Sidebar } from "./components/layout/Sidebar";
import { ActivityTicker } from "./components/layout/ActivityTicker";
import { AIDrawer } from "./components/layout/AIDrawer";
import { AIChat } from "./components/AIChat";
import { CommandDashboard } from "./pages/CommandDashboard";
import { WorkforceIntelligence } from "./pages/WorkforceIntelligence";
import { AIAgentsPage } from "./pages/AIAgentsPage";
import { ReportsPage } from "./pages/ReportsPage";

const pageConfig: Record<string, { breadcrumb: string[]; label: string }> = {
  dashboard: { breadcrumb: ["NexusFM", "Command Dashboard"], label: "Command Dashboard" },
  workforce: { breadcrumb: ["NexusFM", "Workforce", "Intelligence"], label: "Workforce Intelligence" },
  clients: { breadcrumb: ["NexusFM", "Clients"], label: "Client Management" },
  scheduling: { breadcrumb: ["NexusFM", "Scheduling"], label: "Scheduling" },
  agents: { breadcrumb: ["NexusFM", "AI Agents"], label: "AI Agents" },
  graph: { breadcrumb: ["NexusFM", "Graph Insights"], label: "Graph Insights" },
  reports: { breadcrumb: ["NexusFM", "Reports"], label: "Reports" },
  settings: { breadcrumb: ["NexusFM", "Settings"], label: "Settings" },
};

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          width: 64,
          height: 64,
          background: "rgba(0,168,255,0.08)",
          border: "1px solid rgba(0,168,255,0.15)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(0,168,255,0.4)" }} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{title}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>This screen is under construction</div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAgentData, setSelectedAgentData] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const config = pageConfig[activePage] || pageConfig.dashboard;

  const handleAlertClick = (agent?: any) => {
    setSelectedAgentData(agent);
    setDrawerOpen(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <CommandDashboard onAlertClick={handleAlertClick} />;
      case "workforce":
        return <WorkforceIntelligence />;
      case "agents":
        return <AIAgentsPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <PlaceholderPage title={config.label} />;
    }
  };

  return (
    <div
      className="fms-bg"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* Top Bar */}
      <TopBar
        breadcrumb={config.breadcrumb}
        notifCount={drawerOpen ? 0 : 3}
        onSearchClick={() => {}}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <Sidebar activeItem={activePage} onNavigate={setActivePage} />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
            background: "transparent",
          }}
        >
          {/* Page content */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            {renderPage()}
          </div>

          {/* Activity Ticker */}
          <ActivityTicker />
        </div>
      </div>

      {/* AI Alert Drawer */}
      <AIDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} agent={selectedAgentData} />

      {/* Floating AI Chat */}
      <AIChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />

      {/* Alert trigger button (demo) */}
      {!drawerOpen && activePage === "dashboard" && (
        <button
          onClick={() => handleAlertClick()}
          className="pulse-red"
          style={{
            position: "fixed",
            bottom: 122,
            right: 90,
            background: "rgba(255,76,76,0.15)",
            border: "1px solid rgba(255,76,76,0.4)",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#FF4C4C",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 70,
          }}
        >
          <span
            className="blink"
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF4C4C", display: "inline-block" }}
          />
          Agent Alert
        </button>
      )}
    </div>
  );
}
