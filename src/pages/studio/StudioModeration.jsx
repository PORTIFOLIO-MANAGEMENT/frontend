import { useCallback, useEffect, useState } from "react";
import { adminListComments, moderateComment } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

// Studio comment moderation queue. Toggle between every comment and the
// pending (hidden) ones; approve/hide and pin/unpin inline.
export default function StudioModeration() {
  const [filter, setFilter] = useState("all"); // all | pending
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setComments(await adminListComments({ pending: filter === "pending" }));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const act = async (id, payload) => {
    setBusy(id);
    try {
      const updated = await moderateComment(id, payload);
      // Drop from the list when it no longer matches the active filter.
      setComments((list) =>
        list
          .map((c) => (c.id === id ? { ...c, ...updated } : c))
          .filter((c) => (filter === "pending" ? !c.is_approved : true))
      );
    } catch {
      /* surfaced by the row staying put */
    }
    setBusy(null);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>MODERATION</h1>
        <div role="tablist" aria-label="Comment filter" style={{ display: "flex", border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
          {["all", "pending"].map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} data-hover
              style={{
                background: filter === f ? colors.accent : "transparent",
                color: filter === f ? "#000" : colors.textMuted,
                border: "none", padding: "8px 16px", cursor: "pointer",
                fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: filter === f ? 700 : 400,
              }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load comments." />}
      {status === "ready" && comments.length === 0 && (
        <Muted text={filter === "pending" ? "Nothing pending — all clear." : "No comments yet."} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((c) => (
          <article key={c.id} style={{
            border: `1px solid ${c.is_approved ? colors.border : colors.pink + "66"}`,
            borderRadius: 12, padding: "16px 18px", background: colors.surface,
            opacity: busy === c.id ? 0.5 : 1, transition: "opacity 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.text, fontWeight: 700 }}>
                {c.author?.name ?? "Unknown"}
              </span>
              {c.author?.is_admin && <Tag text="STUDIO" tone={colors.accent} />}
              {!c.is_approved && <Tag text="HIDDEN" tone={colors.pink} />}
              {c.is_pinned && <Tag text="PINNED" tone={colors.accent} />}
              {c.project && (
                <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint }}>
                  on {c.project.title}
                </span>
              )}
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginLeft: "auto" }}>
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, lineHeight: 1.6, color: colors.textMuted, margin: "0 0 14px" }}>
              {c.content}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Action
                label={c.is_approved ? "HIDE" : "APPROVE"}
                tone={c.is_approved ? colors.pink : colors.accent}
                disabled={busy === c.id}
                onClick={() => act(c.id, { is_approved: !c.is_approved })}
              />
              <Action
                label={c.is_pinned ? "UNPIN" : "PIN"}
                tone={colors.textMuted}
                disabled={busy === c.id}
                onClick={() => act(c.id, { is_pinned: !c.is_pinned })}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Action({ label, tone, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} data-hover
      style={{
        fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: 700,
        color: tone, background: "transparent", border: `1px solid ${tone}66`,
        padding: "7px 14px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
      }}>
      {label}
    </button>
  );
}

function Tag({ text, tone }) {
  return (
    <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: tone, border: `1px solid ${tone}55`, padding: "2px 6px", borderRadius: 4 }}>
      {text}
    </span>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
