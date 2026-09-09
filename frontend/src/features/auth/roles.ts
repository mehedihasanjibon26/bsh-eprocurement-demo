import type { UserRole } from "@/types/procurement";

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  approver: "Approver",
  evaluator: "Evaluator",
  management_viewer: "Management Viewer",
  vendor: "Vendor",
};

export const internalRoles: UserRole[] = [
  "admin",
  "approver",
  "evaluator",
  "management_viewer",
];

export const vendorRoles: UserRole[] = ["vendor"];

export function workspacePath(role: UserRole) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "approver":
      return "/admin/requisitions";

    case "evaluator":
      return "/admin/evaluation";

    case "management_viewer":
      return "/admin/dashboard";

    case "vendor":
      return "/vendor/dashboard";

    default:
      return "/unauthorized";
  }
}

export function canAccessInternalPath(role: UserRole, pathname: string) {
  if (role === "admin") {
    return true;
  }

  if (role === "approver") {
    return (
      pathname === "/admin/dashboard" ||
      pathname === "/admin/requisitions" ||
      /^\/admin\/requisitions\/\d+$/.test(pathname) ||
      pathname === "/admin/tenders" ||
      /^\/admin\/tenders\/\d+$/.test(pathname) ||
      pathname === "/admin/evaluation" ||
      pathname === "/admin/audit-log"
    );
  }

  if (role === "evaluator") {
    return (
      pathname === "/admin/dashboard" ||
      pathname === "/admin/tenders" ||
      /^\/admin\/tenders\/\d+$/.test(pathname) ||
      pathname === "/admin/evaluation" ||
      pathname === "/admin/audit-log"
    );
  }

  if (role === "management_viewer") {
    return (
      pathname === "/admin/dashboard" ||
      pathname === "/admin/reports" ||
      pathname === "/admin/audit-log"
    );
  }

  return false;
}
