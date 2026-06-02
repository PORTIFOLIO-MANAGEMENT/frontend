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
      <HeroSection setAiOpen={setAiOpen} />
      <MarqueeBar />
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
