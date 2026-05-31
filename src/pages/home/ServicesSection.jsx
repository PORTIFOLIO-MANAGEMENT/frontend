import { useState } from "react";
import { services } from "../../data";

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section id="services" className="section-pad" style={{ background: "#050505", borderTop: "1px solid #111" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#C8F53B" }}>WHAT WE DO</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px,6vw,96px)", color: "#fff", letterSpacing: 2, lineHeight: 1, marginTop: 8 }}>SERVICES</h2>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={s.id} data-hover
              onMouseEnter={() => setActiveService(i)}
              style={{
                padding: "40px 48px", borderRadius: 4,
                background: activeService === i ? "#0D0D0D" : "transparent",
                border: `1px solid ${activeService === i ? "#C8F53B22" : "#111"}`,
                cursor: "pointer", transition: "all 0.3s ease",
                animation: `fadeSlide 0.6s ${i * 0.1}s both`,
              }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 32, marginBottom: 12, color: activeService === i ? "#C8F53B" : "#333", transition: "color 0.3s" }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", letterSpacing: 2, lineHeight: 1 }}>{s.name}</h3>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: activeService === i ? "#C8F53B" : "#444", letterSpacing: 2, whiteSpace: "nowrap" }}>{s.price}</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#666", lineHeight: 1.8 }}>{s.desc}</p>
              {activeService === i && <div style={{ width: 40, height: 2, background: "#C8F53B", marginTop: 20 }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
