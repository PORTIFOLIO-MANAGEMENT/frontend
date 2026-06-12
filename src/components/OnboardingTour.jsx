import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { colors, fonts } from "../styles/theme";

// Default tour steps. Each targets a [data-tour="…"] element on the landing
// page; a step whose target is missing is skipped automatically.
const STEPS = [
  { target: "account", title: "Your account", body: "Bookings, live messages with the studio, and your profile all live here — without leaving the site." },
  { target: "work-card", title: "Explore the work", body: "Open any project to see the full case study, react with a like, and join the discussion in the comments." },
  { target: "share", title: "Share a project", body: "Love something? Share it instantly — the link copies to your clipboard (or opens your device share sheet)." },
  { target: "aria", title: "Meet ARIA", body: "Ask our AI assistant anything about our work or pricing, or kick off a project brief in seconds." },
];

const PAD = 8;

export default function OnboardingTour({ active, onFinish }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);

  // Resolve visible steps (skip any whose target isn't on the page).
  const steps = useMemo(
    () => (active ? STEPS.filter((s) => document.querySelector(`[data-tour="${s.target}"]`)) : []),
    [active]
  );

  const step = steps[index];

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) { setRect(null); return; }
    setRect(el.getBoundingClientRect());
  }, [step]);

  // Reset to the first step whenever the tour (re)opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (active) setIndex(0); }, [active]);

  // Scroll the target into view, then measure; keep measuring on scroll/resize.
  useLayoutEffect(() => {
    if (!active || !step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(measure, 320);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [active, step, measure]);

  // Keyboard: Esc to skip, arrows to navigate.
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") onFinish();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, steps.length, onFinish]);

  if (!active || steps.length === 0 || !step) return null;

  const last = index === steps.length - 1;
  const next = () => (last ? onFinish() : setIndex((i) => i + 1));
  const back = () => setIndex((i) => Math.max(i - 1, 0));

  // Spotlight hole around the target; giant box-shadow dims everything else.
  const hole = rect && {
    position: "fixed",
    top: rect.top - PAD, left: rect.left - PAD,
    width: rect.width + PAD * 2, height: rect.height + PAD * 2,
    borderRadius: 12, boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
    border: `2px solid ${colors.accent}`, zIndex: 2000, pointerEvents: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  };

  // Tooltip placement: below the target if there's room, else above.
  const below = rect ? rect.bottom + 16 : 120;
  const placeAbove = rect && rect.bottom + 200 > window.innerHeight;
  const tipStyle = {
    position: "fixed", zIndex: 2001, width: "min(340px, calc(100vw - 32px))",
    top: rect ? (placeAbove ? Math.max(16, rect.top - 200) : below) : 120,
    left: rect ? Math.min(Math.max(16, rect.left), window.innerWidth - 356) : "50%",
    background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14,
    padding: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    fontFamily: fonts.mono,
  };

  return (
    <>
      {/* Click-catcher that also lets users skip by clicking the dim area */}
      <div onClick={onFinish} style={{ position: "fixed", inset: 0, zIndex: 1999 }} />
      {hole && <div style={hole} />}
      <div style={tipStyle} role="dialog" aria-label="Onboarding tour">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: colors.accentText }}>
            STEP {index + 1} / {steps.length}
          </span>
          <button onClick={onFinish} data-hover style={{ background: "transparent", border: "none", color: colors.textFaint, cursor: "pointer", fontSize: 11, letterSpacing: 1 }}>SKIP ✕</button>
        </div>
        <h3 style={{ fontFamily: fonts.display, fontSize: 26, letterSpacing: 1, color: colors.text, margin: "0 0 8px" }}>{step.title}</h3>
        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: colors.textMuted, margin: "0 0 18px" }}>{step.body}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <span key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, background: i === index ? colors.accent : colors.border, transition: "width 0.2s" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {index > 0 && (
              <button onClick={back} data-hover style={{ background: "transparent", color: colors.textMuted, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 14px", fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>BACK</button>
            )}
            <button onClick={next} data-hover style={{ background: colors.accent, color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, fontWeight: 700, cursor: "pointer" }}>
              {last ? "GOT IT" : "NEXT →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
