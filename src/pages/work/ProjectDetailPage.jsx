import { useParams, Link } from "react-router-dom";
import { getProject, categoryLabel } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import MediaGallery from "../../components/MediaGallery";
import ProjectEngagement from "../../components/ProjectEngagement";
import ShareButton from "../../components/ShareButton";
import { colors, fonts } from "../../styles/theme";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { status, data: project } = useAsync(() => getProject(slug), [slug]);

  if (status === "loading") return <Centered text="LOADING…" />;
  if (status === "notfound") return <Centered text="PROJECT NOT FOUND." back />;
  if (status === "error") return <Centered text="SOMETHING BROKE." back />;

  const accent = project.color_accent || colors.accent;

  return (
    <main style={{ background: colors.bg, minHeight: "100vh", padding: "140px 24px 100px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Link to="/work" data-hover style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.textMuted, textDecoration: "none" }}>
          ← ALL WORK
        </Link>

        {/* Header */}
        <div style={{ margin: "24px 0 8px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 3, color: accent }}>
            {categoryLabel(project.category)}
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textDim }}>{project.year}</span>
          {project.is_locked && (
            <span style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "3px 10px", borderRadius: 4 }}>
              🔒 PRIVATE
            </span>
          )}
        </div>

        <h1 style={{ fontFamily: fonts.display, fontSize: "clamp(56px, 10vw, 120px)", color: colors.text, margin: "0 0 16px", letterSpacing: 2, lineHeight: 0.92 }}>
          {project.title}
        </h1>

        {project.tagline && (
          <p style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.textMuted, fontStyle: "italic", margin: "0 0 32px", maxWidth: 680 }}>
            {project.tagline}
          </p>
        )}

        {/* Cover */}
        {project.cover_image_url && (
          <img src={project.cover_image_url} alt={project.title}
            style={{ width: "100%", borderRadius: 16, border: `1px solid ${colors.border}`, marginBottom: 40 }} />
        )}

        {/* CTA — visit links honor public/private visibility */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 48 }}>
          {project.is_locked ? (
            <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, color: colors.textMuted, border: `1px solid ${colors.border}`, padding: "14px 22px", borderRadius: 8 }}>
              🔒 This project is private — live & source links are not publicly available.
            </div>
          ) : (
            <>
              {project.live_url && <CTA href={project.live_url} bg={accent} color="#000" label="VISIT LIVE ↗" />}
              {project.repo_url && <CTA href={project.repo_url} bg="transparent" color={accent} border={accent} label="VIEW CODE ↗" />}
            </>
          )}
          <ShareButton path={`/work/${project.slug}`} title={project.title} accent={accent} />
        </div>

        {/* Case study body */}
        <Section title="OVERVIEW" body={project.description} accent={accent} />
        <Section title="THE PROBLEM" body={project.problem_statement} accent={accent} />
        <Section title="THE SOLUTION" body={project.solution_breakdown} accent={accent} />
        <Section title="OUTCOME" body={project.outcome} accent={accent} />

        {/* Tags */}
        {(project.tags ?? []).length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 40 }}>
            {project.tags.map((t) => (
              <span key={t.id} style={{ fontFamily: fonts.mono, fontSize: 11, padding: "6px 12px", borderRadius: 4, border: `1px solid ${accent}44`, color: accent, letterSpacing: 1 }}>
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Team */}
        {(project.collaborators ?? []).length > 0 && (
          <div style={{ marginTop: 48, borderTop: `1px solid ${colors.border}`, paddingTop: 32 }}>
            <p style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 3, color: colors.textFaint, margin: "0 0 16px" }}>BUILT BY</p>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {project.collaborators.map((c) => (
                <div key={c.id}>
                  <div style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, letterSpacing: 2 }}>{c.display_name}</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>{c.contribution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media gallery — images, video, and in-browser 3D models */}
        <MediaGallery media={project.media ?? []} accent={accent} />

        {/* Reactions + threaded discussion */}
        <ProjectEngagement slug={project.slug} accent={accent} />

        {/* Living-portfolio version timeline */}
        {(project.versions ?? []).length > 0 && (
          <div style={{ marginTop: 56, borderTop: `1px solid ${colors.border}`, paddingTop: 32 }}>
            <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: accent, margin: "0 0 20px" }}>EVOLUTION</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {project.versions.map((v) => (
                <div key={v.id} style={{ display: "flex", gap: 16, paddingBottom: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontFamily: fonts.display, fontSize: 18, color: accent, lineHeight: 1 }}>v{v.version_number}</span>
                    <span style={{ flex: 1, width: 1, background: colors.border, marginTop: 6 }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.text }}>{v.title || `Version ${v.version_number}`}</div>
                    {v.description && <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{v.description}</div>}
                    {v.published_at && <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginTop: 4 }}>{new Date(v.published_at).toLocaleDateString()}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Section({ title, body, accent }) {
  if (!body) return null;
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: accent, margin: "0 0 12px" }}>{title}</h2>
      <p style={{ fontFamily: fonts.mono, fontSize: 15, lineHeight: 1.8, color: colors.textMuted, whiteSpace: "pre-wrap", margin: 0 }}>{body}</p>
    </section>
  );
}

function CTA({ href, bg, color, border, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-hover
      style={{
        fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, fontWeight: 700,
        textDecoration: "none", padding: "14px 22px", borderRadius: 8,
        background: bg, color, border: `1px solid ${border ?? bg}`,
      }}>
      {label}
    </a>
  );
}

function Centered({ text, back }) {
  return (
    <main style={{ minHeight: "100vh", background: colors.bg, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted }}>{text}</p>
      {back && <Link to="/work" data-hover style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.accentText, textDecoration: "none" }}>← ALL WORK</Link>}
    </main>
  );
}
