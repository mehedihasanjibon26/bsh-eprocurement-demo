import type { ProcurementCategory, RequisitionStatus, TenderStatus, VendorStatus } from "@/types/procurement";

export type DashboardAlert = {
  id: string;
  title: string;
  description: string;
  kind: "approval" | "document" | "deadline" | "payment" | "contract";
  source: "database" | "demo";
};

export type AdminDashboard = {
  generated_at: string;
  kpis: { pending_requisitions: number; active_tenders: number; approved_vendors: number; under_evaluation: number };
  tender_status: { status: TenderStatus; count: number }[];
  recent_activity: {
    id: string;
    kind: "requisition" | "tender" | "vendor";
    title: string;
    reference: string;
    status: RequisitionStatus | TenderStatus | VendorStatus;
    updated_at: string | null;
  }[];
  alerts: DashboardAlert[];
  tenders: {
    id: number;
    tender_number: string;
    title: string;
    category: ProcurementCategory;
    closing_date: string | null;
    status: TenderStatus;
    bid_count: number;
  }[];
  demo: {
    period: string;
    activity_trend: { month: string; requisitions: number; tenders: number }[];
    spend_by_category: { category: string; amount: number }[];
    alerts: DashboardAlert[];
  };
};
