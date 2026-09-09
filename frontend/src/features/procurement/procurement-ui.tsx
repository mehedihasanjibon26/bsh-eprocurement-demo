import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { procurementError } from "@/services/procurement";
import type { ActionEntry, ItemLine } from "@/types/procurement-records";
import { bdt, categories, date, label } from "./procurement-options";

export function PageHeading({ title, description, back, action }: { title: string; description: string; back?: string; action?: ReactNode }) {
  return <div className="space-y-4">{back && <Link to={back} className="inline-flex items-center gap-2 text-xs text-primary"><ArrowLeft className="size-3" />Back to list</Link>}<div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-primary">BSH PROCUREMENT</p><h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{action}</div></div>;
}
export function CreateLink({ to, children }: { to: string; children: ReactNode }) { return <Button nativeButton={false} render={<Link to={to} />}><Plus className="size-4" />{children}</Button>; }
export function Panel({ title, children }: { title: string; children: ReactNode }) { return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">{children}</CardContent></Card>; }
export function Field({ title, children }: { title: string; children: ReactNode }) { return <label className="block space-y-2 text-sm font-medium"><span>{title}</span>{children}</label>; }
export function TextArea(props: React.ComponentProps<"textarea">) { return <textarea {...props} className="min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50" />; }
export function Choice({ value, onChange, options, title }: { value: string; onChange: (value: string) => void; options: string[]; title: string }) {
  return <Select value={value} onValueChange={(next) => { if (next !== null) onChange(next); }}><SelectTrigger aria-label={title} className="h-10 w-full bg-card"><SelectValue>{label(value)}</SelectValue></SelectTrigger><SelectContent>{options.map((item) => <SelectItem key={item} value={item}>{label(item)}</SelectItem>)}</SelectContent></Select>;
}
export function Filters({ search, onSearch, status, onStatus, statuses, category, onCategory }: { search: string; onSearch: (value: string) => void; status: string; onStatus: (value: string) => void; statuses: string[]; category: string; onCategory: (value: string) => void }) {
  return <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[2fr_1fr_1fr]"><Input aria-label="Search records" placeholder="Search by name, reference, or department…" value={search} onChange={(event) => onSearch(event.target.value)} className="h-10" /><Choice title="Filter by status" value={status} onChange={onStatus} options={["all_statuses", ...statuses]} /><Choice title="Filter by category" value={category} onChange={onCategory} options={["all_categories", ...categories]} /></div>;
}
export function QueryState({ pending, error, retry }: { pending: boolean; error: unknown; retry: () => void }) {
  return pending ? <div role="status" className="rounded-xl border bg-card p-10 text-sm text-muted-foreground">Loading procurement records…</div> : <div role="alert"><EmptyState title="Unable to load this view" description={procurementError(error)} actionLabel="Retry" onAction={retry} /></div>;
}
export function ActionHistory({ entries }: { entries: ActionEntry[] | null }) { return !entries?.length ? <EmptyState title="No recorded actions yet" description="Actions performed in this workspace will appear here." /> : <ol className="divide-y">{entries.toReversed().map((entry, index) => <li key={`${entry.at}-${index}`} className="py-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-medium">{label(entry.action)}</p><p className="text-xs text-muted-foreground">{date(entry.at)} · {entry.actor}</p></div><p className="mt-1 text-xs text-primary">{label(entry.status)}</p>{entry.note && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{entry.note}</p>}</li>)}</ol>; }
export function ItemSummary({ items }: { items: ItemLine[] | null }) {
  return !items?.length ? <EmptyState title="No item lines recorded" /> : <div className="space-y-3">{items.map((item, index) => <div key={index} className="rounded-lg border p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-medium">{index + 1}. {item.name}</p><p className="font-semibold text-primary">{bdt(item.quantity * item.unit_cost)}</p></div><p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.specification}</p><p className="mt-3 text-xs text-muted-foreground">{item.quantity} {item.unit} × {bdt(item.unit_cost)}</p></div>)}<p className="text-right font-semibold">Estimated total: {bdt(items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0))}</p></div>;
}
export function ActionDialog({ title, description, needsNote = false, destructive = false, pending, onConfirm }: { title: string; description: string; needsNote?: boolean; destructive?: boolean; pending: boolean; onConfirm: (note: string) => Promise<void> }) {
  const [open, setOpen] = useState(false); const [note, setNote] = useState(""); const [error, setError] = useState("");
  return <><Button variant={destructive ? "destructive" : "outline"} disabled={pending} onClick={() => { setError(""); setNote(""); setOpen(true); }}>{title}</Button><Dialog open={open} onOpenChange={(value) => { if (!pending) setOpen(value); }}><DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={async (event) => { event.preventDefault(); setError(""); try { await onConfirm(note); setOpen(false); } catch (failure) { setError(procurementError(failure)); } }}><Field title={needsNote ? "Reason / details (required)" : "Note (optional)"}><TextArea required={needsNote} maxLength={2000} value={note} disabled={pending} onChange={(event) => setNote(event.target.value)} /></Field>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={pending} variant={destructive ? "destructive" : "default"}>{pending ? "Saving…" : title}</Button></div></form></DialogContent></Dialog></>;
}

