import { api } from "@/services/api";
import type { AdminDashboard } from "@/types/dashboard";

export async function getAdminDashboard(signal?: AbortSignal): Promise<AdminDashboard> {
  const response = await api.get<{ data: AdminDashboard }>("/dashboard/admin", { signal });
  return response.data.data;
}
