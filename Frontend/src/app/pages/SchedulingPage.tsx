import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  BrainCircuit, 
  Navigation,
  Star,
  Award,
  Bell
} from "lucide-react";

// Dummy data for Race Tickets
const DUMMY_TICKETS = [
  {
    id: "RT-8239",
    title: "Grand Prix Circuit Maintenance",
    location: "Sector 4 - Hairpin Turn",
    time: "Today, 14:00 - 18:00",
    priority: "Critical",
    description: "Urgent track surface inspection and barrier realignment required before practice session.",
    status: "pending_assignment"
  },
  {
    id: "RT-8240",
    title: "VIP Paddock Electrical Setup",
    location: "Paddock Club - Zone A",
    time: "Tomorrow, 08:00 - 12:00",
    priority: "High",
    description: "Install secondary power distribution and test backup generators for VIP area.",
    status: "assigned"
  },
  {
    id: "RT-8241",
    title: "Pit Lane Safety Audit",
    location: "Pit Lane - All Garages",
    time: "Tomorrow, 13:00 - 16:00",
    priority: "Medium",
    description: "Comprehensive safety check of fire suppression systems and emergency exits.",
    status: "pending_assignment"
  },
  {
    id: "RT-8242",
    title: "Medical Center HVAC Repair",
    location: "Medical Center - North Wing",
    time: "Today, 10:00 - 12:00",
    priority: "High",
    description: "HVAC cooling unit failure. Immediate repair needed to maintain required temperatures.",
    status: "pending_assignment"
  },
  {
    id: "RT-8243",
    title: "Broadcast Hub Connectivity Test",
    location: "Media Center - Command",
    time: "Today, 16:00 - 18:00",
    priority: "High",
    description: "Verify fiber-optic connections and calibrate timing telemetry feeds.",
    status: "in_progress"
  },
  {
    id: "RT-8244",
    title: "Grandstand Seating Inspection",
    location: "Grandstand B",
    time: "In 2 days, 09:00 - 15:00",
    priority: "Low",
    description: "Routine structural integrity check and spectator seating capacity verification.",
    status: "pending_assignment"
  },
  {
    id: "RT-8245",
    title: "Start/Finish Line Resurfacing",
    location: "Main Straight",
    time: "Tonight, 22:00 - 04:00",
    priority: "Critical",
    description: "Milling and overnight resurfacing of the start/finish grid due to excessive wear.",
    status: "assigned"
  }
];

// Dummy worker suggestions
const WORKER_SUGGESTIONS = [
  {
    id: "W-101",
    name: "Alex Rivera",
    role: "Senior Track Technician",
    availability: "Immediate",
    skills: ["Surface Repair", "Barrier Setup", "Heavy Machinery"],
    certifications: ["FIA Track Safety L3", "First Aid"],
    distance: "0.2 miles",
    eta: "5 mins",
    rating: 4.9,
    matchScore: 98
  },
  {
    id: "W-102",
    name: "Sarah Chen",
    role: "Structural Engineer",
    availability: "In 30 mins",
    skills: ["Structural Analysis", "Barrier Setup", "Safety Compliance"],
    certifications: ["Safety L2", "Advanced Inspection"],
    distance: "1.5 miles",
    eta: "15 mins",
    rating: 4.7,
    matchScore: 85
  },
  {
    id: "W-103",
    name: "Marcus Johnson",
    role: "General Maintenance",
    availability: "Available",
    skills: ["Equipment Prep", "Logistics", "Basic Repair"],
    certifications: ["Safety L1"],
    distance: "0.5 miles",
    eta: "8 mins",
    rating: 4.5,
    matchScore: 72
  },
  {
    id: "W-104",
    name: "Elena Rostova",
    role: "Electrical Specialist",
    availability: "Immediate",
    skills: ["High Voltage", "Generator Sync", "Telemetry Sys"],
    certifications: ["Master Electrician", "Safety L2"],
    distance: "0.8 miles",
    eta: "10 mins",
    rating: 4.8,
    matchScore: 88
  },
  {
    id: "W-105",
    name: "David Kim",
    role: "HVAC & Cooling Tech",
    availability: "In 1 hour",
    skills: ["HVAC Diagnostics", "Chiller Units", "Basic Repair"],
    certifications: ["HVAC Pro", "Hazmat"],
    distance: "2.1 miles",
    eta: "20 mins",
    rating: 4.6,
    matchScore: 65
  }
];

