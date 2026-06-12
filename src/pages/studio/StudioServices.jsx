import { useCallback, useEffect, useState } from "react";
import { adminListServices, createService, updateService, deleteService } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

const BLANK = { name: "", icon_glyph: "◆", short_desc: "", full_desc: "", starting_price: "", price_label: "", deliverables: "", is_active: true, sort_order: 0 };

export default function StudioServices() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(null); // service object or BLANK (new)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setServices(await adminListServices());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setError(""); setEditing({ ...BLANK }); };
  const openEdit = (s) => {
    setError("");
    setEditing({ ...s, starting_price: s.starting_price ?? "", deliverables: (s.deliverables ?? []).join(", ") });
  };

  const save = async () => {
    setSaving(true);
    setError("");
    const payload = {
      ...editing,
      starting_price: editing.starting_price === "" ? null : Number(editing.starting_price),
      deliverables: editing.deliverables
        ? editing.deliverables.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editing.id) await updateService(editing.id, payload);
      else await createService(payload);
      setEditing(null);
      await load();
    } catch (e) {
      const d = e?.response?.data;
      setError(d?.errors ? Object.values(d.errors).flat().join(" ") : d?.message || "Save failed.");
    }
    setSaving(false);
  };

  const remove = async (s) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    await deleteService(s.id);
    load();
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>SERVICES</h1>
        <button onClick={openNew} data-hover style={{ ...btn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>+ NEW SERVICE</button>
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load services." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {services.map((s) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", border: `1px solid ${s.is_active ? colors.border : colors.borderSoft}`, borderRadius: 12, background: colors.surface, padding: "16px 18px", opacity: s.is_active ? 1 : 0.6 }}>
            <span style={{ fontSize: 22, color: colors.accentText }}>{s.icon_glyph || "◆"}</span>
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.text, fontWeight: 700 }}>
                {s.name} {!s.is_active && <Tag text="INACTIVE" />}
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint }}>{s.short_desc}</div>
            </div>
            <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>
              {s.price_label || (s.starting_price ? `From $${Number(s.starting_price).toLocaleString()}` : "—")}
            </span>
            <button onClick={() => openEdit(s)} data-hover style={btn}>EDIT</button>
            <button onClick={() => remove(s)} data-hover style={{ ...btn, color: colors.pink, borderColor: colors.pink + "66" }}>DELETE</button>
          </div>
        ))}
      </div>

      {editing && (
        <div onClick={() => !saving && setEditing(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 100%)", maxHeight: "90vh", overflowY: "auto", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontFamily: fonts.display, fontSize: 30, letterSpacing: 1, margin: "0 0 20px" }}>{editing.id ? "EDIT SERVICE" : "NEW SERVICE"}</h2>
            <div style={{ display: "grid", gap: 14 }}>
              <Field label="NAME"><input value={editing.name} onChange={set(setEditing, "name")} style={input} /></Field>
              <div style={{ display: "flex", gap: 14 }}>
                <Field label="ICON" style={{ width: 90 }}><input value={editing.icon_glyph ?? ""} onChange={set(setEditing, "icon_glyph")} style={input} /></Field>
                <Field label="SORT"><input type="number" value={editing.sort_order ?? 0} onChange={set(setEditing, "sort_order")} style={input} /></Field>
              </div>
              <Field label="SHORT DESCRIPTION"><input value={editing.short_desc} onChange={set(setEditing, "short_desc")} style={input} /></Field>
              <Field label="FULL DESCRIPTION"><textarea rows={3} value={editing.full_desc ?? ""} onChange={set(setEditing, "full_desc")} style={{ ...input, resize: "vertical" }} /></Field>
              <div style={{ display: "flex", gap: 14 }}>
                <Field label="STARTING PRICE ($)"><input type="number" value={editing.starting_price} onChange={set(setEditing, "starting_price")} style={input} /></Field>
                <Field label="PRICE LABEL"><input value={editing.price_label ?? ""} onChange={set(setEditing, "price_label")} placeholder="From $2,400" style={input} /></Field>
              </div>
              <Field label="DELIVERABLES (comma-separated)"><input value={editing.deliverables} onChange={set(setEditing, "deliverables")} style={input} /></Field>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, cursor: "pointer" }}>
                <input type="checkbox" checked={!!editing.is_active} onChange={(e) => setEditing((s) => ({ ...s, is_active: e.target.checked }))} /> ACTIVE (shown on the public site)
              </label>
            </div>
            {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, marginTop: 14 }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button onClick={() => setEditing(null)} disabled={saving} data-hover style={btn}>CANCEL</button>
              <button onClick={save} disabled={saving || !editing.name || !editing.short_desc} data-hover style={{ ...btn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>{saving ? "SAVING…" : "SAVE"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const set = (setter, key) => (e) => setter((s) => ({ ...s, [key]: e.target.value }));

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, color: colors.textFaint, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const input = { width: "100%", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "11px 13px", color: colors.text, fontSize: 13, fontFamily: fonts.mono, outline: "none", boxSizing: "border-box" };
const btn = { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 14px", borderRadius: 8, cursor: "pointer" };

function Tag({ text }) {
  return <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>{text}</span>;
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
