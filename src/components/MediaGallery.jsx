import { lazy, Suspense, useState } from "react";
import { colors, fonts } from "../styles/theme";

// Heavy three.js bundle only loads when a project actually has a 3D model.
const ModelViewer = lazy(() => import("./ModelViewer"));

export default function MediaGallery({ media = [], accent = colors.accent }) {
  const [lightbox, setLightbox] = useState(null);

  if (!media.length) return null;

  const models = media.filter((m) => m.type === "model_3d");
  const videos = media.filter((m) => m.type === "video");
  const images = media.filter((m) => m.type === "image");
  const files = media.filter((m) => ["code_snippet", "document"].includes(m.type));

  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: accent, margin: "0 0 20px" }}>
        GALLERY
      </h2>

      {/* 3D models */}
      {models.map((m) => (
        <div key={m.id} style={{ marginBottom: 24 }}>
          <Suspense fallback={<ViewerFallback />}>
            <ModelViewer url={m.url} accent={accent} />
          </Suspense>
          {m.caption && <Caption text={m.caption} />}
        </div>
      ))}

      {/* Video */}
      {videos.map((m) => (
        <div key={m.id} style={{ marginBottom: 24 }}>
          <video
            src={m.url}
            controls
            playsInline
            poster={m.thumbnail_url || undefined}
            style={{ width: "100%", borderRadius: 16, border: `1px solid ${colors.border}`, background: "#000" }}
          />
          {m.caption && <Caption text={m.caption} />}
        </div>
      ))}

      {/* Images / posters / flyers / logos */}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {images.map((m) => (
            <button
              key={m.id}
              data-hover
              onClick={() => setLightbox(m)}
              style={{ padding: 0, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", background: colors.surface, aspectRatio: "4 / 3" }}
            >
              <img src={m.url} alt={m.alt_text || m.caption || "Project image"} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}

      {/* Downloadable files */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          {files.map((m) => (
            <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" data-hover
              style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.text, textDecoration: "none", border: `1px solid ${colors.border}`, padding: "10px 14px", borderRadius: 8 }}>
              {m.type === "code_snippet" ? "‹/›" : "📄"} {m.caption || m.type}
            </a>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}
        >
          <img src={lightbox.url} alt={lightbox.alt_text || ""} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12 }} />
        </div>
      )}
    </section>
  );
}

function Caption({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, margin: "8px 0 0" }}>{text}</p>;
}

function ViewerFallback() {
  return (
    <div style={{ height: 460, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.textMuted }}>LOADING 3D ENGINE…</span>
    </div>
  );
}
