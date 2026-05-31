import { useState, useEffect } from "react";

export default function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY });
    const over  = e => { if (e.target.closest("button,a,[data-hover]")) setHovered(true); };
    const out   = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout",  out);
    };
  }, []);

  return (
    <div style={{
      position: "fixed", top: pos.y, left: pos.x, zIndex: 9999, pointerEvents: "none",
      transform: "translate(-50%,-50%)",
      width: hovered ? 40 : 10, height: hovered ? 40 : 10, borderRadius: "50%",
      background: hovered ? "transparent" : "#C8F53B",
      border: hovered ? "2px solid #C8F53B" : "none",
      transition: "width 0.2s, height 0.2s, background 0.2s",
      mixBlendMode: "difference",
    }} />
  );
}
