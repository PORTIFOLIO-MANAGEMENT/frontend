import { Link } from "react-router-dom";
import { listProjects } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import WorkCard from "../../components/WorkCard";
import Reveal from "../../components/Reveal";
import { colors, fonts } from "../../styles/theme";

// RECENT PROJECTS — live, public showcase. Prefers featured projects, falling
// back to the most recent published ones when none are flagged featured.
export default function WorkSection() {
  const { status, data } = useAsync(async () => {
    const featured = await listProjects({ featured: 1 }).then((r) => r.data);
    if (featured.length) return featured.slice(0, 3);
    return listProjects().then((r) => r.data.slice(0, 3));
  }, []);

  const projects = data ?? [];

  return (
    <section id="work" className="section-pad">
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
          <div>
            <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText }}>SELECTED WORK</span>
            <h2 style={{ fontFamily: fonts.display, fontSize: "clamp(48px,6vw,96px)", color: colors.text, letterSpacing: 2, lineHeight: 1, marginTop: 8 }}>
              RECENT<br />PROJECTS
            </h2>
          </div>
          <p style={{ fontFamily: fonts.serif, fontStyle: "italic", fontSize: 18, color: colors.textFaint, maxWidth: 320, lineHeight: 1.6 }}>
            Every project is a chance to build something that outlasts its brief.
          </p>
        </Reveal>

        {status === "loading" && <Notice text="LOADING PROJECTS…" />}
        {status === "error" && <Notice text="COULDN'T LOAD PROJECTS. IS THE API RUNNING?" />}
        {status === "ready" && projects.length === 0 && <Notice text="NO PUBLISHED PROJECTS YET." />}

        {status === "ready" && projects.length > 0 && (
          <div className="work-grid">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <WorkCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/work" data-hover
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C8F53B11"; e.currentTarget.style.borderColor = "#C8F53B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = colors.accent + "44"; }}
            style={{ display: "inline-block", textDecoration: "none", background: "transparent", color: colors.accentText, border: `1px solid ${colors.accent}44`, borderRadius: 8, padding: "14px 40px", fontFamily: fonts.mono, fontSize: 11, letterSpacing: 3, cursor: "pointer", transition: "background 0.2s, border-color 0.2s" }}>
            VIEW ALL WORK →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Notice({ text }) {
  return (
    <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, padding: "60px 0", textAlign: "center" }}>
      {text}
    </p>
  );
}
