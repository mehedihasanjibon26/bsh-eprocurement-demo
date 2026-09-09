import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { requisitionApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateLink, Filters, PageHeading, QueryState } from "@/features/procurement/procurement-ui";
import { bdt, date, label, requisitionStatuses } from "@/features/procurement/procurement-options";

export function RequisitionListPage() {
  const { user } = useAuth(); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all_statuses"); const [category, setCategory] = useState("all_categories");
  const query = useQuery({ queryKey: ["requisitions"], queryFn: ({ signal }) => requisitionApi.list(signal) });
  const rows = query.data?.filter((r) => `${r.requisition_number} ${r.title} ${r.department} ${r.requester}`.toLowerCase().includes(search.toLowerCase()) && (status === "all_statuses" || r.status === status) && (category === "all_categories" || r.category === category));
  return <div className="space-y-6"><PageHeading title="Requisitions" description="Plan hospital demand, review requests, and move approved needs into sourcing." action={user?.role === "admin" && <CreateLink to="/admin/requisitions/new">Create requisition</CreateLink>} /><Filters search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={requisitionStatuses} category={category} onCategory={setCategory} />{query.isPending || query.isError ? <QueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} /> : !rows?.length ? <EmptyState title="No requisitions found" description="Create a hospital requisition or adjust your filters." /> : <Card><CardContent><p className="mb-4 text-xs text-muted-foreground">{rows.length} requisition(s) · All amounts in BDT</p><Table><TableHeader><TableRow>{["Requisition", "Department / requester", "Category", "Budget", "Required date", "Status"].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((r) => <TableRow key={r.id}><TableCell className="min-w-60 whitespace-normal py-4"><Link className="font-medium text-primary hover:underline" to={`/admin/requisitions/${r.id}`}>{r.title}</Link><p className="mt-1 text-xs text-muted-foreground">{r.requisition_number}</p></TableCell><TableCell>{r.department}<p className="mt-1 text-xs text-muted-foreground">{r.requester}</p></TableCell><TableCell>{label(r.category)}</TableCell><TableCell className="font-medium">{bdt(r.estimated_budget)}</TableCell><TableCell>{date(r.required_date)}</TableCell><TableCell><StatusBadge status={r.status} /></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}</div>;
}
