export default function Footer() {
  return (
    <footer className="site-footer">
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4, color: "#fff" }}>
        FORGE<span style={{ color: "#C8F53B" }}>.</span>STUDIO
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#444", letterSpacing: 2 }}>
        © 2025 · ALL RIGHTS RESERVED
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {["TWITTER", "DRIBBBLE", "GITHUB"].map(l => (
          <a key={l} data-hover href="#"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#555", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#C8F53B"}
            onMouseLeave={e => e.target.style.color = "#555"}>{l}</a>
        ))}
      </div>
    </footer>
  );
}
