import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listBookings, STATUS_TONE, optionLabel } from "../../services/bookings";
import { getEcho } from "../../services/echo";
import MessagesPanel from "../../components/MessagesPanel";
import { colors, fonts } from "../../styles/theme";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("bookings"); // bookings | messages
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [flash, setFlash] = useState(null);

  const load = useCallback(async () => {
    try {
      setBookings(await listBookings());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Realtime: the studio updating a booking pushes here without a refresh.
  useEffect(() => {
    if (!user) return;
    let channel;
    try {
      channel = getEcho().private(`App.Models.User.${user.id}`);
      channel.listen(".booking.status", (e) => {
        setBookings((list) => list.map((b) => (b.id === e.id ? { ...b, status: e.status } : b)));
        setFlash(`${e.reference_code} → ${e.status.toUpperCase()}`);
        setTimeout(() => setFlash(null), 4000);
      });
    } catch {
      /* websocket optional — REST data still renders */
    }
    return () => { channel?.stopListening(".booking.status"); };
  }, [user]);

  return (
    <main style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: `1px solid ${colors.border}` }}>
        <Link to="/" style={{ fontFamily: fonts.display, fontSize: 22, letterSpacing: 3, color: colors.text, textDecoration: "none" }}>
          C2<span style={{ color: colors.accentText }}>.</span>Y
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>{user?.name}</span>
          <button onClick={logout} data-hover style={ghostBtn}>LOG OUT</button>
        </div>
      </header>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 2, margin: 0 }}>DASHBOARD</h1>
          <Link to="/book" data-hover style={{ ...ghostBtn, background: colors.accent, color: "#000", border: "none", fontWeight: 700 }}>+ NEW BOOKING</Link>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {["bookings", "messages"].map((t) => (
            <button key={t} onClick={() => setTab(t)} data-hover
              style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                background: tab === t ? colors.accent : "transparent", color: tab === t ? "#000" : colors.textMuted,
                border: `1px solid ${tab === t ? colors.accent : colors.border}`, fontWeight: tab === t ? 700 : 400 }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "messages" && <MessagesPanel canStart />}

        {tab === "bookings" && (<>
        {flash && (
          <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, color: "#000", background: colors.accent, padding: "10px 16px", borderRadius: 8, marginBottom: 20 }}>
            ⚡ LIVE UPDATE — {flash}
          </div>
        )}

        {status === "loading" && <Muted text="Loading…" />}
        {status === "error" && <Muted text="Couldn't load bookings." />}
        {status === "ready" && bookings.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Muted text="No bookings yet." />
            <Link to="/book" data-hover style={{ ...ghostBtn, display: "inline-block", marginTop: 16 }}>START A PROJECT</Link>
          </div>
        )}

        <div style={{ display: "grid", gap: 14 }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.accentText, letterSpacing: 1 }}>{b.reference_code}</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 26, letterSpacing: 1, marginTop: 4 }}>{b.service?.name ?? "Project"}</div>
                </div>
                <StatusPill status={b.status} />
              </div>
              <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, lineHeight: 1.6, margin: "12px 0 0" }}>
                {b.project_description}
              </p>
              <div style={{ display: "flex", gap: 18, marginTop: 14, fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint }}>
                <span>BUDGET: {optionLabel(b.budget_range)}</span>
                <span>TIMELINE: {optionLabel(b.timeline)}</span>
                {b.quoted_amount && <span style={{ color: colors.accentText }}>QUOTED: ${Number(b.quoted_amount).toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
        </>)}
      </div>
    </main>
  );
}

export function StatusPill({ status }) {
  const tone = STATUS_TONE[status] ?? colors.textMuted;
  return (
    <span style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: tone, border: `1px solid ${tone}66`, background: `${tone}11`, padding: "5px 12px", borderRadius: 20 }}>
      {(status ?? "").toUpperCase()}
    </span>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}

const ghostBtn = { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "10px 16px", borderRadius: 8, cursor: "pointer", textDecoration: "none" };
