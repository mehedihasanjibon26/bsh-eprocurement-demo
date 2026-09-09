import { BellRing, CircleCheck, Clock3, CreditCard, FileClock, FileWarning, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAlert } from "@/types/dashboard";

const alertIcons = { approval: ClipboardList, document: FileWarning, deadline: Clock3, payment: CreditCard, contract: FileClock };

function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  return <ul className="space-y-3">{alerts.map((alert) => {
    const Icon = alertIcons[alert.kind];
    return <li key={alert.id} className="flex gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="min-w-0"><p className="text-xs font-semibold">{alert.source === "database" ? <Link className="text-primary hover:underline" to={alert.kind === "approval" ? "/admin/requisitions" : alert.kind === "document" ? `/admin/vendors/${alert.id.replace("vendor-", "")}` : `/admin/tenders/${alert.id.replace("tender-", "")}`}>{alert.title}</Link> : alert.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alert.description}</p></div>
    </li>;
  })}</ul>;
}

export function DashboardAlerts({ alerts, demoAlerts }: { alerts: DashboardAlert[]; demoAlerts: DashboardAlert[] }) {
  return <Card>
    <CardHeader><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-2"><BellRing className="size-4 text-primary" aria-hidden="true" />Attention Required</CardTitle><Badge variant="secondary">{alerts.length}</Badge></div><CardDescription>Approvals, deadlines, and supplier documents</CardDescription></CardHeader>
    <CardContent className="space-y-5">
      {alerts.length === 0 ? <EmptyState title="You're all caught up" description="No current approval, deadline, or document alerts." icon={<CircleCheck className="size-6 text-teal-700" />} /> : <AlertList alerts={alerts} />}
      {demoAlerts.length > 0 && <div className="border-t pt-4"><p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium">Payment &amp; contract alerts <Badge variant="outline">Demo examples</Badge></p><AlertList alerts={demoAlerts} /><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Illustrative reminders; no payment or contract processing is connected.</p></div>}
    </CardContent>
  </Card>;
}
