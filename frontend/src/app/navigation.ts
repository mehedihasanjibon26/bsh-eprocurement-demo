import { BarChart3, Building2, ClipboardCheck, FileCheck2, FileClock, FolderOpen, Gavel, LayoutDashboard, Receipt, ScrollText, Search, ShoppingCart, UserRound, Wallet, type LucideIcon } from "lucide-react";

export type NavigationItem = { path: string; label: string; icon: LucideIcon; description: string };
export type Workspace = "admin" | "vendor";

export const workspaces: Record<Workspace, { title: string; subtitle: string; navigation: NavigationItem[] }> = {
  admin: {
    title: "Hospital workspace",
    subtitle: "PROCUREMENT MANAGEMENT",
    navigation: [
      { path: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Your hospital procurement overview, approvals, and activity will appear here." },
      { path: "requisitions", label: "Requisitions", icon: ClipboardCheck, description: "Department requests for hospital equipment, supplies, and services will appear here." },
      { path: "vendors", label: "Vendors", icon: Building2, description: "Supplier profiles, verification status, and vendor information will appear here." },
      { path: "tenders", label: "Tenders", icon: Gavel, description: "Hospital tenders, requests for quotation, and sourcing opportunities will appear here." },
      { path: "evaluation", label: "Evaluation", icon: FileCheck2, description: "Technical assessments and financial bid comparisons will appear here." },
      { path: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart, description: "Purchase orders and supplier acceptance details will appear here." },
      { path: "contracts", label: "Contracts", icon: ScrollText, description: "Hospital supplier agreements and contract milestones will appear here." },
      { path: "invoices-payments", label: "Invoices & Payments", icon: Wallet, description: "Supplier invoices, verification, and payment status will appear here." },
      { path: "reports", label: "Reports", icon: BarChart3, description: "Procurement reports and spend summaries in BDT will appear here." },
      { path: "audit-log", label: "Audit Log", icon: FileClock, description: "Procurement actions and approval history will appear here." },
    ],
  },
  vendor: {
    title: "Vendor workspace",
    subtitle: "SUPPLIER PORTAL",
    navigation: [
      { path: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Your tender activity, submissions, and supplier updates will appear here." },
      { path: "tenders", label: "Browse Tenders", icon: Search, description: "Hospital sourcing opportunities and tender requirements will appear here." },
      { path: "bids", label: "My Bids", icon: Gavel, description: "Your technical and financial bid submissions will appear here." },
      { path: "documents", label: "Documents", icon: FolderOpen, description: "Your company certificates and supporting documents will appear here." },
      { path: "contracts-pos", label: "Contracts & POs", icon: ScrollText, description: "Your hospital contracts, purchase orders, and acceptance details will appear here." },
      { path: "invoices", label: "Invoices", icon: Receipt, description: "Your submitted invoices and payment status will appear here." },
      { path: "profile", label: "Profile", icon: UserRound, description: "Your company profile, contact information, and business details will appear here." },
    ],
  },
};
