import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// Club endpoints
export const clubAPI = {
  getAll: () => api.get("/clubs/"),
  get: (uid) => api.get(`/clubs/${uid}`),
  join: (uid) => api.post(`/clubs/${uid}/join`),
  getMembers: (uid) => api.get(`/clubs/${uid}/members`),
};

// Event endpoints
export const eventAPI = {
  getAll: () => api.get("/events/"),
  get: (uid) => api.get(`/events/${uid}`),
  join: (uid) => api.post(`/events/${uid}/join`),
  getClubEvents: (clubUid) => api.get(`/events/club/${clubUid}`),
};

// Comment endpoints
export const commentAPI = {
  getEventComments: (eventUid) => api.get(`/comments/event/${eventUid}`),
  create: (data) => api.post("/comments/", data),
  reply: (commentUid, data) => api.post(`/comments/${commentUid}/reply`, data),
};

export default api;
