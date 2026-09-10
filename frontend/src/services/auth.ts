import axios from "axios";

import { demoAuthService, DemoAuthError } from "@/demo/demo-auth";
import { isDemoMode } from "@/demo/demo-mode";
import { api } from "@/services/api";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (isDemoMode) {
      return demoAuthService.login(credentials);
    }

    return (await api.post<LoginResponse>("/auth/login", credentials)).data;
  },

  async me(signal?: AbortSignal): Promise<AuthUser> {
    if (isDemoMode) {
      return demoAuthService.me();
    }

    return (await api.get<{ user: AuthUser }>("/auth/me", { signal })).data
      .user;
  },

  async logout(): Promise<void> {
    if (isDemoMode) {
      await demoAuthService.logout();
      return;
    }

    await api.post("/auth/logout");
  },
};

export function authErrorMessage(error: unknown) {
  if (error instanceof DemoAuthError) {
    return error.message;
  }

  if (
    axios.isAxiosError<{
      message?: string;
    }>(error)
  ) {
    if (error.response?.status === 401) {
      return "The email or password is incorrect.";
    }

    if (error.response?.status === 422) {
      return (
        error.response.data.message || "Please check your email and password."
      );
    }
  }

  return "We couldn't connect to the portal. Please try again.";
}
