import { ClipboardList, Gavel, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboard } from "@/types/dashboard";
import { formatDate } from "./dashboard-format";

const activityIcons = { requisition: ClipboardList, tender: Gavel, vendor: ShieldCheck };

export function RecentActivity({ activity }: { activity: AdminDashboard["recent_activity"] }) {
  return <Card>
    <CardHeader><CardTitle>Recent Procurement Activity</CardTitle><CardDescription>Latest record updates and current status · Dhaka time</CardDescription></CardHeader>
    <CardContent>
      {activity.length === 0 ? <EmptyState title="No recent procurement activity" description="Updates to requisitions, vendors, and tenders will appear here." /> : <ul className="divide-y">
        {activity.map((item) => {
          const Icon = activityIcons[item.kind];
          return <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"><Icon className="size-4" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-medium">{item.title}</p><StatusBadge status={item.status} /></div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.reference}<span className="mx-2" aria-hidden="true">·</span>{item.updated_at ? <time dateTime={item.updated_at}>{formatDate(item.updated_at, true)}</time> : "Update time unavailable"}</p>
            </div>
          </li>;
        })}
      </ul>}
    </CardContent>
  </Card>;
}
