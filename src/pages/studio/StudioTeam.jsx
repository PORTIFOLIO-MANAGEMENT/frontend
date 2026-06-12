import { useCallback, useEffect, useRef, useState } from "react";
import { adminListTeam, createTeamMember, updateTeamMember, deleteTeamMember, uploadTeamAvatar } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

const ROLES = ["developer", "designer", "director"];
const BLANK = { display_name: "", team_role: "developer", tagline: "", bio: "", skills: "", social_links: "", is_public: true, sort_order: 0 };

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "·";

// social_links is a {label:url} object in the API; edit it as "label: url" lines.
const linksToText = (obj = {}) => Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join("\n");
const textToLinks = (text = "") =>
  Object.fromEntries(
    text.split("\n").map((l) => l.split(/:(.+)/)).filter((p) => p[0]?.trim() && p[1]?.trim())
      .map(([k, v]) => [k.trim(), v.trim()])
  );

export default function StudioTeam() {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setMembers(await adminListTeam());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const remove = async (m) => {
    if (!confirm(`Remove ${m.display_name} from the team?`)) return;
    await deleteTeamMember(m.id);
    load();
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>TEAM</h1>
        <button onClick={() => setEditing({ ...BLANK })} data-hover style={{ ...btn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>+ NEW MEMBER</button>
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load team." />}
      {status === "ready" && members.length === 0 && <Muted text="No team members yet — click + NEW MEMBER." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {members.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", border: `1px solid ${m.is_public ? colors.border : colors.borderSoft}`, borderRadius: 12, background: colors.surface, padding: "14px 16px", opacity: m.is_public ? 1 : 0.6 }}>
            <Avatar src={m.avatar_url} name={m.display_name} />
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.text, fontWeight: 700 }}>
                {m.display_name} {!m.is_public && <Tag text="HIDDEN" />}
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accentText, letterSpacing: 1 }}>{(m.team_role ?? "").toUpperCase()}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint }}>{m.tagline}</div>
            </div>
            <button onClick={() => setEditing({ ...m, skills: (m.skills ?? []).join(", "), social_links: linksToText(m.social_links) })} data-hover style={btn}>EDIT</button>
            <button onClick={() => remove(m)} data-hover style={{ ...btn, color: colors.pink, borderColor: colors.pink + "66" }}>DELETE</button>
          </div>
        ))}
      </div>

      {editing && <MemberModal initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function MemberModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const persist = async () => {
    const payload = {
      display_name: form.display_name,
      team_role: form.team_role,
      tagline: form.tagline || null,
      bio: form.bio || null,
      skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      social_links: textToLinks(form.social_links),
      is_public: !!form.is_public,
      sort_order: Number(form.sort_order) || 0,
    };
    if (form.id) return updateTeamMember(form.id, payload);
    return createTeamMember(payload);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const saved = await persist();
      // If a file is queued and the member is new, upload after creation.
      if (fileRef.current?.files?.[0]) {
        setUploading(true);
        await uploadTeamAvatar(saved.id, fileRef.current.files[0]);
      }
      onSaved();
    } catch (e) {
      const d = e?.response?.data;
      setError(d?.errors ? Object.values(d.errors).flat().join(" ") : d?.message || "Save failed.");
      setSaving(false);
      setUploading(false);
    }
  };

  // For an existing member, upload immediately so the preview reflects it.
  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !form.id) return;
    setUploading(true);
    setError("");
    try {
      const updated = await uploadTeamAvatar(form.id, file);
      setForm((f) => ({ ...f, avatar_url: updated.avatar_url }));
    } catch {
      setError("Avatar upload failed.");
    }
    setUploading(false);
  };

  return (
    <div onClick={() => !saving && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 100%)", maxHeight: "90vh", overflowY: "auto", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: fonts.display, fontSize: 30, letterSpacing: 1, margin: "0 0 20px" }}>{form.id ? "EDIT MEMBER" : "NEW MEMBER"}</h2>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <Avatar src={form.avatar_url} name={form.display_name} size={72} />
          <div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPickFile}
              style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }} />
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint, marginTop: 4 }}>
              {uploading ? "Uploading…" : form.id ? "PNG/JPG/WEBP, ≤4MB — uploads immediately." : "Choose now; it uploads after you save."}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <Field label="DISPLAY NAME"><input value={form.display_name} onChange={set("display_name")} style={input} /></Field>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Field label="ROLE" grow>
              <select value={form.team_role} onChange={set("team_role")} style={input}>
                {ROLES.map((r) => <option key={r} value={r}>{r.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="SORT"><input type="number" value={form.sort_order} onChange={set("sort_order")} style={input} /></Field>
          </div>
          <Field label="TAGLINE"><input value={form.tagline ?? ""} onChange={set("tagline")} style={input} /></Field>
          <Field label="BIO"><textarea rows={3} value={form.bio ?? ""} onChange={set("bio")} style={{ ...input, resize: "vertical" }} /></Field>
          <Field label="SKILLS (comma-separated)"><input value={form.skills} onChange={set("skills")} placeholder="React, Blender, Figma" style={input} /></Field>
          <Field label="SOCIAL LINKS (one per line — label: url)"><textarea rows={3} value={form.social_links} onChange={set("social_links")} placeholder={"github: https://github.com/you\nbehance: https://behance.net/you"} style={{ ...input, resize: "vertical" }} /></Field>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, cursor: "pointer" }}>
            <input type="checkbox" checked={!!form.is_public} onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.checked }))} /> SHOW ON THE PUBLIC SITE
          </label>
        </div>

        {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, marginTop: 14 }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} disabled={saving} data-hover style={btn}>CANCEL</button>
          <button onClick={save} disabled={saving || !form.display_name} data-hover style={{ ...btn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>{saving ? "SAVING…" : "SAVE"}</button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, name, size = 44 }) {
  const [ok, setOk] = useState(true);
  if (src && ok) {
    return <img src={src} alt={name} onError={() => setOk(false)} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `1px solid ${colors.border}`, flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: colors.accent + "1a", border: `1px solid ${colors.accent}55`, fontFamily: fonts.display, fontSize: size / 2.6, color: colors.accentText }}>
      {initials(name)}
    </div>
  );
}

function Field({ label, children, grow }) {
  return (
    <div style={{ flex: grow ? "1 1 200px" : undefined }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, color: colors.textFaint, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const input = { width: "100%", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "11px 13px", color: colors.text, fontSize: 13, fontFamily: fonts.mono, outline: "none", boxSizing: "border-box" };
const btn = { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "9px 14px", borderRadius: 8, cursor: "pointer" };

function Tag({ text }) {
  return <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>{text}</span>;
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
