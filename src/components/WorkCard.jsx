import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts } from "../styles/theme";
import { categoryLabel } from "../services/projects";
import ShareButton from "./ShareButton";

// Showcase card backed by the API project shape. Shows the cover image (with a
// gradient fallback), links to the detail route, and surfaces share + the
// public/private lock state.
export default function WorkCard({ project, index = 0 }) {
  const [hov, setHov] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const accent = project.color_accent || colors.accent;
  const hasCover = project.cover_image_url && imgOk;

  return (
    <Link
      to={`/work/${project.slug}`}
      data-hover
      data-tour={index === 0 ? "work-card" : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none",
        background: colors.surface,
        border: `1px solid ${hov ? accent + "44" : colors.border}`,
        borderRadius: 20, padding: 24,
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov ? `0 32px 64px ${accent}22` : "none",
        animation: `fadeSlide 0.6s ${index * 0.1}s both`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Cover image — real backend image, gradient fallback when missing/offline */}
      <div style={{
        position: "relative", margin: "-24px -24px 20px", height: 190, overflow: "hidden",
        background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${accent}33)`,
      }}>
        {hasCover && (
          <img src={project.cover_image_url} alt={project.title} loading="lazy"
            onError={() => setImgOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s ease" }} />
        )}
        {!hasCover && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontSize: 40, letterSpacing: 2, color: accent + "55" }}>
            {project.title}
          </div>
        )}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
          <ShareButton path={`/work/${project.slug}`} title={project.title} accent={accent} compact
            data-tour={index === 0 ? "share" : undefined} />
        </div>
        {project.is_locked && (
          <span style={{ position: "absolute", bottom: 12, left: 12, fontSize: 9, letterSpacing: 2, color: "#fff", fontFamily: fonts.mono, background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 4 }}>
            🔒 PRIVATE
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, letterSpacing: 3, color: accent, fontFamily: fonts.mono }}>
          {categoryLabel(project.category)}
        </span>
        <span style={{ fontSize: 11, color: colors.textDim, fontFamily: fonts.mono }}>{project.year}</span>
      </div>

      <h3 style={{ fontFamily: fonts.display, fontSize: 40, color: colors.text, margin: "0 0 10px", letterSpacing: 2, lineHeight: 1 }}>
        {project.title}
      </h3>

      <p style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.7, fontFamily: fonts.mono, marginBottom: 20 }}>
        {project.tagline || project.description}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {(project.tags ?? []).map((t) => (
          <span key={t.id ?? t.name} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, border: `1px solid ${accent}44`, color: accent, fontFamily: fonts.mono, letterSpacing: 1 }}>
            {t.name}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "center", borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, fontFamily: fonts.mono }}>👁 {project.view_count ?? 0}</div>
          <div style={{ fontSize: 10, color: colors.textFaint, letterSpacing: 1 }}>views</div>
        </div>
      </div>
    </Link>
  );
}
