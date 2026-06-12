import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollY } from "../hooks/useScrollY";
import { useAsync } from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";
import { listServices, listProjects, categoryLabel } from "../services/projects";
import ThemeToggle from "../components/ThemeToggle";

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "·";

// Price label from a service's API shape (mirrors ServicesSection).
function priceFor(s) {
  if (s.price_label) return s.price_label;
  if (s.starting_price) return `From $${Number(s.starting_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return "Let's talk";
}

export default function Navbar({ setAiOpen, setAccountOpen }) {
  const scrollY          = useScrollY();
  const navigate         = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimer    = useRef(null);

  // Live data for the mega-menus (services + featured projects).
  const { data: services } = useAsync(listServices, []);
  const { data: featured } = useAsync(() => listProjects({ featured: 1 }).then((r) => r.data.slice(0, 3)), []);
  const serviceList = services ?? [];
  const projectList = featured ?? [];

  const openDropdown  = name => { clearTimeout(dropdownTimer.current); setActiveDropdown(name); };
  const closeDropdown = ()   => { dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 200); };
  const scrollTo      = id   => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActiveDropdown(null); };
  const goProject     = slug => { setActiveDropdown(null); navigate(`/work/${slug}`); };

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
        <Link to="/" data-hover style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: "#fff", flexShrink: 0, textDecoration: "none" }}>
          C2<span style={{ color: "#C8F53B" }}>.</span>Y
        </Link>

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
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/studio" data-hover className="desktop-only"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "10px 16px", border: "1px solid #2a2a2a", borderRadius: 8 }}>
                  STUDIO
                </Link>
              )}
              <button data-hover data-tour="account" onClick={() => setAccountOpen?.(true)}
                style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", padding: "8px 14px 8px 8px", background: "#C8F53B", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.85)", color: "#C8F53B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{initials(user?.name)}</span>
                ACCOUNT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" data-hover
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#444"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "10px 18px", border: "1px solid #2a2a2a", borderRadius: 8, transition: "color 0.2s, border-color 0.2s" }}>
                LOGIN
              </Link>
              <Link to="/register" data-hover
                onMouseEnter={e => e.currentTarget.style.background = "#b8e032"}
                onMouseLeave={e => e.currentTarget.style.background = "#C8F53B"}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", textDecoration: "none", padding: "10px 18px", background: "#C8F53B", borderRadius: 8, fontWeight: 700, transition: "background 0.2s" }}>
                REGISTER
              </Link>
            </>
          )}
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
          <span className="sidebar-logo">C2<span style={{ color: "#C8F53B" }}>.</span>Y</span>
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
            <ThemeToggle variant="full" />
            {isAuthenticated ? (
              <>
                <button onClick={() => { setAccountOpen?.(true); setMobileMenuOpen(false); }}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", padding: "13px 18px", background: "#C8F53B", borderRadius: 8, fontWeight: 700, textAlign: "center", display: "block", width: "100%", border: "none", cursor: "pointer" }}>
                  MY ACCOUNT
                </button>
                {isAdmin && (
                  <Link to="/studio" onClick={() => setMobileMenuOpen(false)}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "13px 18px", border: "1px solid #2a2a2a", borderRadius: 8, textAlign: "center", display: "block" }}>
                    STUDIO CONSOLE
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", padding: "13px 18px", border: "1px solid #2a2a2a", borderRadius: 8, textAlign: "center", display: "block", width: "100%", background: "transparent", cursor: "pointer" }}>
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#888", textDecoration: "none", padding: "13px 18px", border: "1px solid #2a2a2a", borderRadius: 8, textAlign: "center", transition: "color 0.2s, border-color 0.2s", display: "block" }}>
                  LOGIN
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#000", textDecoration: "none", padding: "13px 18px", background: "#C8F53B", borderRadius: 8, fontWeight: 700, textAlign: "center", display: "block" }}>
                  REGISTER
                </Link>
              </>
            )}
            <button onClick={() => { setAiOpen(true); setMobileMenuOpen(false); }}
              style={{ background: "transparent", color: "#C8F53B", border: "1px solid #C8F53B44", borderRadius: 8, padding: "13px 18px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F53B", display: "inline-block", animation: "pulse 2s infinite" }} />
              ASK ARIA
            </button>
          </div>
          <p className="sidebar-footer-tagline">C2.Y · 2026 · INTERACTIVE EXPERIENCES</p>
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
            <p className="mega-side-text">Disciplines.<br />Zero compromise.</p>
          </div>
          <div className="mega-col">
            {serviceList.slice(0, Math.ceil(serviceList.length / 2)).map((s, i) => (
              <div key={s.id} className="mega-srv-item" onClick={() => scrollTo("services")}>
                <div className="mega-srv-num">0{i + 1} —</div>
                <div className="mega-srv-head">
                  <span className="mega-srv-icon">{s.icon_glyph || "◆"}</span>
                  <div>
                    <div className="mega-srv-name">{s.name}</div>
                    <div className="mega-srv-desc">{s.short_desc}</div>
                    <div className="mega-srv-price">{priceFor(s)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mega-col">
            {serviceList.slice(Math.ceil(serviceList.length / 2)).map((s, i) => (
              <div key={s.id} className="mega-srv-item" onClick={() => scrollTo("services")}>
                <div className="mega-srv-num">0{Math.ceil(serviceList.length / 2) + i + 1} —</div>
                <div className="mega-srv-head">
                  <span className="mega-srv-icon">{s.icon_glyph || "◆"}</span>
                  <div>
                    <div className="mega-srv-name">{s.name}</div>
                    <div className="mega-srv-desc">{s.short_desc}</div>
                    <div className="mega-srv-price">{priceFor(s)}</div>
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
            <p className="mega-side-text">Featured projects.<br />Each one different.</p>
          </div>
          {projectList.map((p, i) => (
            <div key={p.id} className="mega-wrk-card" onClick={() => goProject(p.slug)}>
              <div className="mega-wrk-num">0{i + 1}</div>
              <div className="mega-wrk-cat">{categoryLabel(p.category)}</div>
              <div className="mega-wrk-title" style={{ color: p.color_accent || "#C8F53B" }}>{p.title}</div>
              <div className="mega-wrk-desc">{p.tagline || p.description}</div>
            </div>
          ))}
          <div className="mega-cta-col">
            <div>
              <div className="mega-lbl">FULL ARCHIVE</div>
              <p className="mega-cta-note">Every project, every detail.</p>
            </div>
            <button className="mega-cta-btn" onClick={() => navigate("/work")}>VIEW ALL WORK →</button>
          </div>
        </div>
      </div>
    </>
  );
}
