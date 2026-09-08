import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authService } from "@/services/auth";
import { getSessionToken, sessionExpiredEvent, setSessionToken } from "@/services/session";
import type { AuthUser, LoginCredentials } from "@/types/auth";
import { AuthContext } from "@/features/auth/use-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(() => getSessionToken() ? "loading" : "ready");
  const [attempt, setAttempt] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const controller = new AbortController();
    const clearSession = () => {
      controller.abort();
      setUser(null);
      setStatus("ready");
      queryClient.clear();
    };
    window.addEventListener(sessionExpiredEvent, clearSession);
    if (getSessionToken()) {
      authService.me(controller.signal).then((restoredUser) => {
        if (!controller.signal.aborted) {
          setUser(restoredUser);
          setStatus("ready");
        }
      }).catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    }
    return () => {
      controller.abort();
      window.removeEventListener(sessionExpiredEvent, clearSession);
    };
  }, [attempt, queryClient]);

  async function login(credentials: LoginCredentials) {
    const session = await authService.login(credentials);
    setSessionToken(session.token);
    queryClient.clear();
    setUser(session.user);
    setStatus("ready");
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    }
    setSessionToken(null);
    queryClient.clear();
    setUser(null);
    setStatus("ready");
  }

  return <AuthContext.Provider value={{ user, status, login, logout, retry: () => { setStatus("loading"); setAttempt((value) => value + 1); } }}>{children}</AuthContext.Provider>;
}