export function SchedulingPage() {
  const [selectedTicket, setSelectedTicket] = useState(DUMMY_TICKETS[0]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof WORKER_SUGGESTIONS | null>(null);
  const [assignedWorker, setAssignedWorker] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const handleSuggestWorkers = () => {
    setIsSuggesting(true);
    // Simulate AI inference delay
    setTimeout(() => {
      setSuggestions(WORKER_SUGGESTIONS);
      setIsSuggesting(false);
    }, 1500);
  };

  const handleAssign = (workerName: string) => {
    setAssignedWorker(workerName);
    setNotification({
      message: `Assigned ${workerName} to ${selectedTicket.id}. Supervisor notified for approval.`,
      type: "success"
    });
    
    // Auto-hide notification
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 16px", gap: 16, overflow: "hidden" }}>
      
      {/* Header and Notification Area */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={20} color="#00A8FF" />
            Workflow Scheduling - Race Ticket Scenario
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Intelligent assignment and deployment routing for critical racing events.
          </p>
        </div>
        
        {/* Notification Toast */}
        {notification && (
          <div style={{
            background: notification.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(0, 168, 255, 0.15)",
            border: `1px solid ${notification.type === "success" ? "rgba(16, 185, 129, 0.4)" : "rgba(0, 168, 255, 0.4)"}`,
            padding: "8px 16px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "fadeIn 0.3s ease-out"
          }}>
            {notification.type === "success" ? <CheckCircle2 size={16} color="#10b981" /> : <Bell size={16} color="#00A8FF" />}
            <span style={{ fontSize: 13, color: notification.type === "success" ? "#10b981" : "#00A8FF" }}>
              {notification.message}
            </span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", gap: 16, minHeight: 0 }}>
        
        {/* Left Column: Tickets List */}
        <div style={{ width: "35%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
            Pending Executions
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {DUMMY_TICKETS.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setSuggestions(null);
                  setAssignedWorker(null);
                }}
                className="glass-card"
                style={{ 
                  padding: 16, 
                  cursor: "pointer",
                  border: selectedTicket.id === ticket.id ? "1px solid rgba(0,168,255,0.8)" : undefined,
                  background: selectedTicket.id === ticket.id ? "rgba(0,168,255,0.05)" : undefined,
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#00A8FF", background: "rgba(0,168,255,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                    {ticket.id}
                  </span>
                  {ticket.priority === "Critical" && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#FF4C4C", fontWeight: 600 }}>
                      <AlertCircle size={12} /> CRITICAL
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{ticket.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} /> {ticket.location}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={12} /> {ticket.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ticket Details & AI Assignment */}
        <div className="glass-card" style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#00A8FF", background: "rgba(0,168,255,0.1)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                {selectedTicket.id}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Status: 
                <span style={{ color: "#fff", marginLeft: 6 }}>{selectedTicket.status.replace("_", " ").toUpperCase()}</span>
              </span>
            </div>
            <h3 style={{ fontSize: 24, margin: "0 0 8px 0" }}>{selectedTicket.title}</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 16px 0", lineHeight: 1.5 }}>
              {selectedTicket.description}
            </p>
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#00A8FF" /> {selectedTicket.location}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} color="#00A8FF" /> {selectedTicket.time}</div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h4 style={{ fontSize: 16, margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={16} /> Workflow Assignment Criteria
            </h4>

            {!suggestions && !isSuggesting && !assignedWorker && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 200, background: "rgba(0,0,0,0.2)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
                <BrainCircuit size={48} color="rgba(0,168,255,0.4)" style={{ marginBottom: 16 }} />
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24, textAlign: "center", maxWidth: 300 }}>
                  AI will analyze availability, skills, certifications, and distance to suggest the optimal workforce for this ticket.
                </p>
                <button 
                  onClick={handleSuggestWorkers}
                  style={{
                    background: "linear-gradient(90deg, #00A8FF 0%, #0077FF 100%)",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 24px",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(0, 168, 255, 0.3)",
                    transition: "transform 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "none"}
                >
                  <BrainCircuit size={16} /> Suggest Suitable Workers
                </button>
              </div>
            )}

            {isSuggesting && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 200 }}>
                <div style={{ width: 40, height: 40, border: "3px solid rgba(0,168,255,0.2)", borderTopColor: "#00A8FF", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.8)", animation: "pulse 1.5s infinite" }}>
                  Analyzing workforce matrix...
                </p>
              </div>
            )}

            {suggestions && !assignedWorker && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.4s ease-out" }}>
                {suggestions.map((worker, index) => (
                  <div key={worker.id} style={{ 
                    background: "rgba(0,0,0,0.2)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: 12, 
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ 
                          width: 40, height: 40, borderRadius: "50%", 
                          background: index === 0 ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "rgba(255,255,255,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 
                        }}>
                          {worker.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                            {worker.name} 
                            {index === 0 && <span style={{ fontSize: 10, background: "rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "2px 6px", borderRadius: 4 }}>BEST MATCH {worker.matchScore}%</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{worker.role}</div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleAssign(worker.name)}
                        style={{
                          background: index === 0 ? "#10b981" : "rgba(255,255,255,0.1)",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 16px",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = index === 0 ? "#059669" : "rgba(255,255,255,0.2)"}
                        onMouseOut={(e) => e.currentTarget.style.background = index === 0 ? "#10b981" : "rgba(255,255,255,0.1)"}
                      >
                        Assign & Notify Supervisor
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        <Clock size={14} color="#00A8FF" /> Avail: <span style={{ color: "#fff" }}>{worker.availability}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        <Navigation size={14} color="#00A8FF" /> Dist: <span style={{ color: "#fff" }}>{worker.distance}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        <Star size={14} color="#00A8FF" /> Rating: <span style={{ color: "#fff" }}>{worker.rating}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                        <Wrench size={12} /> Skills: 
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 4 }}>
                          {worker.skills.map(s => <span key={s} style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>{s}</span>)}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
                        <Award size={12} /> Certs: 
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 4 }}>
                          {worker.certifications.map(c => <span key={c} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>{c}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {assignedWorker && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 200, background: "rgba(16, 185, 129, 0.05)", borderRadius: 12, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: 16 }} />
                <h4 style={{ margin: "0 0 8px 0", fontSize: 18, color: "#10b981" }}>Successfully Assigned!</h4>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 24, textAlign: "center", maxWidth: 350 }}>
                  <strong>{assignedWorker}</strong> has been assigned to this ticket. A notification has been sent to the supervisor for final approval.
                </p>
                <button 
                  onClick={() => {
                    setAssignedWorker(null);
                    setSuggestions(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 6,
                    padding: "8px 16px",
                    color: "#fff",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Reset Assignment
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Required Keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
