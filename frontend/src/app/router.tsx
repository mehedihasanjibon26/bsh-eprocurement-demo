import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/App";
import { AccessPage } from "@/app/access-page";
import { workspaces, type Workspace } from "@/app/navigation";
import { WorkspacePage } from "@/app/workspace-page";
import { EntryRedirect, ProtectedRoute } from "@/features/auth/protected-route";
import { internalRoles, vendorRoles } from "@/features/auth/roles";

function workspaceRoutes(workspace: Workspace) {
  return [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },

    ...(workspace === "admin"
      ? [
          {
            path: "tenders",
            lazy: async () => ({
              Component: (await import("@/features/tenders/tender-list-page"))
                .TenderListPage,
            }),
          },
          {
            path: "tenders/new",
            lazy: async () => ({
              Component: (await import("@/features/tenders/tender-form-page"))
                .TenderFormPage,
            }),
          },
          {
            path: "tenders/:id",
            lazy: async () => ({
              Component: (await import("@/features/tenders/tender-detail-page"))
                .TenderDetailPage,
            }),
          },
          {
            path: "tenders/:id/edit",
            lazy: async () => ({
              Component: (await import("@/features/tenders/tender-form-page"))
                .TenderFormPage,
            }),
          },
          {
            path: "vendors",
            lazy: async () => ({
              Component: (await import("@/features/vendors/vendor-list-page"))
                .VendorListPage,
            }),
          },
          {
            path: "vendors/:id",
            lazy: async () => ({
              Component: (await import("@/features/vendors/vendor-detail-page"))
                .VendorDetailPage,
            }),
          },
          {
            path: "requisitions",
            lazy: async () => ({
              Component: (
                await import("@/features/requisitions/requisition-list-page")
              ).RequisitionListPage,
            }),
          },
          {
            path: "requisitions/new",
            lazy: async () => ({
              Component: (
                await import("@/features/requisitions/requisition-form-page")
              ).RequisitionFormPage,
            }),
          },
          {
            path: "requisitions/:id",
            lazy: async () => ({
              Component: (
                await import("@/features/requisitions/requisition-detail-page")
              ).RequisitionDetailPage,
            }),
          },
          {
            path: "requisitions/:id/edit",
            lazy: async () => ({
              Component: (
                await import("@/features/requisitions/requisition-form-page")
              ).RequisitionFormPage,
            }),
          },
          {
            path: "evaluation",
            lazy: async () => ({
              Component: (
                await import("@/features/evaluations/evaluation-page")
              ).EvaluationPage,
            }),
          },
          {
            path: "purchase-orders",
            lazy: async () => ({
              Component: (
                await import("@/features/contracts/purchase-order-page")
              ).PurchaseOrderPage,
            }),
          },
          {
            path: "contracts",
            lazy: async () => ({
              Component: (await import("@/features/contracts/contract-page"))
                .ContractPage,
            }),
          },
          {
            path: "delivery-receipts",
            lazy: async () => ({
              Component: (
                await import("@/features/payments/delivery-receipt-page")
              ).DeliveryReceiptPage,
            }),
          },
          {
            path: "invoices-payments",
            lazy: async () => ({
              Component: (
                await import("@/features/payments/invoice-payment-page")
              ).InvoicePaymentPage,
            }),
          },
          {
            path: "reports",
            lazy: async () => ({
              Component: (await import("@/features/reports/reports-page"))
                .ReportsPage,
            }),
          },
          {
            path: "audit-log",
            lazy: async () => ({
              Component: (await import("@/features/audit/audit-log-page"))
                .AuditLogPage,
            }),
          },
          {
            path: "admin-center",
            lazy: async () => ({
              Component: (await import("@/features/admin/admin-center-page"))
                .AdminCenterPage,
            }),
          },
        ]
      : []),

    ...(workspace === "vendor"
      ? [
          {
            path: "dashboard",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-dashboard-page")
              ).VendorDashboardPage,
            }),
          },
          {
            path: "tenders",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-tender-list-page")
              ).VendorTenderListPage,
            }),
          },
          {
            path: "tenders/:id",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-tender-detail-page")
              ).VendorTenderDetailPage,
            }),
          },
          {
            path: "bids",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-bids-page")
              ).VendorBidsPage,
            }),
          },
          {
            path: "bids/submit/:id",
            lazy: async () => ({
              Component: (await import("@/features/bidding/bid-workspace-page"))
                .BidWorkspacePage,
            }),
          },
          {
            path: "documents",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-documents-page")
              ).VendorDocumentsPage,
            }),
          },
          {
            path: "contracts-pos",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-contracts-pos-page")
              ).VendorContractsPosPage,
            }),
          },
          {
            path: "invoices",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-invoices-page")
              ).VendorInvoicesPage,
            }),
          },
          {
            path: "profile",
            lazy: async () => ({
              Component: (
                await import("@/features/vendor-portal/vendor-profile-page")
              ).VendorProfilePage,
            }),
          },
        ]
      : []),

    ...workspaces[workspace].navigation
      .filter((item) => {
        if (workspace === "admin") {
          return ![
            "requisitions",
            "vendors",
            "tenders",
            "evaluation",
            "purchase-orders",
            "contracts",
            "delivery-receipts",
            "invoices-payments",
            "reports",
            "audit-log",
            "admin-center",
          ].includes(item.path);
        }

        return ![
          "dashboard",
          "tenders",
          "bids",
          "documents",
          "contracts-pos",
          "invoices",
          "profile",
        ].includes(item.path);
      })
      .map((item) =>
        workspace === "admin" && item.path === "dashboard"
          ? {
              path: item.path,
              lazy: async () => ({
                Component: (
                  await import("@/features/dashboard/admin-dashboard-page")
                ).AdminDashboardPage,
              }),
            }
          : {
              path: item.path,
              element: <WorkspacePage item={item} workspace={workspace} />,
            },
      ),

    {
      path: "*",
      element: <AccessPage />,
    },
  ];
}

const routerBasename =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <EntryRedirect />,
        },
        {
          path: "login",
          lazy: async () => ({
            Component: (await import("@/features/auth/login-page")).LoginPage,
          }),
        },
        {
          element: <ProtectedRoute roles={internalRoles} />,
          children: [
            {
              path: "admin",
              lazy: async () => ({
                Component: (await import("@/app/application-shell"))
                  .InternalShell,
              }),
              children: workspaceRoutes("admin"),
            },
          ],
        },
        {
          element: <ProtectedRoute roles={vendorRoles} />,
          children: [
            {
              path: "vendor",
              lazy: async () => ({
                Component: (await import("@/app/application-shell"))
                  .VendorShell,
              }),
              children: workspaceRoutes("vendor"),
            },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "unauthorized",
              element: <AccessPage unauthorized />,
            },
          ],
        },
        {
          path: "*",
          element: <AccessPage />,
        },
      ],
    },
  ],
  {
    basename: routerBasename,
  },
);
