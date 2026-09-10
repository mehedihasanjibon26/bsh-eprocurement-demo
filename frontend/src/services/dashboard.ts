import { getDemoAdminDashboard } from "@/demo/demo-store";
import { isDemoMode } from "@/demo/demo-mode";
import { api } from "@/services/api";
import type { AdminDashboard } from "@/types/dashboard";

export async function getAdminDashboard(
  signal?: AbortSignal,
): Promise<AdminDashboard> {
  if (isDemoMode) {
    return getDemoAdminDashboard();
  }

  const response = await api.get<{
    data: AdminDashboard;
  }>("/dashboard/admin", {
    signal,
  });

  return response.data.data;
}
