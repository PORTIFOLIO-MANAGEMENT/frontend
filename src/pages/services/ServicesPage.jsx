import { Link } from "react-router-dom";
import { listServices } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import { colors, fonts } from "../../styles/theme";

export default function ServicesPage() {
  const { status, data } = useAsync(() => listServices(), []);
  const services = data ?? [];

  return (
    <main style={{ background: colors.bg, minHeight: "100vh", padding: "140px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText, margin: 0 }}>WHAT WE DO</p>
          <h1 style={{ fontFamily: fonts.display, fontSize: "clamp(48px, 8vw, 96px)", color: colors.text, margin: "8px 0 0", letterSpacing: 2, lineHeight: 0.95 }}>
            SERVICES
          </h1>
        </header>

        {status === "loading" && <Notice text="LOADING…" />}
        {status === "error" && <Notice text="COULDN'T LOAD SERVICES." />}

        {status === "ready" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {services.map((s, i) => (
              <div key={s.id} style={{
                background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16,
                padding: 32, animation: `fadeSlide 0.5s ${i * 0.08}s both`,
              }}>
                <div style={{ fontSize: 32, color: colors.accentText, marginBottom: 16 }}>{s.icon_glyph}</div>
                <h2 style={{ fontFamily: fonts.display, fontSize: 30, color: colors.text, letterSpacing: 1, margin: "0 0 10px" }}>{s.name}</h2>
                <p style={{ fontFamily: fonts.mono, fontSize: 13, lineHeight: 1.7, color: colors.textMuted, margin: "0 0 16px" }}>{s.short_desc}</p>

                {(s.deliverables ?? []).length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                    {s.deliverables.map((d) => (
                      <li key={d} style={{ fontFamily: fonts.mono, fontSize: 12, color: "#bbb", padding: "3px 0" }}>
                        <span style={{ color: colors.accentText }}>▸ </span>{d}
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accentText, fontWeight: 700 }}>{s.price_label}</span>
                  <Link to="/book" data-hover style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.text, textDecoration: "none", border: `1px solid ${colors.border}`, padding: "8px 14px", borderRadius: 6 }}>
                    BOOK →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Notice({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, padding: "60px 0", textAlign: "center" }}>{text}</p>;
}
