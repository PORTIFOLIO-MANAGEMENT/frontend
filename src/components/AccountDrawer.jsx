import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listBookings, optionLabel } from "../services/bookings";
import { StatusPill } from "../pages/dashboard/DashboardPage";
import MessagesPanel from "./MessagesPanel";
import { colors, fonts } from "../styles/theme";

const initials = (name = "") =>
  name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "·";

// Slide-over account panel so signed-in clients manage bookings/messages/profile
// without leaving the public site. Opened from the Navbar.
export default function AccountDrawer({ open, onClose, onReplayTour }) {
  const { user, logout, isAdmin } = useAuth();
  // Admins aren't clients: no bookings, no starting client threads — they work
  // in the studio (bookings pipeline + INBOX). Their drawer is just a profile.
  const tabs = isAdmin ? ["profile"] : ["bookings", "messages", "profile"];
  const [tab, setTab] = useState(isAdmin ? "profile" : "bookings");

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: open ? "rgba(0,0,0,0.6)" : "transparent",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
          transition: "opacity 0.35s ease",
        }}
      />
      <aside
        aria-label="Account panel"
        style={{
          position: "fixed", top: 0, right: 0, height: "100dvh", zIndex: 1101,
          width: "min(460px, 100vw)", background: colors.bg,
          borderLeft: `1px solid ${colors.border}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", flexDirection: "column", boxShadow: open ? "-24px 0 80px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.accent + "1a", border: `1px solid ${colors.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontSize: 16, color: colors.accentText }}>
              {initials(user?.name)}
            </div>
            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.text, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close account panel" data-hover
            style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: colors.textMuted, fontSize: 15 }}>✕</button>
        </div>

        {/* Tabs (clients only — admins get a single profile view) */}
        {tabs.length > 1 && (
          <div style={{ display: "flex", gap: 4, padding: "16px 24px 0" }}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} data-hover
                style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                  background: tab === t ? colors.accent : "transparent", color: tab === t ? "#000" : colors.textMuted,
                  border: `1px solid ${tab === t ? colors.accent : colors.border}`, fontWeight: tab === t ? 700 : 400 }}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {!isAdmin && tab === "bookings" && <BookingsTab open={open} />}
          {!isAdmin && tab === "messages" && <MessagesPanel canStart />}
          {tab === "profile" && (
            <ProfileTab user={user} isAdmin={isAdmin} onLogout={logout} onReplayTour={onReplayTour} onClose={onClose} />
          )}
        </div>
      </aside>
    </>
  );
}

function BookingsTab({ open }) {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setBookings(await listBookings());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  // Refresh each time the drawer opens so data is fresh.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) load(); }, [open, load]);

  if (status === "loading") return <Muted text="Loading…" />;
  if (status === "error") return <Muted text="Couldn't load bookings." />;
  if (bookings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Muted text="No bookings yet." />
        <Link to="/book" data-hover style={{ ...ghostBtn, display: "inline-block", marginTop: 14 }}>START A PROJECT</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {bookings.map((b) => (
        <div key={b.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accentText, letterSpacing: 1 }}>{b.reference_code}</div>
              <div style={{ fontFamily: fonts.display, fontSize: 22, letterSpacing: 1, marginTop: 2 }}>{b.service?.name ?? "Project"}</div>
            </div>
            <StatusPill status={b.status} />
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 12, fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, flexWrap: "wrap" }}>
            <span>BUDGET: {optionLabel(b.budget_range)}</span>
            <span>TIMELINE: {optionLabel(b.timeline)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ user, isAdmin, onLogout, onReplayTour, onClose }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Row label="NAME" value={user?.name} />
      <Row label="EMAIL" value={user?.email} />
      {user?.company && <Row label="COMPANY" value={user.company} />}
      <Row label="ROLE" value={(user?.role ?? "").toUpperCase()} />

      <div style={{ height: 1, background: colors.border, margin: "8px 0" }} />

      {isAdmin ? (
        <>
          <Link to="/studio" onClick={onClose} data-hover style={{ ...ghostBtn, textAlign: "center", color: colors.accentText, borderColor: colors.accent + "55" }}>
            STUDIO CONSOLE →
          </Link>
          <p style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, letterSpacing: 1, lineHeight: 1.6, margin: "2px 2px" }}>
            Messages & the bookings pipeline are managed in the Studio.
          </p>
        </>
      ) : (
        <Link to="/book" onClick={onClose} data-hover style={{ ...ghostBtn, textAlign: "center" }}>+ NEW BOOKING</Link>
      )}
      <button onClick={() => { onClose?.(); onReplayTour?.(); }} data-hover style={{ ...ghostBtn, cursor: "pointer" }}>↻ REPLAY TOUR</button>
      <button onClick={onLogout} data-hover style={{ ...ghostBtn, cursor: "pointer", color: colors.pink, borderColor: colors.pink + "55" }}>LOG OUT</button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, color: colors.textFaint, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.text }}>{value}</div>
    </div>
  );
}

function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}

const ghostBtn = { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.textMuted, background: "transparent", border: `1px solid ${colors.border}`, padding: "12px 16px", borderRadius: 8, textDecoration: "none", display: "block", width: "100%", boxSizing: "border-box" };
