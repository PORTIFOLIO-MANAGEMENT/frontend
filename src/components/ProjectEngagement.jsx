import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getReactions, toggleReaction, getComments, postComment, likeComment, deleteComment, REACTIONS,
} from "../services/engagement";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../styles/theme";

export default function ProjectEngagement({ slug, accent = colors.accent }) {
  return (
    <section style={{ marginTop: 56, borderTop: `1px solid ${colors.border}`, paddingTop: 32 }}>
      <Reactions slug={slug} accent={accent} />
      <Comments slug={slug} accent={accent} />
    </section>
  );
}

function Reactions({ slug, accent }) {
  const [data, setData] = useState({ counts: {}, mine: [] });

  const load = useCallback(async () => {
    try { setData(await getReactions(slug)); } catch { /* ignore */ }
  }, [slug]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const toggle = async (type) => {
    setData(await toggleReaction(slug, type)); // optimistic via server truth
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: accent, margin: "0 0 16px" }}>REACTIONS</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {REACTIONS.map((r) => {
          const active = data.mine?.includes(r.type);
          return (
            <button key={r.type} onClick={() => toggle(r.type)} data-hover
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 30, cursor: "pointer",
                background: active ? accent : "transparent", color: active ? "#000" : colors.textMuted,
                border: `1px solid ${active ? accent : colors.border}`, fontFamily: fonts.mono, fontSize: 12, fontWeight: active ? 700 : 400 }}>
              <span>{r.glyph}</span>
              <span>{r.label}</span>
              <span style={{ opacity: 0.7 }}>{data.counts?.[r.type] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Comments({ slug, accent }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setComments(await getComments(slug)); setStatus("ready"); }
    catch { setStatus("error"); }
  }, [slug]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await postComment(slug, { content: text.trim(), mode: "general" });
      setText("");
      await load();
    } finally { setBusy(false); }
  };

  return (
    <div>
      <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: accent, margin: "0 0 16px" }}>
        DISCUSSION {status === "ready" ? `(${comments.length})` : ""}
      </h2>

      {isAuthenticated ? (
        <form onSubmit={submit} style={{ marginBottom: 28 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Add to the discussion…"
            style={{ width: "100%", background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, padding: "13px 14px", borderRadius: 10, fontFamily: fonts.mono, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
          <button type="submit" disabled={busy || !text.trim()} data-hover
            style={{ marginTop: 8, background: accent, color: "#000", border: "none", borderRadius: 8, padding: "10px 18px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: "pointer", opacity: busy || !text.trim() ? 0.5 : 1 }}>
            POST
          </button>
        </form>
      ) : (
        <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginBottom: 28 }}>
          <Link to="/login" style={{ color: accent }}>Log in</Link> to join the discussion.
        </p>
      )}

      {status === "loading" && <Muted text="Loading…" />}
      {status === "ready" && comments.length === 0 && <Muted text="No comments yet — be the first." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} currentUser={user} onChanged={load} accent={accent} slug={slug} />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, currentUser, onChanged, accent, slug, depth = 0 }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(comment.liked_by_me);
  const [count, setCount] = useState(comment.like_count);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");

  const like = async () => {
    const updated = await likeComment(comment.id);
    setLiked(updated.liked_by_me);
    setCount(updated.like_count);
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await postComment(slug, { content: reply.trim(), parent_id: comment.id, mode: "general" });
    setReply("");
    setReplying(false);
    onChanged();
  };

  const canDelete = currentUser && (currentUser.id === comment.author?.id || currentUser.role === "admin");

  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.text }}>{comment.author?.name ?? "User"}</span>
          {comment.author?.is_admin && <span style={{ fontFamily: fonts.mono, fontSize: 9, color: "#000", background: accent, padding: "1px 6px", borderRadius: 4, letterSpacing: 1 }}>STUDIO</span>}
          {comment.mode && comment.mode !== "general" && <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "1px 6px", borderRadius: 4 }}>{comment.mode.toUpperCase()}</span>}
        </div>
        <p style={{ fontFamily: fonts.mono, fontSize: 13, lineHeight: 1.6, color: colors.textMuted, margin: "0 0 10px", whiteSpace: "pre-wrap" }}>{comment.content}</p>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button onClick={like} disabled={!isAuthenticated} data-hover
            style={{ background: "transparent", border: "none", cursor: isAuthenticated ? "pointer" : "default", color: liked ? accent : colors.textMuted, fontFamily: fonts.mono, fontSize: 11 }}>
            ♥ {count}
          </button>
          {isAuthenticated && depth === 0 && (
            <button onClick={() => setReplying((r) => !r)} data-hover style={linkBtn}>REPLY</button>
          )}
          {canDelete && (
            <button onClick={async () => { await deleteComment(comment.id); onChanged(); }} data-hover style={{ ...linkBtn, color: colors.pink }}>DELETE</button>
          )}
        </div>

        {replying && (
          <form onSubmit={sendReply} style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply…"
              style={{ flex: 1, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: "9px 12px", borderRadius: 8, fontFamily: fonts.mono, fontSize: 12, outline: "none" }} />
            <button type="submit" data-hover style={{ background: accent, color: "#000", border: "none", borderRadius: 8, padding: "0 14px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>SEND</button>
          </form>
        )}
      </div>

      {(comment.replies ?? []).map((r) => (
        <div key={r.id} style={{ marginTop: 10 }}>
          <CommentItem comment={r} currentUser={currentUser} onChanged={onChanged} accent={accent} slug={slug} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
const linkBtn = { background: "transparent", border: "none", cursor: "pointer", color: colors.textMuted, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, padding: 0 };
