import { useCallback, useEffect, useState } from "react";
import { getAnalyticsSummary } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

const SCROLL_LABELS = { 1: "0–25%", 2: "25–50%", 3: "50–75%", 4: "75–100%" };

export default function StudioAnalytics() {
  const [days, setDays] = useState(14);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setData(await getAnalyticsSummary(days));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [days]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const fmtTime = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>ANALYTICS</h1>
        <div style={{ display: "flex", border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden" }}>
          {[7, 14, 30].map((d) => (
            <button key={d} onClick={() => setDays(d)} data-hover
              style={{ background: days === d ? colors.accent : "transparent", color: days === d ? "#000" : colors.textMuted, border: "none", padding: "8px 14px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, fontWeight: days === d ? 700 : 400 }}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load analytics." />}

      {status === "ready" && data && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
            <Stat label="PAGE VIEWS" value={data.total_pageviews} />
            <Stat label="UNIQUE VISITORS" value={data.unique_sessions} />
            <Stat label="LOGGED-IN SESSIONS" value={data.logged_in_sessions} />
            <Stat label="AVG TIME / PAGE" value={fmtTime(data.avg_time_on_page_ms || 0)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <Panel title="VIEWS OVER TIME">
              <BarList items={(data.views_over_time ?? []).map((r) => ({ label: r.day?.slice(5), value: Number(r.views) }))} />
            </Panel>
            <Panel title="TOP PAGES">
              <BarList items={(data.top_pages ?? []).map((r) => ({ label: r.path || "/", value: Number(r.views) }))} />
            </Panel>
            <Panel title="SCROLL DEPTH">
              <BarList items={(data.scroll_buckets ?? []).map((r) => ({ label: SCROLL_LABELS[r.bucket] ?? `b${r.bucket}`, value: Number(r.count) }))} />
            </Panel>
            <Panel title="TOP CLICKS">
              <BarList items={(data.top_clicks ?? []).map((r) => ({ label: r.label || "—", value: Number(r.clicks) }))} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontFamily: fonts.display, fontSize: 40, color: colors.accentText, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, letterSpacing: 2, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.textFaint, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function BarList({ items }) {
  if (!items.length) return <Muted text="No data yet." />;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((i, idx) => (
        <div key={idx}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>{i.label}</span>
            <span style={{ color: colors.text }}>{i.value}</span>
          </div>
          <div style={{ height: 6, background: colors.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(i.value / max) * 100}%`, height: "100%", background: colors.accent, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
