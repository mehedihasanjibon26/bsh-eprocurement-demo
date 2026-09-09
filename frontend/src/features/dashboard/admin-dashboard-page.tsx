import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminDashboard } from "@/services/dashboard";
import { DashboardKpis } from "./dashboard-kpis";
import { ProcurementTrend, SpendByCategory, TenderStatusChart } from "./dashboard-charts";
import { RecentActivity } from "./dashboard-activity";
import { DashboardAlerts } from "./dashboard-alerts";
import { DashboardTenders } from "./dashboard-tenders";
import { formatDate } from "./dashboard-format";

function DashboardLoading() {
  return <div role="status" aria-label="Loading admin dashboard" className="space-y-5">
    <p className="text-sm text-muted-foreground">Loading procurement overview…</p>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">{[0, 1, 2, 3].map((item) => <Card key={item}><CardContent className="space-y-4"><div className="h-3 w-32 rounded bg-muted" /><div className="h-8 w-16 rounded bg-muted" /><div className="h-3 w-40 max-w-full rounded bg-muted" /></CardContent></Card>)}</div>
    <div className="grid gap-5 xl:grid-cols-3" aria-hidden="true"><div className="h-80 rounded-xl border bg-card xl:col-span-2" /><div className="h-80 rounded-xl border bg-card" /></div>
  </div>;
}

export function AdminDashboardPage() {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: ({ signal }) => getAdminDashboard(signal),
    staleTime: 60_000,
    retry: (count, failure) => count < 1 && !(axios.isAxiosError(failure) && [401, 403].includes(failure.response?.status ?? 0)),
  });
  const forbidden = axios.isAxiosError(error) && error.response?.status === 403;

  return <div className="min-w-0 space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">HOSPITAL PROCUREMENT OVERVIEW</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Dashboard</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">A clear view of procurement priorities for Bangladesh Specialized Hospital PLC.</p></div>
      <Button variant="outline" onClick={() => void refetch()} disabled={isFetching} className="bg-card"><RefreshCw className="size-4" aria-hidden="true" />{isFetching ? "Refreshing…" : "Refresh"}</Button>
    </div>

    {isPending ? <DashboardLoading /> : !data ? <div role="alert"><EmptyState title={forbidden ? "Dashboard access unavailable" : "Unable to load the dashboard"} description={forbidden ? "This account does not have hospital dashboard access." : "We couldn't retrieve procurement data. Check your connection and try again."} actionLabel={isFetching ? "Retrying…" : "Retry"} onAction={() => { if (!isFetching) void refetch(); }} /></div> : <>
      {isError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><span>Refresh failed. Showing the last successfully loaded overview.</span><Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>Retry</Button></div>}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-teal-700" aria-hidden="true" />Current procurement records</span><span role="status">{isFetching ? "Updating overview…" : `Updated ${formatDate(data.generated_at, true)} · Dhaka`}</span></div>
      <DashboardKpis kpis={data.kpis} />
      <div className="grid min-w-0 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2"><ProcurementTrend demo={data.demo} /></div>
        <div className="min-w-0"><SpendByCategory demo={data.demo} /></div>
      </div>
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-3">
        <div className="min-w-0 space-y-5 xl:col-span-2"><RecentActivity activity={data.recent_activity} /><DashboardTenders tenders={data.tenders} /></div>
        <div className="min-w-0 space-y-5"><TenderStatusChart data={data.tender_status} /><DashboardAlerts alerts={data.alerts} demoAlerts={data.demo.alerts} /></div>
      </div>
    </>}
  </div>;
}
