import { useState } from "react";
import { listProjects, CATEGORY_LABELS } from "../../services/projects";
import { useAsync } from "../../hooks/useAsync";
import WorkCard from "../../components/WorkCard";
import { colors, fonts } from "../../styles/theme";

export default function WorkPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { status, data } = useAsync(() => {
    const params = {};
    if (category) params.category = category;
    if (search.trim()) params.search = search.trim();
    return listProjects(params).then((res) => res.data);
  }, [category, search]);

  const projects = data ?? [];

  return (
    <main style={{ background: colors.bg, minHeight: "100vh", padding: "140px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.accentText, margin: 0 }}>
            SELECTED WORK
          </p>
          <h1 style={{ fontFamily: fonts.display, fontSize: "clamp(48px, 8vw, 96px)", color: colors.text, margin: "8px 0 0", letterSpacing: 2, lineHeight: 0.95 }}>
            THE ARCHIVE
          </h1>
        </header>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 40 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH PROJECTS…"
            style={{
              flex: "1 1 240px", background: colors.surface, border: `1px solid ${colors.border}`,
              color: colors.text, padding: "12px 16px", borderRadius: 8, fontFamily: fonts.mono,
              fontSize: 12, letterSpacing: 1, outline: "none",
            }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <FilterChip label="ALL" active={!category} onClick={() => setCategory("")} />
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <FilterChip key={value} label={label} active={category === value} onClick={() => setCategory(value)} />
            ))}
          </div>
        </div>

        {status === "loading" && <Notice text="LOADING…" />}
        {status === "error" && <Notice text="COULDN'T LOAD PROJECTS. IS THE API RUNNING?" />}
        {status === "ready" && projects.length === 0 && <Notice text="NO PROJECTS MATCH." />}

        {status === "ready" && projects.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {projects.map((p, i) => <WorkCard key={p.id} project={p} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      data-hover
      onClick={onClick}
      style={{
        background: active ? colors.accent : "transparent",
        color: active ? "#000" : colors.textMuted,
        border: `1px solid ${active ? colors.accent : colors.border}`,
        padding: "8px 14px", borderRadius: 6, cursor: "pointer",
        fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: active ? 700 : 400,
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

function Notice({ text }) {
  return (
    <p style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2, color: colors.textMuted, padding: "60px 0", textAlign: "center" }}>
      {text}
    </p>
  );
}
