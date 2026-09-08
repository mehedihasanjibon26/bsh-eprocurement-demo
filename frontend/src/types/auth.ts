import type { UserRole } from "@/types/procurement";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginCredentials = { email: string; password: string };
export type LoginResponse = { user: AuthUser; token: string; token_type: "Bearer" };
