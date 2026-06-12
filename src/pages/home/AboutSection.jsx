import { listTeam, listProjects } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import Reveal from "../../components/Reveal";
import { colors, fonts } from "../../styles/theme";

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "·";

const roleLabel = (role) => (role ?? "").toString().replace(/_/g, " ").toUpperCase();

// WHO WE ARE — an editorial, alternating large-image layout (no cards). Each
// member's portrait sits on one side and their story on the other, flipping
// sides down the section, with scroll-reveal + hover motion.
export default function AboutSection() {
  const { status, data } = useAsync(
    () => Promise.all([listTeam(), listProjects()]).then(([team, projects]) => ({
      team,
      projectCount: projects.meta?.total ?? projects.data?.length ?? 0,
    })),
    []
  );

  const team = data?.team ?? [];
  const projectCount = data?.projectCount ?? 0;

  return (
    <section id="about" className="section-pad">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ maxWidth: 760, marginBottom: "clamp(48px,7vw,96px)" }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText }}>WHO WE ARE</span>
          <h2 style={{ fontFamily: fonts.display, fontSize: "clamp(48px,6vw,96px)", color: colors.text, letterSpacing: 2, lineHeight: 0.95, marginTop: 10, marginBottom: 24 }}>
            THE MINDS<br />BEHIND THE WORK
          </h2>
          <p style={{ fontFamily: fonts.serif, fontStyle: "italic", fontSize: 20, color: colors.textMuted, lineHeight: 1.7 }}>
            Obsessives who'd rather ship one extraordinary thing than ten ordinary ones.
          </p>
          {projectCount > 0 && (
            <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint, letterSpacing: 1, marginTop: 20 }}>
              {projectCount} project{projectCount === 1 ? "" : "s"} shipped · remote-first · taking 4–6 engagements a year.
            </p>
          )}
        </Reveal>

        {status === "loading" && <Notice text="LOADING THE TEAM…" />}
        {status === "error" && <Notice text="COULDN'T LOAD THE TEAM." />}

        {status === "ready" && team.length > 0 && (
          <div className="team-rows">
            {team.map((m, i) => (
              <TeamRow key={m.id} member={m} index={i} reverse={i % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamRow({ member: m, index, reverse }) {
  return (
    <Reveal className={`team-row${reverse ? " reverse" : ""}`}>
      {/* Image */}
      <div className="team-figure">
        <span className="team-index">{String(index + 1).padStart(2, "0")}</span>
        <div className="team-figure-inner">
          {m.avatar_url
            ? <img src={m.avatar_url} alt={m.display_name} loading="lazy" />
            : <div className="team-figure-monogram">{initials(m.display_name)}</div>}
        </div>
      </div>

      {/* Copy */}
      <div className="team-copy">
        <span style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 3, color: colors.accentText }}>
          {roleLabel(m.team_role)}
        </span>
        <h3 style={{ fontFamily: fonts.display, fontSize: "clamp(44px,5.5vw,80px)", color: colors.text, letterSpacing: 1, lineHeight: 0.95, margin: "10px 0 0" }}>
          {m.display_name}
        </h3>
        <div className="team-underline" />

        {(m.bio || m.tagline) && (
          <p style={{ fontFamily: fonts.serif, fontStyle: "italic", fontSize: "clamp(16px,1.5vw,20px)", color: colors.textMuted, lineHeight: 1.75, maxWidth: 460, marginBottom: 22 }}>
            {m.bio || m.tagline}
          </p>
        )}

        {m.skills?.length > 0 && (
          <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, color: colors.textFaint, lineHeight: 2, marginBottom: 24 }}>
            {m.skills.map((s, k) => (
              <span key={s}>
                {k > 0 && <span style={{ color: colors.accentText, margin: "0 8px" }}>·</span>}
                {s}
              </span>
            ))}
          </p>
        )}

        {m.social_links && Object.keys(m.social_links).length > 0 && (
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {Object.entries(m.social_links).map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" data-hover
                style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.textMuted, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.accentText)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}>
                {name.toUpperCase()} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

function Notice({ text }) {
  return (
    <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, padding: "40px 0", textAlign: "center" }}>
      {text}
    </p>
  );
}
