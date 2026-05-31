import { TICKER_ITEMS } from "../data";

export default function MarqueeBar() {
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "16px 0", background: "#0a0a0a" }}>
      <div style={{ display: "flex", gap: 64, whiteSpace: "nowrap", animation: "marquee 22s linear infinite", width: "max-content" }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4, color: i % 2 === 0 ? "#C8F53B" : "#333" }}>
            {item} <span style={{ color: "#222" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
