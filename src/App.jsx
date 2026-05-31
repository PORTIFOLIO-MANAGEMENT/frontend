import { useState } from "react";
import { globalCss } from "./styles/globalCss";
import CursorDot from "./components/CursorDot";
import AIWidget from "./components/AIWidget";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import HeroSection from "./pages/home/HeroSection";
import MarqueeBar from "./components/MarqueeBar";
import WorkSection from "./pages/home/WorkSection";
import ServicesSection from "./pages/home/ServicesSection";
import AboutSection from "./pages/home/AboutSection";
import ContactSection from "./pages/home/ContactSection";

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <style>{globalCss}</style>
      <CursorDot />
      <Navbar setAiOpen={setAiOpen} />
      <HeroSection />
      <MarqueeBar />

      {/* ── CTA STRIP ── */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 16, padding: "44px 24px", flexWrap: "wrap",
        background: "#0a0a0a", borderBottom: "1px solid #1a1a1a",
      }}>
        <button data-hover
          onClick={() => document.getElementById("work").scrollIntoView({ behavior: "smooth" })}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          style={{ background: "#C8F53B", color: "#000", border: "none", borderRadius: 8, padding: "14px 32px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontWeight: 700, transition: "transform 0.2s", boxShadow: "0 8px 32px #C8F53B33" }}>
          VIEW OUR WORK →
        </button>
        <button data-hover onClick={() => setAiOpen(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8F53B"; e.currentTarget.style.color = "#C8F53B"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#fff"; }}
          style={{ background: "transparent", color: "#fff", border: "1px solid #333", borderRadius: 8, padding: "14px 32px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}>
          START A PROJECT
        </button>
      </div>

      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      {aiOpen && <AIWidget onClose={() => setAiOpen(false)} />}
      {!aiOpen && (
        <button data-hover onClick={() => setAiOpen(true)} style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg,#C8F53B,#7B61FF)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color: "#000",
          boxShadow: "0 8px 32px rgba(200,245,59,0.3)",
          animation: "pulse 3s infinite",
        }}>A</button>
      )}
    </>
  );
}
