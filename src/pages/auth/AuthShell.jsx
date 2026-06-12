import { Link } from "react-router-dom";
import { colors, fonts } from "../../styles/theme";

// Shared shell for the login/register screens (no marketing chrome).
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link to="/" data-hover style={{ fontFamily: fonts.display, fontSize: 28, letterSpacing: 4, color: colors.text, textDecoration: "none", display: "block", textAlign: "center", marginBottom: 32 }}>
          C2<span style={{ color: colors.accentText }}>.</span>Y
        </Link>

        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 36 }}>
          <h1 style={{ fontFamily: fonts.display, fontSize: 40, color: colors.text, letterSpacing: 2, margin: "0 0 6px" }}>{title}</h1>
          <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, margin: "0 0 28px" }}>{subtitle}</p>
          {children}
        </div>

        <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, textAlign: "center", marginTop: 24 }}>
          {footer}
        </p>
      </div>
    </main>
  );
}
