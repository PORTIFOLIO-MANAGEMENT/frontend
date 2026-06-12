import { colors, fonts } from "../../styles/theme";

// Shared form styles for the auth screens (kept out of the component file so
// Fast Refresh stays happy).

export const fieldStyle = {
  width: "100%", background: colors.bg, border: `1px solid ${colors.border}`,
  color: colors.text, padding: "13px 14px", borderRadius: 8, fontFamily: fonts.mono,
  fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 14,
};

export const labelStyle = {
  fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.textMuted,
  display: "block", marginBottom: 6,
};

export const submitStyle = {
  width: "100%", background: colors.accent, color: "#000", border: "none",
  padding: "14px", borderRadius: 8, fontFamily: fonts.mono, fontSize: 12,
  letterSpacing: 2, fontWeight: 700, cursor: "pointer", marginTop: 6,
};
