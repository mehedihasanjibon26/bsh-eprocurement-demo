import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { tenderApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Choice, CreateLink, Filters, PageHeading, QueryState } from "@/features/procurement/procurement-ui";
import { date, label, tenderStatuses, tenderTypes } from "@/features/procurement/procurement-options";

export function TenderListPage() {
  const { user } = useAuth(); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all_statuses"); const [category, setCategory] = useState("all_categories"); const [type, setType] = useState("all_types");
  const query = useQuery({ queryKey: ["tenders"], queryFn: ({ signal }) => tenderApi.list(signal) });
  const rows = query.data?.filter((t) => `${t.title} ${t.tender_number}`.toLowerCase().includes(search.toLowerCase()) && (status === "all_statuses" || t.status === status) && (category === "all_categories" || t.category === category) && (type === "all_types" || t.type === type));
  return <div className="space-y-6"><PageHeading title="Tenders" description="Source hospital equipment, supplies, and services with clear specifications and governance." action={user?.role === "admin" && <CreateLink to="/admin/tenders/new">Create tender</CreateLink>} /><Filters search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={tenderStatuses} category={category} onCategory={setCategory} /><div className="max-w-60"><Choice title="Filter by tender type" value={type} onChange={setType} options={["all_types", ...tenderTypes]} /></div>{query.isPending || query.isError ? <QueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} /> : !rows?.length ? <EmptyState title="No tenders found" description="Create a tender, convert an approved requisition, or adjust your filters." /> : <Card><CardContent><p className="mb-4 text-xs text-muted-foreground">{rows.length} tender(s) · Closing dates in Dhaka time</p><Table><TableHeader><TableRow>{["Tender", "Category", "Type", "Closing date", "Bids", "Status"].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((t) => <TableRow key={t.id}><TableCell className="min-w-60 whitespace-normal py-4"><Link to={`/admin/tenders/${t.id}`} className="font-medium text-primary hover:underline">{t.title}</Link><p className="mt-1 text-xs text-muted-foreground">{t.tender_number}</p></TableCell><TableCell>{label(t.category)}</TableCell><TableCell>{label(t.type)}</TableCell><TableCell>{date(t.closing_date)}</TableCell><TableCell className="tabular-nums">{t.bid_count}</TableCell><TableCell><StatusBadge status={t.status} /></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}</div>;
}
