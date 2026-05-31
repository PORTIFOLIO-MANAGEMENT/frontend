import { useState, useEffect, useRef, useCallback } from "react";

export default function AIWidget({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey. I'm ARIA — the studio's AI. Ask me anything about our work, pricing, or kick off a project brief right now." },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots]     = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setDots(d => (d.length >= 3 ? "" : d + ".")), 350);
    return () => clearInterval(t);
  }, [loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const history = [...messages, { role: "user", text }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ARIA, the AI assistant for FORGE STUDIO — a two-person creative studio.
One partner is a full-stack developer (React, TypeScript, Python, Laravel).
The other is a 3D/graphic designer (Blender, motion design, branding).
Services: Interactive web apps, 3D & motion design, brand identity, creative direction.
Be sharp, direct, creative. Never generic. Max 3 sentences per response unless writing a brief.
If asked for a project brief, ask: 1) What's the project? 2) What's the timeline? 3) What's the budget?`,
          messages: history.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data  = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Something broke. Refresh and try again.";
      setMessages(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Connection dropped. Try again." }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  return (
    <div style={{
      position: "fixed", bottom: 100, right: 16, width: "min(360px, calc(100vw - 32px))", maxHeight: "min(520px, calc(100dvh - 120px))",
      background: "#0D0D0D", border: "1px solid #222", borderRadius: 16,
      display: "flex", flexDirection: "column", zIndex: 1000,
      boxShadow: "0 32px 80px rgba(0,0,0,0.8)", fontFamily: "'Space Mono', monospace",
      overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#C8F53B,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#000" }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 2 }}>ARIA</div>
            <div style={{ fontSize: 10, color: "#666" }}>Studio AI · Always online</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18, padding: 4, lineHeight: 1 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "#C8F53B" : "#161616",
              color: m.role === "user" ? "#000" : "#ccc",
              fontSize: 12, lineHeight: 1.6,
              border: m.role === "assistant" ? "1px solid #222" : "none",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#161616", border: "1px solid #222", color: "#C8F53B", fontSize: 12 }}>
              ARIA{dots}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          style={{ flex: 1, background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 12, fontFamily: "'Space Mono', monospace", outline: "none" }}
        />
        <button onClick={send} disabled={loading} style={{ background: loading ? "#333" : "#C8F53B", border: "none", borderRadius: 8, width: 40, cursor: loading ? "not-allowed" : "pointer", color: "#000", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  );
}
