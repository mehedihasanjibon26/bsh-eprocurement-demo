import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ClipboardEdit,
  FileText,
  Layers3,
  Save,
  Sparkles,
  Tags,
} from "lucide-react";

import { requisitionApi, procurementError } from "@/services/procurement";
import type {
  RequisitionForm,
  RequisitionRecord,
} from "@/types/procurement-records";
import { useAuth } from "@/features/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import {
  Choice,
  Field,
  QueryState,
  TextArea,
} from "@/features/procurement/procurement-ui";
import {
  bdt,
  categories,
  newItem,
} from "@/features/procurement/procurement-options";
import { ItemEditor } from "@/features/procurement/item-editor";
import { requisitionSchema } from "@/features/procurement/form-schemas";

function RequisitionEditor({ record }: { record?: RequisitionRecord }) {
  const navigate = useNavigate();
  const cache = useQueryClient();

  const [error, setError] = useState("");

  const form = useForm<RequisitionForm>({
    resolver: zodResolver(requisitionSchema),

    defaultValues: record
      ? {
          ...record,
          description: record.description ?? "",
          required_date: record.required_date.slice(0, 10),
          estimated_budget: Number(record.estimated_budget),
          items: record.items ?? [newItem()],
        }
      : {
          title: "",
          department: "",
          category: "medical_equipment",
          description: "",
          required_date: "",
          estimated_budget: 0,
          items: [newItem()],
        },
  });

  const busy = form.formState.isSubmitting;

  const category =
    useWatch({
      control: form.control,
      name: "category",
    }) ?? "medical_equipment";

  const items =
    useWatch({
      control: form.control,
      name: "items",
    }) ?? [];

  const budget =
    useWatch({
      control: form.control,
      name: "estimated_budget",
    }) ?? 0;

  const itemEstimatedTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0) * Number(item.unit_cost ?? 0),
    0,
  );

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(async (data) => {
        setError("");

        try {
          const saved = await requisitionApi.save(data, record?.id);

          await Promise.all([
            cache.invalidateQueries({
              queryKey: ["requisitions"],
            }),
            cache.invalidateQueries({
              queryKey: ["dashboard"],
            }),
          ]);

          toast.success("Requisition saved.");

          navigate(`/admin/requisitions/${saved.id}`);
        } catch (failure) {
          setError(procurementError(failure));
        }
      })}
    >
      <fieldset disabled={busy} className="space-y-6">
        {/* Request Information */}
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

          <header className="border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 text-indigo-600 shadow-sm">
                <ClipboardEdit className="size-5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] text-indigo-600">
                  REQUEST INFORMATION
                </p>

                <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
                  Procurement Requirement
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Capture the requesting department, clinical need, timeline and
                  estimated budget.
                </p>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-indigo-50/30 p-4 transition duration-200 hover:border-indigo-200 hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)]">
                <div className="mb-3 flex items-center gap-2 text-indigo-600">
                  <FileText className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    REQUEST TITLE
                  </span>
                </div>

                <Field title="Title">
                  <Input
                    required
                    maxLength={200}
                    {...form.register("title")}
                    className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/30 focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100/70"
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-cyan-50/30 p-4 transition duration-200 hover:border-cyan-200 hover:shadow-[0_8px_24px_rgba(6,182,212,0.06)]">
                <div className="mb-3 flex items-center gap-2 text-cyan-700">
                  <Building2 className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    REQUESTING UNIT
                  </span>
                </div>

                <Field title="Department">
                  <Input
                    required
                    maxLength={150}
                    {...form.register("department")}
                    className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50/30 focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-100/70"
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-violet-50/30 p-4 transition duration-200 hover:border-violet-200 hover:shadow-[0_8px_24px_rgba(139,92,246,0.06)]">
                <div className="mb-3 flex items-center gap-2 text-violet-600">
                  <Tags className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    CLASSIFICATION
                  </span>
                </div>

                <Field title="Category">
                  <Choice
                    title="Category"
                    value={category}
                    options={categories}
                    onChange={(value) =>
                      form.setValue(
                        "category",
                        value as RequisitionForm["category"],
                      )
                    }
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-amber-50/30 p-4 transition duration-200 hover:border-amber-200 hover:shadow-[0_8px_24px_rgba(245,158,11,0.06)]">
                <div className="mb-3 flex items-center gap-2 text-amber-600">
                  <CalendarDays className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    REQUIRED TIMELINE
                  </span>
                </div>

                <Field title="Required date">
                  <Input
                    type="date"
                    required
                    {...form.register("required_date")}
                    className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/30 focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-100/70"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.8fr]">
              <div className="rounded-[16px] border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-cyan-50/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <CircleDollarSign className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    BUDGET
                  </span>
                </div>

                <Field title="Estimated budget (BDT)">
                  <Input
                    type="number"
                    min="1"
                    max="9999999999999"
                    step="0.01"
                    required
                    {...form.register("estimated_budget", {
                      valueAsNumber: true,
                    })}
                    className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/30 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100/70"
                  />
                </Field>

                <div className="mt-3 rounded-xl border border-emerald-100 bg-white/80 px-3 py-2">
                  <p className="text-[9px] font-medium text-slate-400">
                    CURRENT VALUE
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {Number(budget) > 0 ? bdt(Number(budget)) : "BDT 0"}
                  </p>
                </div>
              </div>

              <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white via-slate-50/30 to-indigo-50/20 p-4">
                <div className="mb-3 flex items-center gap-2 text-indigo-600">
                  <FileText className="size-4" />

                  <span className="text-[9px] font-semibold tracking-[0.13em]">
                    CLINICAL JUSTIFICATION
                  </span>
                </div>

                <Field title="Description / clinical need">
                  <TextArea
                    required
                    maxLength={5000}
                    {...form.register("description")}
                    className="min-h-32"
                  />
                </Field>
              </div>
            </div>
          </div>
        </section>

        {/* Item Lines */}
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />

          <header className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-600 shadow-sm">
                <Layers3 className="size-5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] text-violet-600">
                  BOQ / ITEM LINES
                </p>

                <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
                  Requested Items
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Define specifications, quantity, units and estimated unit
                  costs.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-center">
                <p className="text-[8px] font-semibold tracking-[0.12em] text-violet-500">
                  ITEMS
                </p>

                <p className="mt-0.5 text-sm font-semibold text-violet-700">
                  {items.length}
                </p>
              </div>

              <div className="min-w-36 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right">
                <p className="text-[8px] font-semibold tracking-[0.12em] text-emerald-600">
                  ITEM TOTAL
                </p>

                <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                  {bdt(itemEstimatedTotal)}
                </p>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-6">
            <ItemEditor
              items={items}
              onChange={(nextItems) => form.setValue("items", nextItems)}
            />
          </div>
        </section>
      </fieldset>

      {/* Validation */}
      {Object.keys(form.formState.errors).length > 0 && (
        <div
          role="alert"
          className="rounded-[16px] border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-orange-50 px-4 py-3 text-[11px] font-medium text-rose-700"
        >
          Complete all required fields and enter valid quantities and BDT
          amounts.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[11px] font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <section className="sticky bottom-4 z-20 rounded-[20px] border border-white/90 bg-white/90 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden items-center gap-2 px-2 sm:flex">
            <Sparkles className="size-4 text-violet-500" />

            <p className="text-[10px] text-slate-500">
              Save the requisition before submitting it for approval.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                navigate(
                  record
                    ? `/admin/requisitions/${record.id}`
                    : "/admin/requisitions",
                )
              }
              className="h-11 rounded-xl border-slate-200 bg-white px-5 text-slate-600 transition hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-violet-50 hover:to-cyan-50 hover:text-indigo-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={busy}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(99,102,241,0.28)]"
            >
              <Save className="size-4" />

              {busy ? "Saving..." : record ? "Save changes" : "Save draft"}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
}

