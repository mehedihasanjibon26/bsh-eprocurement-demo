import axios from "axios";
import { getSessionToken, sessionExpiredEvent, setSessionToken } from "@/services/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token && config.url !== "/auth/login") config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.url !== "/auth/login") {
    const token = getSessionToken();
    if (token && error.config?.headers.Authorization === `Bearer ${token}`) {
      setSessionToken(null);
      window.dispatchEvent(new Event(sessionExpiredEvent));
    }
  }
  return Promise.reject(error);
});
