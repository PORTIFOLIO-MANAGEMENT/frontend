import { listServices } from "../services/projects";
import { useAsync } from "../hooks/useAsync";
import { colors, fonts } from "../styles/theme";

// Shown before live data lands (and if the API is unreachable).
const FALLBACK = [
  "INTERACTIVE EXPERIENCES", "3D DESIGN", "FULL-STACK DEVELOPMENT",
  "BRAND IDENTITY", "MOTION GRAPHICS", "CREATIVE DIRECTION",
];

export default function MarqueeBar() {
  const { data } = useAsync(listServices, []);
  const items = data?.length ? data.map((s) => s.name.toUpperCase()) : FALLBACK;

  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${colors.borderSoft}`, borderBottom: `1px solid ${colors.borderSoft}`, padding: "16px 0", background: colors.surfaceAlt }}>
      <div style={{ display: "flex", gap: 64, whiteSpace: "nowrap", animation: "marquee 22s linear infinite", width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: fonts.display, fontSize: 20, letterSpacing: 4, color: i % 2 === 0 ? colors.accentText : colors.textDim }}>
            {item} <span style={{ color: colors.textDim }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
