import { colors, fonts } from "../styles/theme";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div style={{ fontFamily: fonts.display, fontSize: 20, letterSpacing: 4, color: colors.text }}>
        C2<span style={{ color: colors.accentText }}>.</span>Y
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, letterSpacing: 2 }}>
        © 2026 · ALL RIGHTS RESERVED
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {["TWITTER", "DRIBBBLE", "GITHUB"].map(l => (
          <a key={l} data-hover href="#"
            style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.textFaint, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = colors.accent}
            onMouseLeave={e => e.target.style.color = colors.textFaint}>{l}</a>
        ))}
      </div>
    </footer>
  );
}
