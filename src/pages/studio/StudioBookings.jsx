import { useEffect, useState, useCallback } from "react";
import { listBookings, updateBookingStatus, BOOKING_STATUSES, STATUS_TONE, optionLabel } from "../../services/bookings";
import { getEcho } from "../../services/echo";
import { colors, fonts } from "../../styles/theme";

export default function StudioBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    try {
      setBookings(await listBookings(filter ? { status: filter } : {}));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Live pipeline: any partner's change refreshes both consoles.
  useEffect(() => {
    let channel;
    try {
      channel = getEcho().private("studio");
      channel.listen(".booking.status", () => load());
    } catch { /* websocket optional */ }
    return () => { channel?.stopListening(".booking.status"); };
  }, [load]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, margin: 0 }}>PIPELINE</h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Chip label="ALL" active={!filter} onClick={() => setFilter("")} />
          {BOOKING_STATUSES.map((s) => <Chip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)}
        </div>
      </div>

      {status === "loading" && <Muted text="Loading…" />}
      {status === "error" && <Muted text="Failed to load." />}
      {status === "ready" && bookings.length === 0 && <Muted text="No bookings in this view." />}

      <div style={{ display: "grid", gap: 14 }}>
        {bookings.map((b) => <BookingRow key={b.id} booking={b} onChanged={load} />)}
      </div>
    </div>
  );
}

function BookingRow({ booking, onChanged }) {
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState(booking.status);
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("");
  const [busy, setBusy] = useState(false);
  const tone = STATUS_TONE[booking.status] ?? colors.textMuted;

  const apply = async () => {
    setBusy(true);
    try {
      const payload = { status: next };
      if (note.trim()) payload.note = note.trim();
      if (next === "declined" && note.trim()) payload.declined_reason = note.trim();
      if (quote) payload.quoted_amount = Number(quote);
      await updateBookingStatus(booking.id, payload);
      setOpen(false);
      setNote("");
      setQuote("");
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.accentText }}>{booking.reference_code}</span>
            <span style={{ fontFamily: fonts.mono, fontSize: 10, color: "#000", background: priorityColor(booking.priority_score), padding: "2px 8px", borderRadius: 10 }}>
              ★ {booking.priority_score}
            </span>
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, marginTop: 4 }}>{booking.service?.name ?? "Project"}</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
            {booking.contact_name} · {booking.contact_email}{booking.contact_company ? ` · ${booking.contact_company}` : ""}
          </div>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: tone, border: `1px solid ${tone}66`, background: `${tone}11`, padding: "5px 12px", borderRadius: 20 }}>
          {(booking.status ?? "").toUpperCase()}
        </span>
      </div>

      <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, lineHeight: 1.6, margin: "12px 0" }}>{booking.project_description}</p>

      <div style={{ display: "flex", gap: 16, fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, flexWrap: "wrap" }}>
        <span>BUDGET: {optionLabel(booking.budget_range)}</span>
        <span>TIMELINE: {optionLabel(booking.timeline)}</span>
        {booking.quoted_amount && <span style={{ color: colors.accentText }}>QUOTED: ${Number(booking.quoted_amount).toLocaleString()}</span>}
        {(booking.reference_urls ?? []).map((u) => (
          <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ color: colors.purple }}>↗ ref</a>
        ))}
      </div>

      <button onClick={() => setOpen((o) => !o)} data-hover
        style={{ marginTop: 14, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.text, background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>
        {open ? "CLOSE" : "MANAGE →"}
      </button>

      {open && (
        <div style={{ marginTop: 14, borderTop: `1px solid ${colors.border}`, paddingTop: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <select value={next} onChange={(e) => setNext(e.target.value)} style={ctrl}>
            {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote $ (optional)" type="number" style={{ ...ctrl, width: 150 }} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note / decline reason" style={{ ...ctrl, flex: "1 1 200px" }} />
          <button onClick={apply} disabled={busy} data-hover
            style={{ background: colors.accent, color: "#000", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "…" : "APPLY"}
          </button>
        </div>
      )}
    </div>
  );
}

function priorityColor(score) {
  if (score >= 40) return "#FF4D6D";
  if (score >= 20) return "#C8F53B";
  return "#555";
}
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} data-hover
      style={{ background: active ? colors.accent : "transparent", color: active ? "#000" : colors.textMuted, border: `1px solid ${active ? colors.accent : colors.border}`, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, fontWeight: active ? 700 : 400 }}>
      {label.toUpperCase()}
    </button>
  );
}
function Muted({ text }) {
  return <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>{text}</p>;
}
const ctrl = { background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: fonts.mono, fontSize: 11 };
