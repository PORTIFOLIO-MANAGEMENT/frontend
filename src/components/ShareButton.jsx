import { useState } from "react";
import { colors, fonts } from "../styles/theme";

// Share a project: native share sheet when available (mobile), clipboard copy
// otherwise, with a transient "COPIED" confirmation. `path` is app-relative.
export default function ShareButton({ path, title = "Check out this project", accent = colors.accent, compact = false, ...rest }) {
  const [copied, setCopied] = useState(false);

  const share = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed the share sheet, or clipboard denied — no-op */
    }
  };

  return (
    <button
      onClick={share}
      data-hover
      aria-label="Share project"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: fonts.mono, fontSize: compact ? 10 : 11, letterSpacing: 1,
        color: copied ? "#000" : accent,
        background: copied ? accent : "transparent",
        border: `1px solid ${accent}${copied ? "" : "55"}`,
        borderRadius: 8, padding: compact ? "5px 10px" : "8px 14px",
        cursor: "pointer", transition: "background 0.2s, color 0.2s",
      }}
      {...rest}
    >
      {copied ? "✓ COPIED" : "↗ SHARE"}
    </button>
  );
}
