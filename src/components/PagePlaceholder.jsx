import { Link } from "react-router-dom";
import { colors, fonts } from "../styles/theme";

// Temporary scaffold for routes built in later phases. Keeps the app
// navigable and building while real pages are implemented.
export default function PagePlaceholder({ title, note }) {
  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      background: colors.bg, color: colors.text, padding: "120px 24px",
      textAlign: "center",
    }}>
      <h1 style={{ fontFamily: fonts.display, fontSize: 64, letterSpacing: 4, margin: 0 }}>
        {title}
      </h1>
      <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, maxWidth: 420 }}>
        {note ?? "Coming soon."}
      </p>
      <Link to="/" data-hover style={{
        fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.accentText,
        textDecoration: "none", border: `1px solid ${colors.accent}44`,
        padding: "12px 20px", borderRadius: 8,
      }}>
        ← BACK HOME
      </Link>
    </main>
  );
}
