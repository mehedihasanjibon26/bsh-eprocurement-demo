import { EmptyState } from "@/components/empty-state";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminDashboard } from "@/types/dashboard";
import { formatDate, formatLabel } from "./dashboard-format";

export function DashboardTenders({ tenders }: { tenders: AdminDashboard["tenders"] }) {
  return <Card>
    <CardHeader><CardTitle>Active / Recent Tenders</CardTitle><CardDescription>Up to 8 tenders · Active first, then latest updated · Closing times in Dhaka</CardDescription></CardHeader>
    <CardContent>
      {tenders.length === 0 ? <EmptyState title="No tenders available" description="Active and recent hospital tenders will appear here when records are available." /> : <Table aria-label="Active and recent hospital tenders">
        <TableHeader><TableRow><TableHead>Tender</TableHead><TableHead>Category</TableHead><TableHead>Closing date</TableHead><TableHead className="text-right">Bids</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{tenders.map((tender) => <TableRow key={tender.id}>
          <TableCell className="min-w-52 max-w-80 whitespace-normal py-4"><Link className="font-medium text-primary hover:underline" to={`/admin/tenders/${tender.id}`}>{tender.title}</Link><p className="mt-1 text-xs text-muted-foreground">{tender.tender_number}</p></TableCell>
          <TableCell className="text-xs text-muted-foreground">{formatLabel(tender.category)}</TableCell>
          <TableCell className="text-xs">{tender.closing_date ? <time dateTime={tender.closing_date}>{formatDate(tender.closing_date, true)}</time> : "Not scheduled"}</TableCell>
          <TableCell className="text-right tabular-nums">{tender.bid_count}</TableCell>
          <TableCell><StatusBadge status={tender.status} /></TableCell>
        </TableRow>)}</TableBody>
      </Table>}
    </CardContent>
  </Card>;
}
