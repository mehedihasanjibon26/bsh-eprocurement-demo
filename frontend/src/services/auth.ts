import axios from "axios";
import { api } from "@/services/api";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials) {
    return (await api.post<LoginResponse>("/auth/login", credentials)).data;
  },
  async me(signal?: AbortSignal) {
    return (await api.get<{ user: AuthUser }>("/auth/me", { signal })).data.user;
  },
  async logout() {
    await api.post("/auth/logout");
  },
};

export function authErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401) return "The email or password is incorrect.";
    if (error.response?.status === 422) return error.response.data.message || "Please check your email and password.";
  }
  return "We couldn’t connect to the portal. Please try again.";
}
