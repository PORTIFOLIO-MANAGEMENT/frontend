import { useEffect, useRef, useState, useCallback } from "react";
import { getConversation, sendMessage } from "../services/chat";
import { getEcho } from "../services/echo";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../styles/theme";

// Reusable client<->studio chat thread with live updates over the
// conversation's private Reverb channel. Used in both the client dashboard
// and the studio inbox.
export default function ChatPanel({ conversationId, height = 460 }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const scrollDown = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const convo = await getConversation(conversationId);
      setMessages(convo.messages ?? []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [conversationId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  useEffect(() => { scrollDown(); }, [messages]);

  // Live: append messages from the other party (dedupe by id).
  useEffect(() => {
    if (!conversationId) return;
    let channel;
    try {
      channel = getEcho().private(`conversation.${conversationId}`);
      channel.listen(".message.sent", (e) => {
        setMessages((cur) => (cur.some((m) => m.id === e.id) ? cur : [...cur, {
          id: e.id, body: e.body, sender_user_id: e.sender_user_id,
          sender_is_admin: e.sender_is_admin, sender_name: e.sender_name,
          mine: e.sender_user_id === user?.id, created_at: e.created_at,
        }]));
      });
    } catch { /* websocket optional */ }
    return () => { channel?.stopListening(".message.sent"); };
  }, [conversationId, user]);

  const submit = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setBody("");
    try {
      const msg = await sendMessage(conversationId, text);
      setMessages((cur) => (cur.some((m) => m.id === msg.id) ? cur : [...cur, { ...msg, mine: true }]));
    } catch {
      setBody(text); // restore on failure
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: "hidden", background: colors.surface }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {status === "loading" && <Sys text="Loading…" />}
        {status === "error" && <Sys text="Couldn't load the conversation." />}
        {status === "ready" && messages.length === 0 && <Sys text="No messages yet — say hello." />}
        {messages.map((m) => <Bubble key={m.id} message={m} />)}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${colors.border}` }}>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message…"
          style={{ flex: 1, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: "11px 14px", borderRadius: 8, fontFamily: fonts.mono, fontSize: 13, outline: "none" }} />
        <button type="submit" disabled={sending || !body.trim()} data-hover
          style={{ background: colors.accent, color: "#000", border: "none", borderRadius: 8, padding: "0 18px", fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", opacity: sending || !body.trim() ? 0.5 : 1 }}>
          SEND
        </button>
      </form>
    </div>
  );
}

function Bubble({ message }) {
  const mine = message.mine;
  return (
    <div style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
      <div style={{
        background: mine ? colors.accent : "#1a1a1a", color: mine ? "#000" : colors.text,
        padding: "10px 14px", borderRadius: 14, borderBottomRightRadius: mine ? 4 : 14, borderBottomLeftRadius: mine ? 14 : 4,
        fontFamily: fonts.mono, fontSize: 13, lineHeight: 1.5, wordBreak: "break-word",
      }}>
        {message.body}
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint, marginTop: 3, textAlign: mine ? "right" : "left" }}>
        {mine ? "You" : (message.sender_is_admin ? `${message.sender_name ?? "Studio"} · STUDIO` : message.sender_name)}
      </div>
    </div>
  );
}

function Sys({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, textAlign: "center", margin: "auto" }}>{text}</p>;
}
