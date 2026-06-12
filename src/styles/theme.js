// Central design tokens. Pulled from the inline values scattered across
// components so colors/fonts live in one place. Keep using inline styles +
// globalCss — just reference these instead of hard-coding hexes.
//
// Structural tokens resolve to CSS variables (defined in globalCss.js for
// :root [dark] and [data-theme="light"]), so every component that reads
// `colors.*` re-themes automatically when the light/dark toggle flips the
// <html data-theme> attribute. Brand tokens (accent/pink/purple) stay static
// hex: they're identical across themes AND many components build translucent
// variants by concatenating an alpha suffix (e.g. `colors.accent + "44"`),
// which only works on a real hex value — never on `var(--accent)`.

export const colors = {
  bg: "var(--bg)",
  surface: "var(--surface)",
  surfaceAlt: "var(--surface-alt)",
  border: "var(--border)",
  borderSoft: "var(--border-soft)",
  text: "var(--text)",
  textMuted: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  textDim: "var(--text-dim)",

  accent: "#C8F53B", // lime — primary brand (static across themes; use for bg/border/alpha)
  // Accent as TEXT/icon color — theme-aware so lime labels stay readable in
  // light mode (lime on white is too low-contrast). Use this for any text/icon
  // you'd otherwise color with `accent`. Not for backgrounds or alpha math.
  accentText: "var(--accent-text)",
  pink: "#FF4D6D",
  purple: "#7B61FF",
};

export const fonts = {
  display: "'Bebas Neue', sans-serif",
  mono: "'Space Mono', monospace",
  serif: "'DM Serif Display', serif",
};

// Per-category accent used on project cards / detail pages.
export const categoryAccent = {
  web_app: colors.purple,
  mobile_app: colors.pink,
  "3d_modeling": colors.accent,
  motion_design: colors.purple,
  brand_identity: colors.pink,
  interactive_experience: colors.accent,
  full_stack: colors.purple,
};

export const accentFor = (category) => categoryAccent[category] ?? colors.accent;
