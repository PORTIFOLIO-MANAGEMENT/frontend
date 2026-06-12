import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminListProjects, adminGetProject, updateProject, createProject } from "../../services/admin";
import { CATEGORY_LABELS } from "../../services/projects";
import MediaManager from "./MediaManager";
import StudioBookings from "./StudioBookings";
import StudioModeration from "./StudioModeration";
import StudioUsers from "./StudioUsers";
import StudioServices from "./StudioServices";
import StudioTeam from "./StudioTeam";
import StudioAnalytics from "./StudioAnalytics";
import MessagesPanel from "../../components/MessagesPanel";
import { colors, fonts } from "../../styles/theme";

export default function StudioPage() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("projects"); // projects | bookings | inbox | moderation
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  const [creating, setCreating] = useState(false);

  const loadList = useCallback(async () => {
    setStatus("loading");
    try {
      const list = await adminListProjects();
      setProjects(list);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  // Initial project list load on mount (syncing UI with the API).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadList(); }, [loadList]);

  const openProject = async (slug) => {
    setSelected({ loading: true });
    const full = await adminGetProject(slug);
    setSelected(full);
  };

  const toggle = async (field, value) => {
    const updated = await updateProject(selected.slug, { [field]: value });
    setSelected((s) => ({ ...s, ...updated }));
    loadList();
  };

  return (
    <main style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
      {/* Top bar */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ fontFamily: fonts.display, fontSize: 22, letterSpacing: 3, color: colors.text, textDecoration: "none" }}>
            C2<span style={{ color: colors.accentText }}>.</span>Y
          </Link>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.textMuted }}>STUDIO CONSOLE</span>
          <nav style={{ display: "flex", gap: 4, marginLeft: 12 }}>
            {["projects", "bookings", "inbox", "moderation", "users", "services", "team", "analytics"].map((v) => (
              <button key={v} onClick={() => setView(v)} data-hover
                style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                  background: view === v ? colors.accent : "transparent", color: view === v ? "#000" : colors.textMuted,
                  border: `1px solid ${view === v ? colors.accent : colors.border}`, fontWeight: view === v ? 700 : 400 }}>
                {v.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>{user?.name}</span>
          <button onClick={logout} data-hover style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>
            LOG OUT
          </button>
        </div>
      </header>

      {view === "moderation" ? (
        <StudioModeration />
      ) : view === "users" ? (
        <StudioUsers />
      ) : view === "services" ? (
        <StudioServices />
      ) : view === "team" ? (
        <StudioTeam />
      ) : view === "analytics" ? (
        <StudioAnalytics />
      ) : view === "inbox" ? (
        <div style={{ padding: 28 }}>
          <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: "0 0 24px" }}>INBOX</h1>
          <MessagesPanel />
        </div>
      ) : view === "bookings" ? (
        <div style={{ padding: 28 }}>
          <StudioBookings />
        </div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr", gap: 0, minHeight: "calc(100vh - 65px)" }}>
        {/* Project list */}
        <aside style={{ borderRight: `1px solid ${colors.border}`, padding: 20, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 14px" }}>
            <p style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.textFaint, margin: 0 }}>PROJECTS</p>
            <button onClick={() => setCreating(true)} data-hover
              style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: 700, color: "#000", background: colors.accent, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
              + NEW
            </button>
          </div>
          {status === "loading" && <Muted text="Loading…" />}
          {status === "error" && <Muted text="Failed to load." />}
          {status === "ready" && projects.length === 0 && <Muted text="No projects yet — click + NEW to publish your first." />}
          {status === "ready" && projects.map((p) => (
            <button key={p.id} onClick={() => openProject(p.slug)} data-hover
              style={{
                display: "block", width: "100%", textAlign: "left", marginBottom: 8,
                background: selected?.id === p.id ? colors.surface : "transparent",
                border: `1px solid ${selected?.id === p.id ? colors.accent + "55" : colors.border}`,
                borderRadius: 10, padding: "12px 14px", cursor: "pointer", color: colors.text,
              }}>
              <div style={{ fontFamily: fonts.display, fontSize: 18, letterSpacing: 1 }}>{p.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <Badge text={p.status} tone={p.status === "published" ? colors.accent : colors.textMuted} />
                <Badge text={p.visibility} tone={p.visibility === "private" ? colors.pink : colors.textMuted} />
                <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint, alignSelf: "center" }}>{p.media_count ?? 0} media</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Detail / media manager */}
        <section style={{ padding: 28, overflowY: "auto" }}>
          {!selected && <Muted text="← Select a project to manage its media." />}
          {selected?.loading && <Muted text="Loading project…" />}
          {selected && !selected.loading && (
            <>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>{selected.title}</h1>
                <Link to={`/work/${selected.slug}`} data-hover style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accentText, textDecoration: "none" }}>
                  VIEW PUBLIC ↗
                </Link>
              </div>

              {/* Quick toggles */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "20px 0 32px" }}>
                <Segmented label="STATUS" value={selected.status}
                  options={["draft", "published", "archived"]} onChange={(v) => toggle("status", v)} />
                <Segmented label="VISIBILITY" value={selected.visibility}
                  options={["public", "private"]} onChange={(v) => toggle("visibility", v)} />
                <Segmented label="FEATURED" value={selected.is_featured ? "yes" : "no"}
                  options={["no", "yes"]} onChange={(v) => toggle("is_featured", v === "yes")} />
              </div>

              <MediaManager project={selected} onChanged={(full) => { setSelected(full); loadList(); }} />
            </>
          )}
        </section>
      </div>
      )}

      {creating && (
        <NewProjectModal
          onClose={() => setCreating(false)}
          onCreated={async (project) => {
            setCreating(false);
            await loadList();
            openProject(project.slug);
          }}
        />
      )}
    </main>
  );
}

