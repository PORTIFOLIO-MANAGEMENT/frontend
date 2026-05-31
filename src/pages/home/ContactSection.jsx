import { useState } from "react";
import { bookingFields } from "../../data";

export default function ContactSection() {
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState({ service: "", budget: "", timeline: "", description: "" });
  const [submitted,   setSubmitted]   = useState(false);

  const handleSubmit = () => {
    if (bookingStep < 3) { setBookingStep(s => s + 1); return; }
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-pad" style={{ background: "#050505", borderTop: "1px solid #111" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#C8F53B" }}>START A PROJECT</span>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px,6vw,80px)", color: "#fff", letterSpacing: 2, lineHeight: 1, marginTop: 8, marginBottom: 48 }}>
          LET'S BUILD<br />SOMETHING
        </h2>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "80px 40px", border: "1px solid #C8F53B22", borderRadius: 20, background: "#0D0D0D" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#C8F53B", marginBottom: 16 }}>◈</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#fff", letterSpacing: 2, marginBottom: 12 }}>BRIEF RECEIVED</h3>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#666", lineHeight: 1.8 }}>
              We'll review your project and respond within 24 hours. Check your inbox.
            </p>
          </div>
        ) : (
          <div style={{ background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 20, padding: 48 }}>
            {/* Progress bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {[0, 1, 2, 3].map(step => (
                <div key={step} style={{ flex: 1, height: 2, borderRadius: 2, background: step <= bookingStep ? "#C8F53B" : "#222", transition: "background 0.3s" }} />
              ))}
            </div>

            {/* Field */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#C8F53B", display: "block", marginBottom: 12 }}>
                {bookingFields[bookingStep].label}
              </label>
              {bookingFields[bookingStep].type === "textarea" ? (
                <textarea
                  value={bookingData[bookingFields[bookingStep].key]}
                  onChange={e => setBookingData(d => ({ ...d, [bookingFields[bookingStep].key]: e.target.value }))}
                  placeholder={bookingFields[bookingStep].placeholder}
                  rows={5}
                  style={{ width: "100%", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "14px 16px", color: "#fff", fontSize: 13, resize: "vertical", outline: "none", lineHeight: 1.6 }}
                />
              ) : (
                <input
                  value={bookingData[bookingFields[bookingStep].key]}
                  onChange={e => setBookingData(d => ({ ...d, [bookingFields[bookingStep].key]: e.target.value }))}
                  placeholder={bookingFields[bookingStep].placeholder}
                  style={{ width: "100%", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "14px 16px", color: "#fff", fontSize: 13, outline: "none" }}
                />
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {bookingStep > 0 ? (
                <button data-hover onClick={() => setBookingStep(s => s - 1)} style={{ background: "transparent", color: "#666", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2 }}>← BACK</button>
              ) : <div />}
              <button data-hover onClick={handleSubmit} style={{ background: "#C8F53B", color: "#000", border: "none", borderRadius: 8, padding: "14px 32px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontWeight: 700 }}>
                {bookingStep < 3 ? "NEXT →" : "SEND BRIEF ◈"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
