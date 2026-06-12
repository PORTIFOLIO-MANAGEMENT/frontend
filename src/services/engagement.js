import api from "./api";

// Persistent anonymous id so guests' reactions dedupe across reloads.
const SID_KEY = "pm_session_id";
export function sessionId() {
  let id = localStorage.getItem(SID_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(SID_KEY, id);
  }
  return id;
}

export async function getReactions(slug) {
  const { data } = await api.get(`/projects/${slug}/reactions`, { params: { session_id: sessionId() } });
  return data; // { counts, mine }
}

export async function toggleReaction(slug, type) {
  const { data } = await api.post(`/projects/${slug}/reactions`, { type, session_id: sessionId() });
  return data;
}

export async function getComments(slug) {
  const { data } = await api.get(`/projects/${slug}/comments`);
  return data.data;
}

export async function postComment(slug, payload) {
  const { data } = await api.post(`/projects/${slug}/comments`, payload);
  return data.data;
}

export async function likeComment(id) {
  const { data } = await api.post(`/comments/${id}/like`);
  return data.data;
}

export async function deleteComment(id) {
  await api.delete(`/comments/${id}`);
}

export const REACTIONS = [
  { type: "inspired", label: "Inspired", glyph: "✦" },
  { type: "hire_ready", label: "Hire-ready", glyph: "◎" },
  { type: "technical_interest", label: "Technical interest", glyph: "‹/›" },
  { type: "breakdown_request", label: "Breakdown request", glyph: "⊹" },
];
