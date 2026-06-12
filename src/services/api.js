import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const TOKEN_KEY = "pm_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

// Attach the JWT bearer token to every request.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, drop the dead token and let the app fall back to logged-out state.
// A `pm:unauthorized` event lets AuthContext react (redirect / clear user).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent("pm:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
