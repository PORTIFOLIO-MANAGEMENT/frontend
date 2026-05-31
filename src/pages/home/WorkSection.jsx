import { projects } from "../../data";
import ProjectCard from "../../components/ProjectCard";

export default function WorkSection() {
  return (
    <section id="work" className="section-pad">
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#C8F53B" }}>SELECTED WORK</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px,6vw,96px)", color: "#fff", letterSpacing: 2, lineHeight: 1, marginTop: 8 }}>
              RECENT<br />PROJECTS
            </h2>
          </div>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 18, color: "#666", maxWidth: 320, lineHeight: 1.6 }}>
            Every project is a chance to build something that outlasts its brief.
          </p>
        </div>

        <div className="work-grid">
          {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button data-hover
            onMouseEnter={e => { e.currentTarget.style.background = "#C8F53B11"; e.currentTarget.style.borderColor = "#C8F53B"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#C8F53B44"; }}
            style={{ background: "transparent", color: "#C8F53B", border: "1px solid #C8F53B44", borderRadius: 8, padding: "14px 40px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, cursor: "pointer", transition: "background 0.2s, border-color 0.2s" }}>
            VIEW ALL WORK →
          </button>
        </div>
      </div>
    </section>
  );
}
