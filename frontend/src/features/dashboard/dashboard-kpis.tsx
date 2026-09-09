import { ClipboardList, FileSearch, Gavel, ShieldCheck } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import type { AdminDashboard } from "@/types/dashboard";

export function DashboardKpis({ kpis }: { kpis: AdminDashboard["kpis"] }) {
  return <section aria-label="Procurement key performance indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <KpiCard title="Pending Requisitions" value={String(kpis.pending_requisitions)} description="Awaiting hospital approval" icon={<ClipboardList className="size-9 rounded-lg bg-blue-50 p-2 text-blue-700" />} />
    <KpiCard title="Active Tenders" value={String(kpis.active_tenders)} description="Published / open, before closing" icon={<Gavel className="size-9 rounded-lg bg-teal-50 p-2 text-teal-700" />} />
    <KpiCard title="Approved Vendors" value={String(kpis.approved_vendors)} description="Approved supplier records" icon={<ShieldCheck className="size-9 rounded-lg bg-teal-50 p-2 text-teal-700" />} />
    <KpiCard title="Under Evaluation" value={String(kpis.under_evaluation)} description="Tenders in evaluation" icon={<FileSearch className="size-9 rounded-lg bg-blue-50 p-2 text-blue-700" />} />
  </section>;
}
