import type { UserRole } from "@/types/procurement";

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  approver: "Approver",
  evaluator: "Evaluator",
  management_viewer: "Management Viewer",
  vendor: "Vendor",
};

export const internalRoles: UserRole[] = ["admin", "approver", "evaluator", "management_viewer"];
export const vendorRoles: UserRole[] = ["vendor"];

export function workspacePath(role: UserRole) {
  if (role === "vendor") return "/vendor/dashboard";
  if (internalRoles.includes(role)) return "/admin/dashboard";
  return "/unauthorized";
}
