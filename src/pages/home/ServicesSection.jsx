import { useState } from "react";
import { listServices } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import Reveal from "../../components/Reveal";
import { colors, fonts } from "../../styles/theme";

// Format a service's price label from the API shape (price_label wins, else a
// "From $X" derived from starting_price).
function priceFor(s) {
  if (s.price_label) return s.price_label;
  if (s.starting_price) {
    const n = Number(s.starting_price);
    return `From $${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return "Let's talk";
}

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);
  const { status, data } = useAsync(listServices, []);
  const services = data ?? [];

  return (
    <section id="services" className="section-pad" style={{ background: colors.surfaceAlt, borderTop: `1px solid ${colors.borderSoft}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: 64 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText }}>WHAT WE DO</span>
          <h2 style={{ fontFamily: fonts.display, fontSize: "clamp(48px,6vw,96px)", color: colors.text, letterSpacing: 2, lineHeight: 1, marginTop: 8 }}>SERVICES</h2>
        </Reveal>

        {status === "loading" && <Notice text="LOADING SERVICES…" />}
        {status === "error" && <Notice text="COULDN'T LOAD SERVICES." />}
        {status === "ready" && services.length === 0 && <Notice text="SERVICES COMING SOON." />}

        {status === "ready" && services.length > 0 && (
          <div className="services-grid">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}
                data-hover
                onMouseEnter={() => setActiveService(i)}
                style={{
                  padding: "40px 48px", borderRadius: 4,
                  background: activeService === i ? colors.surface : "transparent",
                  border: `1px solid ${activeService === i ? colors.accent + "22" : colors.borderSoft}`,
                  cursor: "pointer", transition: "background 0.3s ease, border-color 0.3s ease, opacity 0.6s, transform 0.6s",
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 12, color: activeService === i ? colors.accentText : colors.textDim, transition: "color 0.3s" }}>{s.icon_glyph || "◆"}</div>
                    <h3 style={{ fontFamily: fonts.display, fontSize: 32, color: colors.text, letterSpacing: 2, lineHeight: 1 }}>{s.name}</h3>
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: activeService === i ? colors.accentText : colors.textDim, letterSpacing: 2, whiteSpace: "nowrap" }}>{priceFor(s)}</span>
                </div>
                <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, lineHeight: 1.8 }}>{s.short_desc}</p>
                {activeService === i && <div style={{ width: 40, height: 2, background: colors.accent, marginTop: 20 }} />}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Notice({ text }) {
  return (
    <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, padding: "60px 0", textAlign: "center" }}>
      {text}
    </p>
  );
}
