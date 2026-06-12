import api from "./api";

// Thin wrappers around the showcase API. Components stay declarative and the
// endpoint shapes live in one place.

export async function listProjects(params = {}) {
  const { data } = await api.get("/projects", { params });
  return data; // { data: [...], links, meta }
}

export async function getProject(slug) {
  const { data } = await api.get(`/projects/${slug}`);
  return data.data;
}

export async function listServices() {
  const { data } = await api.get("/services");
  return data.data;
}

export async function listTeam() {
  const { data } = await api.get("/team");
  return data.data;
}

// Human labels for the project_category enum values returned by the API.
export const CATEGORY_LABELS = {
  web_app: "WEB APP",
  mobile_app: "MOBILE APP",
  "3d_modeling": "3D MODELING",
  motion_design: "MOTION DESIGN",
  brand_identity: "BRAND IDENTITY",
  interactive_experience: "INTERACTIVE",
  full_stack: "FULL-STACK",
};

export const categoryLabel = (c) => CATEGORY_LABELS[c] ?? (c ?? "").toUpperCase();
