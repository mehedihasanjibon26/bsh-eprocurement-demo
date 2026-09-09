import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { procurementError, tenderApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import type { TenderRecord } from "@/types/procurement-records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionDialog, Field, TextArea } from "@/features/procurement/procurement-ui";
import { closingIso } from "@/features/procurement/procurement-options";

export function TenderGovernance({ tender }: { tender: TenderRecord }) {
  const { user } = useAuth(); const cache = useQueryClient(); const [error, setError] = useState("");
  const action = useMutation({ mutationFn: ({ name, note, closing }: { name: string; note: string; closing?: string }) => tenderApi.action(tender.id, name, note, closing), onSuccess: async () => { await Promise.all([cache.invalidateQueries({ queryKey: ["tenders"] }), cache.invalidateQueries({ queryKey: ["dashboard"] })]); toast.success("Tender updated."); } });
  const admin = user?.role === "admin"; const active = ["published", "bidding_open"].includes(tender.status);
  const act = (name: string) => async (note: string) => { await action.mutateAsync({ name, note }); };
  return <div className="space-y-3"><div className="flex flex-wrap gap-2">
    {admin && tender.status === "draft" && <><Button nativeButton={false} render={<Link to={`/admin/tenders/${tender.id}/edit`} />}>Edit tender</Button><ActionDialog title="Submit for approval" description="Submit the completed tender, BOQ and eligibility for hospital approval." pending={action.isPending} onConfirm={act("submit")} /></>}
    {(admin || user?.role === "approver") && tender.status === "pending_approval" && <ActionDialog title="Approve tender" description="Approve this tender for publication." pending={action.isPending} onConfirm={act("approve")} />}
    {admin && tender.status === "approved" && <ActionDialog title="Publish tender" description="Publish this approved sourcing opportunity. Scope, BOQ, vendor eligibility, and deadline will be checked again." pending={action.isPending} onConfirm={act("publish")} />}
    {admin && active && <><ActionDialog title="Add clarification" description="Record a clarification visible in this tender's Clarifications tab." needsNote pending={action.isPending} onConfirm={act("clarification")} /><ActionDialog title="Publish addendum" description="Issue an additional tender instruction. Existing documents and BOQ remain available alongside the addendum." needsNote pending={action.isPending} onConfirm={act("addendum")} /></>}
    {admin && !["awarded", "cancelled"].includes(tender.status) && <ActionDialog title="Cancel tender" description="Cancel this sourcing opportunity and record the hospital's reason." needsNote destructive pending={action.isPending} onConfirm={act("cancel")} />}
  </div>{admin && active && <details className="rounded-xl border bg-card p-4"><summary className="cursor-pointer text-sm font-medium text-primary">Extend deadline</summary><form className="mt-4 space-y-4" onSubmit={async (event) => { event.preventDefault(); const element = event.currentTarget; const data = new FormData(element); setError(""); try { await action.mutateAsync({ name: "extend_deadline", note: String(data.get("note")), closing: closingIso(String(data.get("closing"))) }); element.reset(); } catch (failure) { setError(procurementError(failure)); } }}><fieldset disabled={action.isPending} className="grid gap-4 sm:grid-cols-2"><Field title="New closing date / time (Dhaka)"><Input type="datetime-local" required name="closing" /></Field><Field title="Reason for extension"><TextArea name="note" required maxLength={2000} /></Field></fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={action.isPending}>{action.isPending ? "Saving…" : "Confirm extension"}</Button></form></details>}</div>;
}
