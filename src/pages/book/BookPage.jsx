import { useState } from "react";
import { Link } from "react-router-dom";
import { listServices } from "../../services/projects";
import { createBooking, BUDGET_OPTIONS, TIMELINE_OPTIONS } from "../../services/bookings";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts } from "../../styles/theme";

const STEPS = ["SERVICE", "SCOPE", "DETAILS", "CONTACT", "REVIEW"];

export default function BookPage() {
  const { user } = useAuth();
  const { data: services } = useAsync(() => listServices(), []);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service_id: "", budget_range: "", timeline: "",
    project_description: "", reference_urls: [""],
    contact_name: user?.name ?? "", contact_email: user?.email ?? "", contact_company: user?.company ?? "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!form.service_id;
    if (step === 1) return !!form.budget_range && !!form.timeline;
    if (step === 2) return form.project_description.trim().length >= 10;
    if (step === 3) return form.contact_name.trim() && /\S+@\S+\.\S+/.test(form.contact_email);
    return true;
  };

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const payload = { ...form, reference_urls: form.reference_urls.map((u) => u.trim()).filter(Boolean) };
      const res = await createBooking(payload);
      setResult(res);
    } catch (e) {
      setError(e.response?.data?.message || "Could not submit. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <Wrap>
        <div style={{ textAlign: "center", maxWidth: 540 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h1 style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 2, margin: "0 0 12px", color: colors.text }}>RECEIVED</h1>
          <p style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>{result.message}</p>
          <div style={{ fontFamily: fonts.mono, fontSize: 18, color: colors.accentText, letterSpacing: 2, margin: "20px 0 28px" }}>
            {result.data.reference_code}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {user
              ? <Link to="/dashboard" style={cta(colors.accent, "#000")}>VIEW IN DASHBOARD</Link>
              : <Link to="/register" style={cta(colors.accent, "#000")}>CREATE ACCOUNT TO TRACK</Link>}
            <Link to="/work" style={cta("transparent", colors.text, colors.border)}>BACK TO WORK</Link>
          </div>
        </div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <div style={{ width: "100%", maxWidth: 640 }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: i <= step ? colors.accent : colors.border, transition: "background 0.3s" }} />
              <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: i === step ? colors.accentText : colors.textFaint, marginTop: 6 }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 0 — service */}
        {step === 0 && (
          <Field label="WHAT DO YOU NEED?">
            <div style={{ display: "grid", gap: 10 }}>
              {(services ?? []).map((s) => (
                <button key={s.id} data-hover onClick={() => set("service_id", s.id)}
                  style={selectCard(form.service_id === s.id)}>
                  <span style={{ fontSize: 22, color: colors.accentText }}>{s.icon_glyph}</span>
                  <span>
                    <span style={{ display: "block", fontFamily: fonts.display, fontSize: 22, letterSpacing: 1, color: colors.text }}>{s.name}</span>
                    <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>{s.price_label}</span>
                  </span>
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Step 1 — budget + timeline */}
        {step === 1 && (
          <>
            <Field label="BUDGET RANGE">
              <Choices options={BUDGET_OPTIONS} value={form.budget_range} onChange={(v) => set("budget_range", v)} />
            </Field>
            <Field label="TIMELINE">
              <Choices options={TIMELINE_OPTIONS} value={form.timeline} onChange={(v) => set("timeline", v)} />
            </Field>
          </>
        )}

        {/* Step 2 — details */}
        {step === 2 && (
          <>
            <Field label="DESCRIBE YOUR PROJECT">
              <textarea value={form.project_description} onChange={(e) => set("project_description", e.target.value)}
                rows={6} placeholder="Tell us everything. The more detail, the better."
                style={{ ...input, resize: "vertical" }} />
            </Field>
            <Field label="REFERENCE LINKS (OPTIONAL)">
              {form.reference_urls.map((u, i) => (
                <input key={i} value={u} placeholder="https://…"
                  onChange={(e) => { const arr = [...form.reference_urls]; arr[i] = e.target.value; set("reference_urls", arr); }}
                  style={{ ...input, marginBottom: 8 }} />
              ))}
              <button data-hover onClick={() => set("reference_urls", [...form.reference_urls, ""])}
                style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accentText, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                + ADD ANOTHER
              </button>
            </Field>
          </>
        )}

        {/* Step 3 — contact */}
        {step === 3 && (
          <>
            <Field label="YOUR NAME"><input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} style={input} /></Field>
            <Field label="EMAIL"><input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} style={input} /></Field>
            <Field label="COMPANY (OPTIONAL)"><input value={form.contact_company} onChange={(e) => set("contact_company", e.target.value)} style={input} /></Field>
          </>
        )}

        {/* Step 4 — review */}
        {step === 4 && (
          <Field label="REVIEW & SUBMIT">
            <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted, lineHeight: 2 }}>
              <Row k="Service" v={(services ?? []).find((s) => s.id === form.service_id)?.name} />
              <Row k="Budget" v={BUDGET_OPTIONS.find((o) => o.value === form.budget_range)?.label} />
              <Row k="Timeline" v={TIMELINE_OPTIONS.find((o) => o.value === form.timeline)?.label} />
              <Row k="Contact" v={`${form.contact_name} · ${form.contact_email}`} />
            </div>
            {error && <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.pink, marginTop: 12 }}>{error}</p>}
          </Field>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <button data-hover disabled={step === 0} onClick={() => setStep((s) => s - 1)}
            style={{ ...navBtn, opacity: step === 0 ? 0.3 : 1 }}>← BACK</button>
          {step < STEPS.length - 1 ? (
            <button data-hover disabled={!canNext()} onClick={() => setStep((s) => s + 1)}
              style={{ ...navBtn, background: colors.accent, color: "#000", opacity: canNext() ? 1 : 0.4 }}>NEXT →</button>
          ) : (
            <button data-hover disabled={busy} onClick={submit}
              style={{ ...navBtn, background: colors.accent, color: "#000", opacity: busy ? 0.6 : 1 }}>
              {busy ? "SUBMITTING…" : "SUBMIT BOOKING"}
            </button>
          )}
        </div>
      </div>
    </Wrap>
  );
}

function Wrap({ children }) {
  return <main style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px" }}>{children}</main>;
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.accentText, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}
function Choices({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => (
        <button key={o.value} data-hover onClick={() => onChange(o.value)}
          style={{ fontFamily: fonts.mono, fontSize: 12, padding: "10px 16px", borderRadius: 8, cursor: "pointer",
            background: value === o.value ? colors.accent : "transparent", color: value === o.value ? "#000" : colors.textMuted,
            border: `1px solid ${value === o.value ? colors.accent : colors.border}`, fontWeight: value === o.value ? 700 : 400 }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
function Row({ k, v }) {
  return <div><span style={{ color: colors.textFaint }}>{k}: </span><span style={{ color: colors.text }}>{v || "—"}</span></div>;
}

const input = { width: "100%", background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, padding: "13px 14px", borderRadius: 8, fontFamily: fonts.mono, fontSize: 13, outline: "none", boxSizing: "border-box" };
const navBtn = { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, fontWeight: 700, padding: "13px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: colors.surface, color: colors.text };
const selectCard = (active) => ({ display: "flex", alignItems: "center", gap: 14, textAlign: "left", padding: "16px 18px", borderRadius: 12, cursor: "pointer", background: active ? colors.surface : "transparent", border: `1px solid ${active ? colors.accent + "66" : colors.border}` });
const cta = (bg, color, border) => ({ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700, textDecoration: "none", padding: "13px 20px", borderRadius: 8, background: bg, color, border: `1px solid ${border ?? bg}` });
