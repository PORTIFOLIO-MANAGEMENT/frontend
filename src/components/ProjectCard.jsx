import { useState } from "react";

export default function ProjectCard({ p, index }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      data-hover
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? p.gradient : "#0D0D0D",
        border: `1px solid ${hov ? p.accent + "44" : "#1e1e1e"}`,
        borderRadius: 20, padding: 32, cursor: "pointer",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov ? `0 32px 64px ${p.accent}22` : "none",
        animation: `fadeSlide 0.6s ${index * 0.15}s both`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ width: hov ? "100%" : 48, height: 2, background: p.accent, marginBottom: 24, transition: "width 0.4s ease", borderRadius: 2 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 11, letterSpacing: 3, color: p.accent, fontFamily: "'Space Mono', monospace" }}>{p.category}</span>
        <span style={{ fontSize: 11, color: "#444", fontFamily: "'Space Mono', monospace" }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#fff", margin: "0 0 12px", letterSpacing: 2, lineHeight: 1 }}>{p.title}</h3>
      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>{p.description}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {p.tags.map(t => (
          <span key={t} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, border: `1px solid ${p.accent}44`, color: p.accent, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24, borderTop: "1px solid #1e1e1e", paddingTop: 20 }}>
        {[["👁", p.stats.views, "views"], ["♥", p.stats.likes, "likes"], ["★", p.stats.hires, "hires"]].map(([icon, val, label]) => (
          <div key={label}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>{icon} {val}</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>
      {hov && (
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 48, height: 48, borderRadius: "50%", background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 18, animation: "popIn 0.3s ease" }}>→</div>
      )}
    </div>
  );
}