const NEW_PROJECT = {
  title: "", category: "full_stack", tagline: "", description: "",
  status: "draft", visibility: "public", year: new Date().getFullYear(),
  client_name: "", color_accent: "", cover_image_url: "", live_url: "", repo_url: "", tags: "",
};

function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState(NEW_PROJECT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      category: form.category,
      tagline: form.tagline || null,
      description: form.description || null,
      status: form.status,
      visibility: form.visibility,
      year: form.year ? Number(form.year) : null,
      client_name: form.client_name || null,
      color_accent: form.color_accent || null,
      cover_image_url: form.cover_image_url || null,
      live_url: form.live_url || null,
      repo_url: form.repo_url || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      const project = await createProject(payload);
      onCreated(project);
    } catch (e) {
      const d = e?.response?.data;
      setError(d?.errors ? Object.values(d.errors).flat().join(" ") : d?.message || "Create failed.");
      setSaving(false);
    }
  };

  return (
    <div onClick={() => !saving && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(620px, 100%)", maxHeight: "90vh", overflowY: "auto", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: fonts.display, fontSize: 32, letterSpacing: 1, margin: "0 0 20px" }}>NEW PROJECT</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <PField label="TITLE *"><input value={form.title} onChange={set("title")} style={pInput} /></PField>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <PField label="CATEGORY *" grow>
              <select value={form.category} onChange={set("category")} style={pInput}>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </PField>
            <PField label="YEAR"><input type="number" value={form.year} onChange={set("year")} style={pInput} /></PField>
          </div>
          <PField label="TAGLINE"><input value={form.tagline} onChange={set("tagline")} style={pInput} /></PField>
          <PField label="DESCRIPTION"><textarea rows={3} value={form.description} onChange={set("description")} style={{ ...pInput, resize: "vertical" }} /></PField>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <PField label="STATUS" grow>
              <select value={form.status} onChange={set("status")} style={pInput}>
                <option value="draft">DRAFT</option><option value="published">PUBLISHED</option>
              </select>
            </PField>
            <PField label="VISIBILITY" grow>
              <select value={form.visibility} onChange={set("visibility")} style={pInput}>
                <option value="public">PUBLIC</option><option value="private">PRIVATE</option>
              </select>
            </PField>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <PField label="CLIENT NAME" grow><input value={form.client_name} onChange={set("client_name")} style={pInput} /></PField>
            <PField label="ACCENT (#hex)"><input value={form.color_accent} onChange={set("color_accent")} placeholder="#C8F53B" style={pInput} /></PField>
          </div>
          <PField label="COVER IMAGE URL"><input value={form.cover_image_url} onChange={set("cover_image_url")} placeholder="https://…" style={pInput} /></PField>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <PField label="LIVE URL" grow><input value={form.live_url} onChange={set("live_url")} style={pInput} /></PField>
            <PField label="REPO URL" grow><input value={form.repo_url} onChange={set("repo_url")} style={pInput} /></PField>
          </div>
          <PField label="TAGS (comma-separated)"><input value={form.tags} onChange={set("tags")} placeholder="react, laravel, 3d" style={pInput} /></PField>
        </div>
        {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, marginTop: 14 }}>{error}</p>}
        <p style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginTop: 14, lineHeight: 1.6 }}>
          After creating, open the project to upload a cover image, media and 3D models.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} disabled={saving} data-hover style={pBtn}>CANCEL</button>
          <button onClick={save} disabled={saving || !form.title} data-hover style={{ ...pBtn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>{saving ? "CREATING…" : "CREATE"}</button>
        </div>
      </div>
    </div>
  );
}

function PField({ label, children, grow }) {
  return (
    <div style={{ flex: grow ? "1 1 200px" : undefined }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, color: colors.textFaint, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const pInput = { width: "100%", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "11px 13px", color: colors.text, fontSize: 13, fontFamily: fonts.mono, outline: "none", boxSizing: "border-box" };
const pBtn = { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "9px 16px", borderRadius: 8, cursor: "pointer" };

function Segmented({ label, value, options, onChange }) {
  return (
    <div>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, color: colors.textFaint, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} data-hover
            style={{
              background: value === o ? colors.accent : "transparent",
              color: value === o ? "#000" : colors.textMuted,
              border: "none", padding: "8px 12px", cursor: "pointer",
              fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: value === o ? 700 : 400,
            }}>
            {o.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function Badge({ text, tone }) {
  return (
    <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: tone, border: `1px solid ${tone}55`, padding: "2px 6px", borderRadius: 4 }}>
      {(text ?? "").toUpperCase()}
    </span>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
