import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Mic, Bot, Sparkles } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  chips?: { label: string; value: string }[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    text: "Hello! I'm your FMS Intelligence Assistant powered by active facility data. Type a question below to run a real-time query against the database.",
    chips: [],
  },
];

const quickPrompts = [
  "Show me the workers that are active",
  "How many compliance violations exist?",
  "List out the recent service tickets",
  "Summarize our facility workforce",
];

interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIChat({ isOpen, onToggle }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const resp = await fetch("/api/v1/agent/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await resp.json();
      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "ai",
        text: data.response || "I couldn't process that query. Please try again.",
        chips: data.data && data.data.length > 0
          ? Object.entries(data.data[0]).filter(([k, v]) => v !== null).slice(0, 3).map(([k, v]) => ({ label: k.slice(0, 15), value: String(v).slice(0, 15) }))
          : undefined,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, type: "ai", text: "Network error. The AI Agent endpoint could not be reached." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        className={`fab-btn ${isOpen ? "" : ""}`}
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: 60,
          right: 24,
          zIndex: 80,
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="drawer-slide-in"
          style={{
            position: "fixed",
            bottom: 122,
            right: 24,
            width: 400,
            height: 520,
            background: "rgba(8,14,26,0.97)",
            border: "1px solid rgba(0,168,255,0.2)",
            backdropFilter: "blur(20px)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 80,
            boxShadow: "0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,168,255,0.1)",
          }}
        >
          {/* Cyan top border */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #00A8FF, transparent)", boxShadow: "0 0 10px rgba(0,168,255,0.6)" }} />

          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(0,168,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "linear-gradient(135deg, #00A8FF 0%, #0055AA 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(0,168,255,0.4)",
              }}
            >
              <Bot size={15} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>FMS Intelligence</div>
              <div style={{ fontSize: 10, color: "rgba(0,168,255,0.7)", lineHeight: 1.4 }}>NexusAI v3.1 · GPT-4o</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Sparkles size={11} color="#FFB300" />
              <span style={{ fontSize: 9, color: "#FFB300", fontWeight: 600 }}>LIVE DATA</span>
            </div>
            <button
              onClick={onToggle}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                padding: 4,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ maxWidth: "82%" }}>
                  <div
                    className={msg.type === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                    style={{ padding: "9px 12px" }}
                  >
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
                      {msg.text}
                    </p>
                    {msg.chips && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {msg.chips.map((chip, i) => (
                          <span
                            key={i}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              background: "rgba(0,168,255,0.15)",
                              border: "1px solid rgba(0,168,255,0.25)",
                              borderRadius: 4,
                              padding: "2px 7px",
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#00A8FF",
                            }}
                          >
                            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{chip.label}:</span>
                            {chip.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00A8FF",
                      animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div
            style={{
              padding: "6px 14px",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                style={{
                  whiteSpace: "nowrap",
                  background: "rgba(0,168,255,0.08)",
                  border: "1px solid rgba(0,168,255,0.15)",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 10,
                  color: "rgba(0,168,255,0.8)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(0,168,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,168,255,0.15)",
                borderRadius: 20,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask anything about your facility…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                }}
              />
              <button
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}
              >
                <Mic size={13} />
              </button>
            </div>
            <button
              onClick={() => sendMessage(input)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: input.trim() ? "linear-gradient(135deg, #00A8FF, #0055AA)" : "rgba(255,255,255,0.06)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: input.trim() ? "0 0 10px rgba(0,168,255,0.4)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <Send size={13} color={input.trim() ? "white" : "rgba(255,255,255,0.2)"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
