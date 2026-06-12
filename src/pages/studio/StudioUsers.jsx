import { useCallback, useEffect, useState } from "react";
import { adminListUsers, adminGetUser, adminUpdateUser, adminDeleteUser } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

const ROLES = ["viewer", "client", "admin"];

export default function StudioUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [expanded, setExpanded] = useState(null); // user id → login logs view
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await adminListUsers(search ? { search } : {});
      setUsers(res.data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [search]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const patch = async (id, payload) => {
    setBusy(id);
    try {
      const updated = await adminUpdateUser(id, payload);
      setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed.");
    }
    setBusy(null);
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}? This soft-deletes the account.`)) return;
    setBusy(u.id);
    try {
      await adminDeleteUser(u.id);
      setUsers((list) => list.filter((x) => x.id !== u.id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed.");
    }
    setBusy(null);
  };

  const toggleLogs = async (u) => {
    if (expanded === u.id) { setExpanded(null); return; }
    setExpanded(u.id);
    setDetail(null);
    try { setDetail(await adminGetUser(u.id)); } catch { /* ignore */ }
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>USERS</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH NAME / EMAIL…"
          style={{ background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, padding: "10px 14px", borderRadius: 8, fontFamily: fonts.mono, fontSize: 12, outline: "none", minWidth: 240 }} />
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load users." />}
      {status === "ready" && users.length === 0 && <Muted text="No users match." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map((u) => (
          <div key={u.id} style={{ border: `1px solid ${u.is_active ? colors.border : colors.pink + "55"}`, borderRadius: 12, background: colors.surface, opacity: busy === u.id ? 0.5 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "16px 18px" }}>
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.text, fontWeight: 700 }}>
                  {u.name} {!u.is_active && <Tag text="BLOCKED" tone={colors.pink} />}
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint }}>{u.email}{u.company ? ` · ${u.company}` : ""}</div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, marginTop: 3 }}>
                  last login: {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "never"}
                </div>
              </div>

              <select value={u.role} onChange={(e) => patch(u.id, { role: e.target.value })}
                style={{ background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "7px 10px", fontFamily: fonts.mono, fontSize: 11, cursor: "pointer" }}>
                {ROLES.map((r) => <option key={r} value={r}>{r.toUpperCase()}</option>)}
              </select>

              <Action label={u.is_active ? "BLOCK" : "UNBLOCK"} tone={u.is_active ? colors.pink : colors.accent}
                onClick={() => patch(u.id, { is_active: !u.is_active })} />
              <Action label="LOGINS" tone={colors.textMuted} onClick={() => toggleLogs(u)} />
              <Action label="DELETE" tone={colors.pink} onClick={() => remove(u)} />
            </div>

            {expanded === u.id && (
              <div style={{ borderTop: `1px solid ${colors.border}`, padding: "14px 18px" }}>
                {!detail && <Muted text="Loading login history…" />}
                {detail && (detail.login_logs ?? []).length === 0 && <Muted text="No logins recorded." />}
                {detail && (detail.login_logs ?? []).map((l) => (
                  <div key={l.id} style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, padding: "4px 0" }}>
                    <span style={{ color: colors.textFaint }}>{new Date(l.created_at).toLocaleString()}</span>
                    <span>{l.ip_address}</span>
                    <span>{l.browser} · {l.platform} · {l.device}</span>
                    <span style={{ color: colors.accentText }}>{[l.city, l.country].filter(Boolean).join(", ") || "location n/a"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Action({ label, tone, onClick }) {
  return (
    <button onClick={onClick} data-hover
      style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: 700, color: tone, background: "transparent", border: `1px solid ${tone}66`, padding: "7px 12px", borderRadius: 6, cursor: "pointer" }}>
      {label}
    </button>
  );
}

function Tag({ text, tone }) {
  return <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: tone, border: `1px solid ${tone}55`, padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>{text}</span>;
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
