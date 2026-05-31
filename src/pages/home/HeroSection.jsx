import { useEffect, useRef } from "react";
import videoSrc from "../../assets/video/video-sample.mp4";
import { noiseUrl } from "../../data";
import Counter from "../../components/Counter";

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,245,59,${p.opacity})`; ctx.fill();
      });
      particles.forEach((p, i) => particles.slice(i + 1).forEach(q => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(200,245,59,${(1 - d / 120) * 0.1})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", padding: "clamp(80px,12vw,140px) clamp(16px,5vw,80px) 80px" }}>
      {/* Video background */}
      <video autoPlay muted loop playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2 }}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(8,8,8,0.62) 0%, rgba(8,8,8,0.38) 50%, rgba(8,8,8,0.72) 100%)", zIndex: -1 }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: noiseUrl, opacity: 0.03, zIndex: 1 }} />

      {/* Outer spinning ring */}
      <div className="hero-deco" style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", border: "1px solid #C8F53B22", animation: "spin 30s linear infinite", zIndex: 1 }}>
        {[0, 90, 180, 270].map(deg => (
          <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#C8F53B", transformOrigin: "0 0", transform: `rotate(${deg}deg) translateX(240px) translateY(-4px)` }} />
        ))}
      </div>

      {/* Inner ring */}
      <div className="hero-deco" style={{ position: "absolute", right: "calc(8% + 80px)", top: "50%", transform: "translateY(-50%)", width: 320, height: 320, borderRadius: "50%", border: "1px solid #7B61FF22", animation: "spin 20s linear infinite reverse", zIndex: 1 }} />

      {/* Floating hex */}
      <div className="hero-deco" style={{ position: "absolute", right: "calc(8% + 160px)", top: "50%", transform: "translateY(-50%)", width: 100, height: 100, zIndex: 2, animation: "float 6s ease-in-out infinite" }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#C8F53B" strokeWidth="1" fill="#C8F53B11" />
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="#C8F53B" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
          <circle cx="50" cy="50" r="4" fill="#C8F53B" />
        </svg>
      </div>

      {/* Mobile-only hero identity */}
      <div className="hero-mobile-text">
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px,15vw,88px)", letterSpacing: 2, color: "#fff", lineHeight: 1, margin: "0 0 8px" }}>
          FORGE<span style={{ color: "#C8F53B" }}>.</span>STUDIO
        </h2>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#555", margin: "10px 0 0" }}>
          INTERACTIVE EXPERIENCES · 3D · WEB
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="hero-bottom" style={{ position: "absolute", bottom: 40, left: 48, alignItems: "center", gap: 12, zIndex: 2, animation: "fadeSlide 1s 0.5s both" }}>
        <div style={{ width: 1, height: 60, background: "linear-gradient(#C8F53B,transparent)", animation: "pulse 2s infinite" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#444" }}>SCROLL TO EXPLORE</span>
      </div>

      {/* Hero stats */}
      <div className="hero-bottom" style={{ position: "absolute", bottom: 40, right: 48, gap: 40, zIndex: 2, animation: "fadeSlide 1s 0.6s both" }}>
        {[{ target: 48, label: "PROJECTS" }, { target: 5, label: "YEARS" }, { target: 32, label: "CLIENTS" }].map(s => (
          <div key={s.label} style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", lineHeight: 1 }}><Counter target={s.target} suffix="+" /></div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#444" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
