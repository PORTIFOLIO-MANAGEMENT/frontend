import { useState } from "react";
import { listServices } from "../../services/projects";
import { createBooking, BUDGET_OPTIONS, TIMELINE_OPTIONS } from "../../services/bookings";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";
import Reveal from "../../components/Reveal";
import { colors, fonts } from "../../styles/theme";

const STEPS = ["YOU", "SERVICE", "SCOPE", "BRIEF"];

// START A PROJECT — a real, multi-step guest booking. Works logged-out; if a
// client is signed in we prefill their name/email. Submits to POST /api/bookings.
export default function ContactSection() {
  const { user } = useAuth();
  const { data: services } = useAsync(listServices, []);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    contact_name: user?.name ?? "",
    contact_email: user?.email ?? "",
    contact_company: "",
    service_id: "",
    budget_range: "",
    timeline: "",
    project_description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const choose = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Per-step gating so visitors can't skip required fields.
  const canAdvance = () => {
    if (step === 0) return form.contact_name.trim() && /\S+@\S+\.\S+/.test(form.contact_email);
    if (step === 1) return !!form.service_id;
    if (step === 2) return form.budget_range && form.timeline;
    if (step === 3) return form.project_description.trim().length >= 10;
    return false;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await createBooking(form);
      setResult(res.data);
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.errors ? Object.values(data.errors).flat().join(" ") : data?.message || "Something went wrong. Try again.");
    }
    setSubmitting(false);
  };

  const next = () => {
    if (!canAdvance()) return;
    if (step < 3) { setStep((s) => s + 1); return; }
    submit();
  };

  return (
    <section id="contact" className="section-pad" style={{ background: colors.surfaceAlt, borderTop: `1px solid ${colors.borderSoft}` }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText }}>START A PROJECT</span>
          <h2 style={{ fontFamily: fonts.display, fontSize: "clamp(48px,6vw,80px)", color: colors.text, letterSpacing: 2, lineHeight: 1, marginTop: 8, marginBottom: 48 }}>
            LET'S BUILD<br />SOMETHING
          </h2>
        </Reveal>

        {result ? (
          <Reveal style={{ textAlign: "center", padding: "72px 40px", border: `1px solid ${colors.accent}22`, borderRadius: 20, background: colors.surface }}>
            <div style={{ fontFamily: fonts.display, fontSize: 64, color: colors.accentText, marginBottom: 16 }}>◈</div>
            <h3 style={{ fontFamily: fonts.display, fontSize: 40, color: colors.text, letterSpacing: 2, marginBottom: 12 }}>BRIEF RECEIVED</h3>
            <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
              We'll review your project and respond within 24 hours.
            </p>
            <div style={{ display: "inline-block", fontFamily: fonts.mono, fontSize: 13, letterSpacing: 2, color: colors.accentText, border: `1px solid ${colors.accent}44`, borderRadius: 8, padding: "10px 18px" }}>
              REF: {result.reference_code}
            </div>
          </Reveal>
        ) : (
          <Reveal style={{ background: colors.surface, border: `1px solid ${colors.borderSoft}`, borderRadius: 20, padding: 48 }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {STEPS.map((label, i) => (
                <div key={label} style={{ flex: 1 }}>
                  <div style={{ height: 2, borderRadius: 2, background: i <= step ? colors.accent : colors.border, transition: "background 0.3s" }} />
                  <div style={{ fontFamily: fonts.mono, fontSize: 8, letterSpacing: 2, color: i <= step ? colors.accentText : colors.textDim, marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>

            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="YOUR NAME">
                  <input value={form.contact_name} onChange={set("contact_name")} placeholder="Jane Doe" style={inputStyle} />
                </Field>
                <Field label="EMAIL">
                  <input type="email" value={form.contact_email} onChange={set("contact_email")} placeholder="jane@studio.com" style={inputStyle} />
                </Field>
                <Field label="COMPANY (OPTIONAL)">
                  <input value={form.contact_company} onChange={set("contact_company")} placeholder="Acme Inc." style={inputStyle} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <Field label="WHAT SERVICE DO YOU NEED?">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(services ?? []).map((s) => (
                    <OptionCard key={s.id} active={form.service_id === s.id} onClick={() => choose("service_id", s.id)}
                      title={s.name} sub={s.short_desc} glyph={s.icon_glyph} />
                  ))}
                  {(services ?? []).length === 0 && <p style={mutedNote}>Loading services…</p>}
                </div>
              </Field>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <Field label="BUDGET RANGE">
                  <Pills options={BUDGET_OPTIONS} value={form.budget_range} onPick={(v) => choose("budget_range", v)} />
                </Field>
                <Field label="TIMELINE">
                  <Pills options={TIMELINE_OPTIONS} value={form.timeline} onPick={(v) => choose("timeline", v)} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <Field label="DESCRIBE YOUR PROJECT">
                <textarea value={form.project_description} onChange={set("project_description")} rows={6}
                  placeholder="Tell us everything. The more detail, the better. (min. 10 characters)"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              </Field>
            )}

            {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, marginTop: 20, lineHeight: 1.6 }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
              {step > 0 ? (
                <button data-hover onClick={() => setStep((s) => s - 1)} style={{ background: "transparent", color: colors.textMuted, border: "none", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2 }}>← BACK</button>
              ) : <div />}
              <button data-hover onClick={next} disabled={!canAdvance() || submitting}
                style={{ background: !canAdvance() || submitting ? colors.border : colors.accent, color: !canAdvance() || submitting ? colors.textMuted : "#000", border: "none", borderRadius: 8, padding: "14px 32px", fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, cursor: !canAdvance() || submitting ? "not-allowed" : "pointer", fontWeight: 700, transition: "background 0.2s" }}>
                {submitting ? "SENDING…" : step < 3 ? "NEXT →" : "SEND BRIEF ◈"}
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%", background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
  borderRadius: 8, padding: "14px 16px", color: colors.text, fontSize: 13, outline: "none",
  fontFamily: fonts.mono, boxSizing: "border-box",
};
const mutedNote = { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted };

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 3, color: colors.accentText, display: "block", marginBottom: 12 }}>{label}</label>
      {children}
    </div>
  );
}

function OptionCard({ active, onClick, title, sub, glyph }) {
  return (
    <button data-hover onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%", cursor: "pointer",
        background: active ? colors.surfaceAlt : "transparent", border: `1px solid ${active ? colors.accent + "66" : colors.border}`,
        borderRadius: 12, padding: "14px 16px", transition: "border-color 0.2s, background 0.2s" }}>
      <span style={{ fontSize: 20, color: active ? colors.accentText : colors.textDim }}>{glyph || "◆"}</span>
      <span>
        <span style={{ display: "block", fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, color: colors.text }}>{title}</span>
        {sub && <span style={{ display: "block", fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginTop: 3, lineHeight: 1.5 }}>{sub}</span>}
      </span>
    </button>
  );
}

function Pills({ options, value, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => (
        <button key={o.value} data-hover onClick={() => onPick(o.value)}
          style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, padding: "9px 14px", borderRadius: 8, cursor: "pointer",
            background: value === o.value ? colors.accent : "transparent", color: value === o.value ? "#000" : colors.textMuted,
            border: `1px solid ${value === o.value ? colors.accent : colors.border}`, fontWeight: value === o.value ? 700 : 400, transition: "all 0.2s" }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
