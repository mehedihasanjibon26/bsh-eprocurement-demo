import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { requisitionApi, procurementError } from "@/services/procurement";
import type { RequisitionForm, RequisitionRecord } from "@/types/procurement-records";
import { useAuth } from "@/features/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { Choice, Field, PageHeading, Panel, QueryState, TextArea } from "@/features/procurement/procurement-ui";
import { categories, newItem } from "@/features/procurement/procurement-options";
import { ItemEditor } from "@/features/procurement/item-editor";
import { requisitionSchema } from "@/features/procurement/form-schemas";

function RequisitionEditor({ record }: { record?: RequisitionRecord }) {
  const navigate = useNavigate(); const cache = useQueryClient(); const [error, setError] = useState("");
  const form = useForm<RequisitionForm>({ resolver: zodResolver(requisitionSchema), defaultValues: record ? { ...record, description: record.description ?? "", required_date: record.required_date.slice(0, 10), estimated_budget: Number(record.estimated_budget), items: record.items ?? [newItem()] } : { title: "", department: "", category: "medical_equipment", description: "", required_date: "", estimated_budget: 0, items: [newItem()] } });
  const busy = form.formState.isSubmitting; const category = useWatch({ control: form.control, name: "category" }); const items = useWatch({ control: form.control, name: "items" });
  return <form className="space-y-5" onSubmit={form.handleSubmit(async (data) => { setError(""); try { const saved = await requisitionApi.save(data, record?.id); await Promise.all([cache.invalidateQueries({ queryKey: ["requisitions"] }), cache.invalidateQueries({ queryKey: ["dashboard"] })]); toast.success("Requisition saved."); navigate(`/admin/requisitions/${saved.id}`); } catch (failure) { setError(procurementError(failure)); } })}><fieldset disabled={busy} className="space-y-5"><Panel title="Request information"><div className="grid gap-4 sm:grid-cols-2"><Field title="Title"><Input required maxLength={200} {...form.register("title")} /></Field><Field title="Department"><Input required maxLength={150} {...form.register("department")} /></Field><Field title="Category"><Choice title="Category" value={category} options={categories} onChange={(v) => form.setValue("category", v as RequisitionForm["category"])} /></Field><Field title="Required date"><Input type="date" required {...form.register("required_date")} /></Field><Field title="Estimated budget (BDT)"><Input type="number" min="1" max="9999999999999" step="0.01" required {...form.register("estimated_budget", { valueAsNumber: true })} /></Field></div><Field title="Description / clinical need"><TextArea required maxLength={5000} {...form.register("description")} /></Field></Panel><Panel title="Item lines"><ItemEditor items={items} onChange={(items) => form.setValue("items", items)} /></Panel></fieldset>{Object.keys(form.formState.errors).length > 0 && <p role="alert" className="text-sm text-destructive">Complete all required fields and enter valid quantities and BDT amounts.</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-3"><Button type="button" variant="outline" disabled={busy} onClick={() => navigate(record ? `/admin/requisitions/${record.id}` : "/admin/requisitions")}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : record ? "Save changes" : "Save draft"}</Button></div></form>;
}

export function RequisitionFormPage() {
  const { id } = useParams(); const { user } = useAuth();
  const query = useQuery({ queryKey: ["requisitions", id], queryFn: ({ signal }) => requisitionApi.get(id!, signal), enabled: !!id });
  if (user?.role !== "admin") return <EmptyState title="Read-only access" description="Only procurement administrators can create or edit requisitions." />;
  return <div className="space-y-6"><PageHeading title={id ? "Edit requisition" : "Create requisition"} description="Capture the clinical need and estimated item costs. Save, then submit for approval." back="/admin/requisitions" />{id && (query.isPending || query.isError) ? <QueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} /> : id && query.data && !["draft", "revision_required"].includes(query.data.status) ? <EmptyState title="This requisition is no longer editable" description="Only drafts and revision requests can be edited." /> : <RequisitionEditor key={id ?? "new"} record={query.data} />}</div>;
}
