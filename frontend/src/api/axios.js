import axios from "axios";

const api = axios.create({
  baseURL: "https://hanbamboo-api.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hb_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Product endpoints ─────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getAdminAll: () => api.get("/products/admin/all"),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Admin endpoints ───────────────────────────────────────────
export const adminAPI = {
  login: (credentials) => api.post("/admin/login", credentials),
  getMe: () => api.get("/admin/me"),
};

export default api;
