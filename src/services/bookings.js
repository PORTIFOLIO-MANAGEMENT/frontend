import api from "./api";

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data; // { data, message }
}

export async function listBookings(params = {}) {
  const { data } = await api.get("/bookings", { params });
  return data.data;
}

export async function getBooking(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data.data;
}

export async function updateBookingStatus(id, payload) {
  const { data } = await api.patch(`/bookings/${id}/status`, payload);
  return data.data;
}

// Enum option lists (value → human label), mirroring the backend enums.
export const BUDGET_OPTIONS = [
  { value: "under_500", label: "Under $500" },
  { value: "500_1500", label: "$500 – $1,500" },
  { value: "1500_5000", label: "$1,500 – $5,000" },
  { value: "5000_15000", label: "$5,000 – $15,000" },
  { value: "15000_plus", label: "$15,000+" },
  { value: "flexible", label: "Flexible" },
];

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1_4_weeks", label: "1–4 weeks" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "flexible", label: "Flexible" },
];

export const BOOKING_STATUSES = [
  "draft", "submitted", "reviewing", "accepted", "declined", "completed", "cancelled",
];

export const STATUS_TONE = {
  submitted: "#7B61FF",
  reviewing: "#C8F53B",
  accepted: "#3BF5A0",
  declined: "#FF4D6D",
  completed: "#888888",
  cancelled: "#555555",
  draft: "#555555",
};

const LABELS = {
  ...Object.fromEntries(BUDGET_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(TIMELINE_OPTIONS.map((o) => [o.value, o.label])),
};
export const optionLabel = (v) => LABELS[v] ?? v;
