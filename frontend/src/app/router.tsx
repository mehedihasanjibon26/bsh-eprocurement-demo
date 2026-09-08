import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { EntryRedirect, ProtectedRoute } from "@/features/auth/protected-route";
import { internalRoles, vendorRoles } from "@/features/auth/roles";
import { workspaces, type Workspace } from "@/app/navigation";
import { WorkspacePage } from "@/app/workspace-page";
import { AccessPage } from "@/app/access-page";

function workspaceRoutes(workspace: Workspace) {
  return [
    { index: true, element: <Navigate to="dashboard" replace /> },
    ...workspaces[workspace].navigation.map((item) => ({ path: item.path, element: <WorkspacePage item={item} workspace={workspace} /> })),
    { path: "*", element: <AccessPage /> },
  ];
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <EntryRedirect /> },
      { path: "login", lazy: async () => ({ Component: (await import("@/features/auth/login-page")).LoginPage }) },
      { element: <ProtectedRoute roles={internalRoles} />, children: [{ path: "admin", lazy: async () => ({ Component: (await import("@/app/application-shell")).InternalShell }), children: workspaceRoutes("admin") }] },
      { element: <ProtectedRoute roles={vendorRoles} />, children: [{ path: "vendor", lazy: async () => ({ Component: (await import("@/app/application-shell")).VendorShell }), children: workspaceRoutes("vendor") }] },
      { element: <ProtectedRoute />, children: [{ path: "unauthorized", element: <AccessPage unauthorized /> }] },
      { path: "*", element: <AccessPage /> },
    ],
  },
]);
