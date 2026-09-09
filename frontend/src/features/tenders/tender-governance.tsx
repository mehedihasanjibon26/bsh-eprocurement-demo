import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarClock,
  CheckCircle2,
  Edit3,
  Gavel,
  Megaphone,
  Settings2,
} from "lucide-react";

import { procurementError, tenderApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import type { TenderRecord } from "@/types/procurement-records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ActionDialog,
  Field,
  TextArea,
} from "@/features/procurement/procurement-ui";
import { closingIso } from "@/features/procurement/procurement-options";

export function TenderGovernance({ tender }: { tender: TenderRecord }) {
  const { user } = useAuth();
  const cache = useQueryClient();

  const [error, setError] = useState("");

  const action = useMutation({
    mutationFn: ({
      name,
      note,
      closing,
    }: {
      name: string;
      note: string;
      closing?: string;
    }) => tenderApi.action(tender.id, name, note, closing),

    onSuccess: async () => {
      await Promise.all([
        cache.invalidateQueries({
          queryKey: ["tenders"],
        }),
        cache.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      toast.success("Tender updated.");
    },
  });

  const admin = user?.role === "admin";

  const active = ["published", "bidding_open"].includes(tender.status);

  const act = (name: string) => async (note: string) => {
    await action.mutateAsync({
      name,
      note,
    });
  };

  const hasActions =
    (admin && tender.status === "draft") ||
    ((admin || user?.role === "approver") &&
      tender.status === "pending_approval") ||
    (admin && tender.status === "approved") ||
    (admin && active) ||
    (admin && !["awarded", "cancelled"].includes(tender.status));

  if (!hasActions) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[22px] border border-white/90 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

      <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-indigo-100 to-cyan-50 text-indigo-600">
          <Settings2 className="size-4" />
        </div>

        <div>
          <p className="text-[9px] font-semibold tracking-[0.16em] text-indigo-600">
            WORKFLOW CONTROL
          </p>

          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Tender Governance
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Available actions are controlled by tender status and user role.
          </p>
        </div>
      </header>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {admin && tender.status === "draft" && (
            <>
              <Button
                nativeButton={false}
                render={<Link to={`/admin/tenders/${tender.id}/edit`} />}
                className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
              >
                <Edit3 className="size-4" />
                Edit tender
              </Button>

              <ActionDialog
                title="Submit for approval"
                description="Submit the completed tender, BOQ and eligibility for hospital approval."
                pending={action.isPending}
                onConfirm={act("submit")}
              />
            </>
          )}

          {(admin || user?.role === "approver") &&
            tender.status === "pending_approval" && (
              <ActionDialog
                title="Approve tender"
                description="Approve this tender for publication."
                pending={action.isPending}
                onConfirm={act("approve")}
              />
            )}

          {admin && tender.status === "approved" && (
            <ActionDialog
              title="Publish tender"
              description="Publish this approved sourcing opportunity. Scope, BOQ, vendor eligibility, and deadline will be checked again."
              pending={action.isPending}
              onConfirm={act("publish")}
            />
          )}

          {admin && active && (
            <>
              <ActionDialog
                title="Add clarification"
                description="Record a clarification visible in this tender's Clarifications tab."
                needsNote
                pending={action.isPending}
                onConfirm={act("clarification")}
              />

              <ActionDialog
                title="Publish addendum"
                description="Issue an additional tender instruction. Existing documents and BOQ remain available alongside the addendum."
                needsNote
                pending={action.isPending}
                onConfirm={act("addendum")}
              />
            </>
          )}

          {admin && !["awarded", "cancelled"].includes(tender.status) && (
            <ActionDialog
              title="Cancel tender"
              description="Cancel this sourcing opportunity and record the hospital's reason."
              needsNote
              destructive
              pending={action.isPending}
              onConfirm={act("cancel")}
            />
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {[
            {
              label: "Prepare",
              icon: Edit3,
            },
            {
              label: "Approve",
              icon: CheckCircle2,
            },
            {
              label: "Publish",
              icon: Megaphone,
            },
            {
              label: "Manage",
              icon: Gavel,
            },
          ].map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/25 px-3 py-2.5"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="size-3.5" />
                </div>

                <div>
                  <p className="text-[8px] font-semibold tracking-[0.12em] text-slate-400">
                    STEP {index + 1}
                  </p>

                  <p className="text-[10px] font-semibold text-slate-700">
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {admin && active && (
          <details className="group overflow-hidden rounded-[18px] border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-cyan-50/50">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <CalendarClock className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-900">
                    Extend tender deadline
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-500">
                    Record a revised closing time with justification.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-violet-100 bg-white px-2.5 py-1 text-[9px] font-semibold text-violet-600">
                MANAGE
              </span>
            </summary>

            <form
              className="space-y-4 border-t border-violet-100/70 p-4"
              onSubmit={async (event) => {
                event.preventDefault();

                const element = event.currentTarget;

                const data = new FormData(element);

                setError("");

                try {
                  await action.mutateAsync({
                    name: "extend_deadline",
                    note: String(data.get("note")),
                    closing: closingIso(String(data.get("closing"))),
                  });

                  element.reset();
                } catch (failure) {
                  setError(procurementError(failure));
                }
              }}
            >
              <fieldset
                disabled={action.isPending}
                className="grid gap-4 sm:grid-cols-2"
              >
                <Field title="New closing date / time (Dhaka)">
                  <Input
                    type="datetime-local"
                    required
                    name="closing"
                    className="h-11 rounded-xl border-slate-200 bg-white transition hover:border-violet-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-100/70"
                  />
                </Field>

                <Field title="Reason for extension">
                  <TextArea name="note" required maxLength={2000} />
                </Field>
              </fieldset>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={action.isPending}
                className="h-10 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white"
              >
                <CalendarClock className="size-4" />

                {action.isPending ? "Saving..." : "Confirm extension"}
              </Button>
            </form>
          </details>
        )}
      </div>
    </section>
  );
}
