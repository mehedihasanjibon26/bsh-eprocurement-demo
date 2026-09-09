import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Star, FileWarning } from "lucide-react";
import { vendorApi } from "@/services/procurement";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filters, PageHeading, QueryState } from "@/features/procurement/procurement-ui";
import { label, vendorStatuses } from "@/features/procurement/procurement-options";

export function VendorListPage() {
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all_statuses"); const [category, setCategory] = useState("all_categories");
  const query = useQuery({ queryKey: ["vendors"], queryFn: ({ signal }) => vendorApi.list(signal) });
  const rows = query.data?.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) && (status === "all_statuses" || v.status === status) && (category === "all_categories" || v.category === category));
  return <div className="space-y-6"><PageHeading title="Vendors" description="Manage hospital supplier relationships, compliance, and procurement eligibility." /><Filters search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={vendorStatuses} category={category} onCategory={setCategory} />{query.isPending || query.isError ? <QueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} /> : !rows?.length ? <EmptyState title="No vendors found" description="Adjust your filters to find a hospital supplier." /> : <Card><CardContent><p className="mb-4 text-xs text-muted-foreground">{rows.length} vendor(s) · Supplier register</p><Table><TableHeader><TableRow>{["Supplier", "Category", "Status", "Performance", "Documents", "Attention required"].map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((v) => <TableRow key={v.id}><TableCell className="py-5"><Link to={`/admin/vendors/${v.id}`} className="font-semibold text-primary hover:underline">{v.name}</Link><p className="mt-1 text-xs text-muted-foreground">{v.profile?.address ?? "Company profile"}</p></TableCell><TableCell>{label(v.category)}</TableCell><TableCell><StatusBadge status={v.status} /></TableCell><TableCell><span className="inline-flex items-center gap-1"><Star className="size-3.5 text-amber-600" />{v.performance_score ? `${v.performance_score} / 5` : "Not rated"}</span></TableCell><TableCell>{v.profile?.documents.length ?? 0} on file</TableCell><TableCell className="min-w-48 max-w-72 whitespace-normal text-xs">{v.document_expiry_alert ? <span className="inline-flex items-start gap-2 text-amber-800"><FileWarning className="size-4 shrink-0" />{v.document_expiry_alert}</span> : <span className="text-muted-foreground">No document alerts</span>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}</div>;
}
