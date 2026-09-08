import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { workspacePath } from "@/features/auth/roles";
import type { UserRole } from "@/types/procurement";

export function EntryRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? workspacePath(user.role) : "/login"} replace />;
}

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
