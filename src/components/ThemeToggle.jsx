import { useTheme } from "../context/ThemeContext";
import { colors, fonts } from "../styles/theme";

// Sun/moon light-dark switch. `variant="full"` renders a labelled bar for the
// mobile sidebar; the default is a compact square button for the desktop nav.
export default function ThemeToggle({ variant = "compact" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const glyph = isDark ? "☀" : "☾";
  const label = isDark ? "LIGHT MODE" : "DARK MODE";

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        data-hover
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%",
          background: "transparent", color: colors.textMuted, border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: "13px 18px", cursor: "pointer",
          fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700,
        }}
      >
        <span style={{ fontSize: 14 }}>{glyph}</span> {label}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      data-hover
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={label}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, flexShrink: 0,
        background: "transparent", color: colors.textMuted,
        border: `1px solid ${colors.border}`, borderRadius: 8, cursor: "pointer",
        fontSize: 16, transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {glyph}
    </button>
  );
}
