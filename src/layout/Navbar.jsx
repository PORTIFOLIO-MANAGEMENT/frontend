import { useState, useRef } from "react";
import { useScrollY } from "../hooks/useScrollY";
import { projects, services } from "../data";

export default function Navbar({ setAiOpen }) {
  const scrollY          = useScrollY();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimer    = useRef(null);

  const openDropdown  = name => { clearTimeout(dropdownTimer.current); setActiveDropdown(name); };
  const closeDropdown = ()   => { dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 200); };
  const scrollTo      = id   => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActiveDropdown(null); };

  return (
    <>
      {/* ── NAV ── */}
      <nav className="rsp-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 60 ? "rgba(8,8,8,0.95)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
        borderBottom: scrollY > 60 ? "1px solid #1a1a1a" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: "#fff", flexShrink: 0 }}>
          FORGE<span style={{ color: "#C8F53B" }}>.</span>STUDIO
        </div>

        <div className="nav-links" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2 }}>
          {["WORK", "SERVICES"].map(l => (
            <button key={l}
              className={`nav-trigger${activeDropdown === l.toLowerCase() ? " active" : ""}`}
              onMouseEnter={() => openDropdown(l.toLowerCase())}
              onMouseLeave={closeDropdown}
              onClick={() => setActiveDropdown(d => d === l.toLowerCase() ? null : l.toLowerCase())}
            >{l} <span className="nav-arrow">▼</span></button>
          ))}
          {["ABOUT", "CONTACT"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} data-hover
              style={{ color: "#888", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#C8F53B"}
              onMouseLeave={e => e.target.style.color = "#888"}>{l}</a>
          ))}
        </div>

        <div className="nav-actions">
          <a href="/login" data-hover
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#444"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "10px 18px", border: "1px solid #2a2a2a", borderRadius: 8, transition: "color 0.2s, border-color 0.2s" }}>
            LOGIN
          </a>
          <a href="/register" data-hover
            onMouseEnter={e => e.currentTarget.style.background = "#b8e032"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8F53B"}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", textDecoration: "none", padding: "10px 18px", background: "#C8F53B", borderRadius: 8, fontWeight: 700, transition: "background 0.2s" }}>
            REGISTER
          </a>
          <button data-hover onClick={() => setAiOpen(true)}
            onMouseEnter={e => { e.currentTarget.style.background = "#C8F53B11"; e.currentTarget.style.borderColor = "#C8F53B"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#C8F53B44"; }}
            style={{ background: "transparent", color: "#C8F53B", border: "1px solid #C8F53B44", borderRadius: 8, padding: "10px 18px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, transition: "border-color 0.2s, background 0.2s" }}>
            <span style={{ animation: "pulse 2s infinite", display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#C8F53B" }} />
            ASK ARIA
          </button>
          <button className="hamburger" onClick={() => setMobileMenuOpen(m => !m)} aria-label="Toggle menu">
            <span style={{ transform: mobileMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
            <span style={{ transform: mobileMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* ── SIDEBAR OVERLAY ── */}
      <div className={`sidebar-overlay${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(false)} />

      {/* ── SIDEBAR DRAWER ── */}
      <aside className={`sidebar${mobileMenuOpen ? " open" : ""}`} aria-label="Navigation menu">
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-logo">FORGE<span style={{ color: "#C8F53B" }}>.</span>STUDIO</span>
          <button className="sidebar-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {[
            { label: "WORK",     id: "work"     },
            { label: "SERVICES", id: "services" },
            { label: "ABOUT",    id: "about"    },
            { label: "CONTACT",  id: "contact"  },
          ].map((item, i) => (
            <button key={item.label} className="sidebar-link"
              onClick={() => { document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}>
              <span className="sidebar-link-idx">0{i + 1}</span>
              <span>{item.label}</span>
              <span className="sidebar-link-arr">→</span>
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-btns">
            <a href="/login"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "13px 18px", border: "1px solid #2a2a2a", borderRadius: 8, textAlign: "center", transition: "color 0.2s, border-color 0.2s", display: "block" }}>
              LOGIN
            </a>
            <a href="/register"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", textDecoration: "none", padding: "13px 18px", background: "#C8F53B", borderRadius: 8, fontWeight: 700, textAlign: "center", display: "block" }}>
              REGISTER
            </a>
            <button onClick={() => { setAiOpen(true); setMobileMenuOpen(false); }}
              style={{ background: "transparent", color: "#C8F53B", border: "1px solid #C8F53B44", borderRadius: 8, padding: "13px 18px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F53B", display: "inline-block", animation: "pulse 2s infinite" }} />
              ASK ARIA
            </button>
          </div>
          <p className="sidebar-footer-tagline">FORGE.STUDIO · 2025 · INTERACTIVE EXPERIENCES</p>
        </div>
      </aside>

      {/* ── MEGA OVERLAY ── */}
      <div className={`mega-overlay${activeDropdown ? " open" : ""}`} onClick={() => setActiveDropdown(null)} />

      {/* ── MEGA: SERVICES ── */}
      <div className={`mega-panel${activeDropdown === "services" ? " open" : ""}`}
        onMouseEnter={() => clearTimeout(dropdownTimer.current)}
        onMouseLeave={closeDropdown}>
        <div className="mega-inner srv-layout">
          <div className="mega-side-label">
            <div className="mega-lbl">WHAT WE DO</div>
            <p className="mega-side-text">Four disciplines.<br />Zero compromise.</p>
          </div>
          <div className="mega-col">
            {services.slice(0, 2).map(s => (
              <div key={s.id} className="mega-srv-item" onClick={() => scrollTo("services")}>
                <div className="mega-srv-num">0{s.id} —</div>
                <div className="mega-srv-head">
                  <span className="mega-srv-icon">{s.icon}</span>
                  <div>
                    <div className="mega-srv-name">{s.name}</div>
                    <div className="mega-srv-desc">{s.desc}</div>
                    <div className="mega-srv-price">{s.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mega-col">
            {services.slice(2).map(s => (
              <div key={s.id} className="mega-srv-item" onClick={() => scrollTo("services")}>
                <div className="mega-srv-num">0{s.id} —</div>
                <div className="mega-srv-head">
                  <span className="mega-srv-icon">{s.icon}</span>
                  <div>
                    <div className="mega-srv-name">{s.name}</div>
                    <div className="mega-srv-desc">{s.desc}</div>
                    <div className="mega-srv-price">{s.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mega-cta-col">
            <div>
              <div className="mega-lbl">READY TO START?</div>
              <p className="mega-cta-note">We take on 4–6 projects per year. Spots fill fast.</p>
            </div>
            <button className="mega-cta-btn" onClick={() => scrollTo("contact")}>START A PROJECT →</button>
          </div>
        </div>
      </div>

      {/* ── MEGA: WORK ── */}
      <div className={`mega-panel${activeDropdown === "work" ? " open" : ""}`}
        onMouseEnter={() => clearTimeout(dropdownTimer.current)}
        onMouseLeave={closeDropdown}>
        <div className="mega-inner wrk-layout">
          <div className="mega-side-label">
            <div className="mega-lbl">SELECTED WORK</div>
            <p className="mega-side-text">48+ projects.<br />Each one different.</p>
          </div>
          {projects.map(p => (
            <div key={p.id} className="mega-wrk-card" onClick={() => scrollTo("work")}>
              <div className="mega-wrk-num">0{p.id}</div>
              <div className="mega-wrk-cat">{p.category}</div>
              <div className="mega-wrk-title" style={{ color: p.accent }}>{p.title}</div>
              <div className="mega-wrk-desc">{p.description}</div>
            </div>
          ))}
          <div className="mega-cta-col">
            <div>
              <div className="mega-lbl">FULL ARCHIVE</div>
              <p className="mega-cta-note">Every project, every detail.</p>
            </div>
            <button className="mega-cta-btn" onClick={() => scrollTo("work")}>VIEW ALL WORK →</button>
          </div>
        </div>
      </div>
    </>
  );
}
