import api from "./api";

export async function listConversations() {
  const { data } = await api.get("/conversations");
  return data.data;
}

export async function getConversation(id) {
  const { data } = await api.get(`/conversations/${id}`);
  return data.data;
}

export async function startConversation(payload) {
  const { data } = await api.post("/conversations", payload);
  return data.data;
}

export async function sendMessage(conversationId, body) {
  const { data } = await api.post(`/conversations/${conversationId}/messages`, { body });
  return data.data;
}

export async function markConversationRead(conversationId) {
  await api.post(`/conversations/${conversationId}/read`);
}
