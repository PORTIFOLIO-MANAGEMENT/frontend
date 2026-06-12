import { useEffect, useState, useCallback } from "react";
import { listConversations, startConversation } from "../services/chat";
import { getEcho } from "../services/echo";
import { useAuth } from "../context/AuthContext";
import ChatPanel from "./ChatPanel";
import { colors, fonts } from "../styles/theme";

// Conversation list + active thread. `canStart` shows the "new conversation"
// composer (clients); admins reply to existing threads only.
export default function MessagesPanel({ canStart = false }) {
  const { isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ subject: "", body: "" });

  const load = useCallback(async () => {
    try {
      const list = await listConversations();
      setConversations(list);
      setStatus("ready");
      setActiveId((cur) => cur ?? list[0]?.id ?? null);
    } catch {
      setStatus("error");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Admins: refresh the inbox list when anything lands on the studio channel.
  useEffect(() => {
    if (!isAdmin) return;
    let channel;
    try {
      channel = getEcho().private("studio");
      // Booking + message activity both warrant a list refresh.
      channel.listen(".booking.status", () => load());
    } catch { /* optional */ }
    return () => { channel?.stopListening(".booking.status"); };
  }, [isAdmin, load]);

  const create = async () => {
    if (!draft.body.trim()) return;
    const convo = await startConversation({ subject: draft.subject || "New conversation", body: draft.body });
    setComposing(false);
    setDraft({ subject: "", body: "" });
    await load();
    setActiveId(convo.id);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 280px) 1fr", gap: 16, alignItems: "start" }}>
      {/* List */}
      <div>
        {canStart && (
          <button onClick={() => setComposing((c) => !c)} data-hover
            style={{ width: "100%", background: composing ? colors.surface : colors.accent, color: composing ? colors.text : "#000", border: composing ? `1px solid ${colors.border}` : "none", borderRadius: 8, padding: "10px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: "pointer", marginBottom: 12 }}>
            {composing ? "CANCEL" : "+ NEW MESSAGE"}
          </button>
        )}

        {composing && (
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, marginBottom: 12, background: colors.surface }}>
            <input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Subject"
              style={inp} />
            <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Your message…" rows={3}
              style={{ ...inp, resize: "vertical" }} />
            <button onClick={create} data-hover style={{ width: "100%", background: colors.accent, color: "#000", border: "none", borderRadius: 7, padding: "9px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              START
            </button>
          </div>
        )}

        {status === "loading" && <Muted text="Loading…" />}
        {status === "ready" && conversations.length === 0 && <Muted text="No conversations yet." />}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} data-hover
              style={{ textAlign: "left", background: activeId === c.id ? colors.surface : "transparent", border: `1px solid ${activeId === c.id ? colors.accent + "55" : colors.border}`, borderRadius: 10, padding: "11px 13px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {isAdmin ? (c.client?.name ?? "Client") : (c.subject || "Conversation")}
                </span>
                {c.unread_count > 0 && (
                  <span style={{ background: colors.accent, color: "#000", borderRadius: 10, fontSize: 9, fontWeight: 700, padding: "1px 7px", fontFamily: fonts.mono }}>{c.unread_count}</span>
                )}
              </div>
              {isAdmin && <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginTop: 2 }}>{c.subject}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Active thread */}
      <div>
        {activeId
          ? <ChatPanel conversationId={activeId} />
          : <div style={{ border: `1px solid ${colors.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}><Muted text="Select a conversation." /></div>}
      </div>
    </div>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
const inp = { width: "100%", background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: "9px 11px", borderRadius: 7, fontFamily: fonts.mono, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 };