export function RequisitionFormPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["requisitions", id],
    queryFn: ({ signal }) => requisitionApi.get(id!, signal),
    enabled: !!id,
  });

  if (user?.role !== "admin") {
    return (
      <EmptyState
        title="Read-only access"
        description="Only procurement administrators can create or edit requisitions."
      />
    );
  }

  const editing = Boolean(id);

  return (
    <div className="min-w-0 space-y-7">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      {/* Form hero */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75 backdrop-blur">
            <ClipboardEdit className="size-3.5 text-cyan-200" />

            {editing ? "EDIT PROCUREMENT REQUEST" : "NEW PROCUREMENT REQUEST"}
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            {editing ? "Edit Requisition" : "Create Requisition"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Capture the hospital requirement, clinical justification, estimated
            budget and requested item specifications. Save the request before
            sending it through approval.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              Clinical Requirement
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              BOQ & Specifications
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              Approval Ready
            </span>
          </div>
        </div>
      </section>

      {id && (query.isPending || query.isError) ? (
        <QueryState
          pending={query.isPending}
          error={query.error}
          retry={() => void query.refetch()}
        />
      ) : id &&
        query.data &&
        !["draft", "revision_required"].includes(query.data.status) ? (
        <EmptyState
          title="This requisition is no longer editable"
          description="Only drafts and revision requests can be edited."
        />
      ) : (
        <RequisitionEditor key={id ?? "new"} record={query.data} />
      )}
    </div>
  );
}
