import Counter from "../../components/Counter";

export default function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="about-grid">
        <div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#C8F53B" }}>WHO WE ARE</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px,5vw,80px)", color: "#fff", letterSpacing: 2, lineHeight: 1, marginTop: 8, marginBottom: 24 }}>
            TWO PEOPLE.<br />ONE VISION.
          </h2>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 20, color: "#888", lineHeight: 1.7, marginBottom: 24 }}>
            A developer obsessed with performance and a designer obsessed with beauty — building things neither could create alone.
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#555", lineHeight: 1.9 }}>
            We take on 4–6 projects per year. Not because we can't handle more, but because every client deserves our full attention. If you're reading this, there's probably still a spot open.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { target: 48,  suffix: "+",   label: "PROJECTS SHIPPED" },
            { target: 5,   suffix: "yr",  label: "IN BUSINESS"      },
            { target: 32,  suffix: "+",   label: "HAPPY CLIENTS"    },
            { target: 100, suffix: "%",   label: "REMOTE-FIRST"     },
          ].map(s => (
            <div key={s.label} style={{ padding: 32, background: "#0D0D0D", borderRadius: 16, border: "1px solid #1a1a1a" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, color: "#C8F53B", lineHeight: 1, marginBottom: 8 }}>
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#555", letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
