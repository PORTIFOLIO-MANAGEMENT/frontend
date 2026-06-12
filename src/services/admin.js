import api from "./api";

// Admin/studio API calls (require an authenticated admin JWT).

export async function adminListProjects() {
  const { data } = await api.get("/projects", { params: { all: 1 } });
  return data.data;
}

export async function adminGetProject(slug) {
  const { data } = await api.get(`/projects/${slug}`);
  return data.data;
}

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data.data;
}

export async function updateProject(slug, payload) {
  const { data } = await api.patch(`/projects/${slug}`, payload);
  return data.data;
}

export async function uploadMedia(slug, { file, type, caption = "", isCover = false, onProgress } = {}) {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  if (caption) form.append("caption", caption);
  if (isCover) form.append("is_cover", "1");

  const { data } = await api.post(`/projects/${slug}/media`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data.data;
}

export async function setMediaCover(mediaId) {
  const { data } = await api.patch(`/media/${mediaId}`, { is_cover: true });
  return data.data;
}

export async function deleteMedia(mediaId) {
  await api.delete(`/media/${mediaId}`);
}

// --- Comment moderation -----------------------------------------------------

export async function adminListComments({ pending = false } = {}) {
  const { data } = await api.get("/admin/comments", { params: pending ? { pending: 1 } : {} });
  return data.data;
}

export async function moderateComment(commentId, payload) {
  const { data } = await api.patch(`/comments/${commentId}/moderate`, payload);
  return data.data;
}

// --- User management --------------------------------------------------------

export async function adminListUsers(params = {}) {
  const { data } = await api.get("/admin/users", { params });
  return data; // { data: [...], meta, links }
}

export async function adminGetUser(id) {
  const { data } = await api.get(`/admin/users/${id}`);
  return data.data;
}

export async function adminUpdateUser(id, payload) {
  const { data } = await api.patch(`/admin/users/${id}`, payload);
  return data.data;
}

export async function adminDeleteUser(id) {
  await api.delete(`/admin/users/${id}`);
}

// --- Service catalog --------------------------------------------------------

export async function adminListServices() {
  const { data } = await api.get("/admin/services");
  return data.data;
}

export async function createService(payload) {
  const { data } = await api.post("/services", payload);
  return data.data;
}

export async function updateService(id, payload) {
  const { data } = await api.patch(`/services/${id}`, payload);
  return data.data;
}

export async function deleteService(id) {
  await api.delete(`/services/${id}`);
}

// --- Team roster ------------------------------------------------------------

export async function adminListTeam() {
  const { data } = await api.get("/admin/team");
  return data.data;
}

export async function createTeamMember(payload) {
  const { data } = await api.post("/team", payload);
  return data.data;
}

export async function updateTeamMember(id, payload) {
  const { data } = await api.patch(`/team/${id}`, payload);
  return data.data;
}

export async function deleteTeamMember(id) {
  await api.delete(`/team/${id}`);
}

export async function uploadTeamAvatar(id, file, onProgress) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post(`/team/${id}/avatar`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data.data;
}

// --- Analytics --------------------------------------------------------------

export async function getAnalyticsSummary(days = 14) {
  const { data } = await api.get("/admin/analytics/summary", { params: { days } });
  return data;
}
