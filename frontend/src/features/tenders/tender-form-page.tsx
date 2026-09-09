import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Boxes,
  Building2,
  FileCheck2,
  Gavel,
  Link2,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  procurementError,
  requisitionApi,
  tenderApi,
  vendorApi,
} from "@/services/procurement";
import type {
  RequisitionRecord,
  TenderForm,
  TenderRecord,
  VendorRecord,
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
  categories,
  closingIso,
  dhakaInput,
  newItem,
  tenderTypes,
} from "@/features/procurement/procurement-options";
import { ItemEditor } from "@/features/procurement/item-editor";
import { tenderSchema } from "@/features/procurement/form-schemas";

function TenderEditor({
  record,
  requisitions,
  vendors,
}: {
  record?: TenderRecord;
  requisitions: RequisitionRecord[];
  vendors: VendorRecord[];
}) {
  const navigate = useNavigate();
  const cache = useQueryClient();

  const [error, setError] = useState("");

  const [documents, setDocuments] = useState(
    record?.documents?.join("\n") ?? "",
  );

  const form = useForm<TenderForm>({
    resolver: zodResolver(tenderSchema),

    defaultValues: record
      ? {
          ...record,
          scope: record.scope ?? "",
          eligibility: record.eligibility ?? "",
          closing_date: record.closing_date
            ? dhakaInput(record.closing_date)
            : "",
          boq: record.boq?.length ? record.boq : [newItem()],
          documents: record.documents ?? [],
          invited_vendor_ids: record.invited_vendor_ids ?? [],
        }
      : {
          title: "",
          category: "medical_equipment",
          type: "public_tender",
          scope: "",
          eligibility: "",
          closing_date: "",
          boq: [newItem()],
          documents: [],
          invited_vendor_ids: [],
          requisition_id: null,
        },
  });

  const busy = form.formState.isSubmitting;

  const vendorIds =
    useWatch({
      control: form.control,
      name: "invited_vendor_ids",
    }) ?? [];

  const type =
    useWatch({
      control: form.control,
      name: "type",
    }) ?? "public_tender";

  const category =
    useWatch({
      control: form.control,
      name: "category",
    }) ?? "medical_equipment";

  const boq =
    useWatch({
      control: form.control,
      name: "boq",
    }) ?? [];

  const requisitionId =
    useWatch({
      control: form.control,
      name: "requisition_id",
    }) ?? null;

  const approvedVendors = vendors.filter(
    (vendor) => vendor.status === "approved" || vendorIds.includes(vendor.id),
  );

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(async (data) => {
        setError("");

        try {
          const saved = await tenderApi.save(
            {
              ...data,
              closing_date: closingIso(data.closing_date),
              documents: documents
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
              invited_vendor_ids:
                data.type === "public_tender" ? [] : data.invited_vendor_ids,
            },
            record?.id,
          );

          await Promise.all([
            cache.invalidateQueries({
              queryKey: ["tenders"],
            }),
            cache.invalidateQueries({
              queryKey: ["requisitions"],
            }),
            cache.invalidateQueries({
              queryKey: ["dashboard"],
            }),
          ]);

          toast.success("Tender saved.");

          navigate(`/admin/tenders/${saved.id}`);
        } catch (failure) {
          setError(procurementError(failure));
        }
      })}
    >
      <fieldset disabled={busy} className="space-y-6">
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-100 via-violet-50 to-cyan-50 text-indigo-600">
              <Gavel className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
                BASIC INFORMATION
              </p>

              <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
                Tender Setup
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Define the sourcing method, category, deadline and procurement
                scope.
              </p>
            </div>
          </header>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/30 p-4">
                <Field title="Tender title">
                  <Input
                    required
                    maxLength={200}
                    {...form.register("title")}
                    className="h-11 rounded-xl border-slate-200 bg-white transition hover:border-indigo-300 focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100/70"
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-violet-100 bg-violet-50/30 p-4">
                <Field title="Tender type">
                  <Choice
                    title="Tender type"
                    options={tenderTypes}
                    value={type}
                    onChange={(value) =>
                      form.setValue("type", value as TenderForm["type"])
                    }
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/30 p-4">
                <Field title="Category">
                  <Choice
                    title="Category"
                    options={categories}
                    value={category}
                    onChange={(value) =>
                      form.setValue("category", value as TenderForm["category"])
                    }
                  />
                </Field>
              </div>

              <div className="rounded-[16px] border border-amber-100 bg-amber-50/30 p-4">
                <Field title="Closing date / time (Dhaka)">
                  <Input
                    required
                    type="datetime-local"
                    {...form.register("closing_date")}
                    className="h-11 rounded-xl border-slate-200 bg-white transition hover:border-amber-300 focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-100/70"
                  />
                </Field>
              </div>
            </div>

            {record ? (
              <div className="rounded-[16px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50/50 p-4">
                <p className="text-[9px] font-semibold tracking-[0.13em] text-indigo-600">
                  LINKED REQUISITION
                </p>

                <p className="mt-2 text-[11px] text-slate-600">
                  {record.requisition_id ? (
                    <Link
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-violet-600"
                      to={`/admin/requisitions/${record.requisition_id}`}
                    >
                      View source requisition
                      <Link2 className="size-3" />
                    </Link>
                  ) : (
                    "Independent tender"
                  )}
                </p>
              </div>
            ) : (
              <div className="rounded-[16px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50/50 p-4">
                <Field title="Linked approved requisition (optional)">
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-normal transition hover:border-indigo-300 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100/70"
                    value={requisitionId ?? ""}
                    onChange={(event) => {
                      const nextId = event.target.value
                        ? Number(event.target.value)
                        : null;

                      form.setValue("requisition_id", nextId);

                      const source = requisitions.find(
                        (requisition) => requisition.id === nextId,
                      );

                      if (source) {
                        form.setValue(
                          "title",
                          source.requisition_number === "PR-001"
                            ? "ICU Equipment Supply 2026"
                            : source.title,
                        );

                        form.setValue("category", source.category);

                        form.setValue("scope", source.description ?? "");

                        form.setValue(
                          "boq",
                          source.items?.length ? source.items : [newItem()],
                        );
                      }
                    }}
                  >
                    <option value="">Independent tender</option>

                    {requisitions
                      .filter(
                        (requisition) => requisition.status === "approved",
                      )
                      .map((requisition) => (
                        <option key={requisition.id} value={requisition.id}>
                          {requisition.requisition_number} · {requisition.title}
                        </option>
                      ))}
                  </select>
                </Field>
              </div>
            )}

            <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-indigo-50/25 p-4">
              <Field title="Scope of supply / service">
                <TextArea
                  required
                  maxLength={5000}
                  {...form.register("scope")}
                />
              </Field>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                ELIGIBILITY
              </p>

              <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
                Supplier Eligibility & Invitations
              </h2>
            </div>
          </header>

          <div className="space-y-5 p-5 sm:p-6">
            <Field title="Eligibility requirements">
              <TextArea
                required
                maxLength={5000}
                {...form.register("eligibility")}
              />
            </Field>

            {type !== "public_tender" && (
              <div className="space-y-3">
                <p className="text-[10px] leading-5 text-slate-500">
                  Select approved suppliers. Invited tenders require at least
                  one eligible vendor.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {approvedVendors.map((vendor) => {
                    const selected = vendorIds.includes(vendor.id);

                    return (
                      <label
                        key={vendor.id}
                        className={`cursor-pointer rounded-[16px] border p-4 transition ${
                          selected
                            ? "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50/40 shadow-sm"
                            : "border-slate-100 bg-white hover:border-violet-200 hover:bg-violet-50/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={selected}
                            onChange={(event) =>
                              form.setValue(
                                "invited_vendor_ids",
                                event.target.checked
                                  ? [...vendorIds, vendor.id]
                                  : vendorIds.filter(
                                      (vendorId) => vendorId !== vendor.id,
                                    ),
                              )
                            }
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Building2 className="size-4 text-violet-600" />

                              <p className="text-[11px] font-semibold text-slate-900">
                                {vendor.name}
                              </p>
                            </div>

                            {vendor.status !== "approved" && (
                              <p className="mt-2 text-[9px] font-medium text-red-600">
                                No longer approved — remove before saving
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {vendors.every((vendor) => vendor.status !== "approved") && (
                  <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[10px] text-amber-800">
                    No approved vendors are available.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-100 to-indigo-50 text-cyan-700">
              <Boxes className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-cyan-700">
                BILL OF QUANTITIES
              </p>

              <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
                BOQ & Specifications
              </h2>
            </div>
          </header>

          <div className="p-5 sm:p-6">
            <ItemEditor
              items={boq}
              onChange={(items) => form.setValue("boq", items)}
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-violet-500" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-100 to-violet-50 text-amber-700">
              <FileCheck2 className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-amber-700">
                DOCUMENT REGISTER
              </p>

              <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
                Supporting Documents
              </h2>
            </div>
          </header>

          <div className="p-5 sm:p-6">
            <Field title="Document titles (one per line)">
              <TextArea
                value={documents}
                onChange={(event) => setDocuments(event.target.value)}
              />
            </Field>

            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-[9px] leading-4 text-slate-400">
              This demo stores document titles only. Original files and document
              delivery are not connected.
            </p>
          </div>
        </section>
      </fieldset>

      {Object.keys(form.formState.errors).length > 0 && (
        <p
          role="alert"
          className="rounded-[16px] border border-rose-100 bg-rose-50 px-4 py-3 text-[11px] font-medium text-rose-700"
        >
          Complete required fields and enter valid BOQ quantities and amounts.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[11px] font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <section className="sticky bottom-4 z-20 rounded-[20px] border border-white/90 bg-white/90 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden items-center gap-2 px-2 sm:flex">
            <Sparkles className="size-4 text-violet-500" />

            <p className="text-[10px] text-slate-500">
              Save the tender before submitting it through governance approval.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                navigate(
                  record ? `/admin/tenders/${record.id}` : "/admin/tenders",
                )
              }
              className="h-11 rounded-xl border-slate-200 px-5 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-violet-50 hover:to-cyan-50 hover:text-indigo-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={busy}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)]"
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

export function TenderFormPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const tender = useQuery({
    queryKey: ["tenders", id],
    queryFn: ({ signal }) => tenderApi.get(id!, signal),
    enabled: !!id,
  });

  const requisitions = useQuery({
    queryKey: ["requisitions"],
    queryFn: ({ signal }) => requisitionApi.list(signal),
  });

  const vendors = useQuery({
    queryKey: ["vendors"],
    queryFn: ({ signal }) => vendorApi.list(signal),
  });

  if (user?.role !== "admin") {
    return (
      <EmptyState
        title="Read-only access"
        description="Only procurement administrators can create or edit tenders."
      />
    );
  }

  const pending =
    (!!id && tender.isPending) || requisitions.isPending || vendors.isPending;

  const error = tender.error || requisitions.error || vendors.error;

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

      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75">
          <Gavel className="size-3.5 text-cyan-200" />

          {editing ? "EDIT SOURCING EVENT" : "NEW SOURCING EVENT"}
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {editing ? "Edit Tender" : "Create Tender"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
          Define sourcing scope, BOQ, supplier eligibility, supporting documents
          and publication timeline.
        </p>
      </section>

      {pending || error ? (
        <QueryState
          pending={pending}
          error={error}
          retry={() => {
            if (id) {
              void tender.refetch();
            }

            void requisitions.refetch();
            void vendors.refetch();
          }}
        />
      ) : id && tender.data?.status !== "draft" ? (
        <EmptyState
          title="This tender is no longer editable"
          description="Only drafts can be edited. Published tenders use addenda and deadline extensions."
        />
      ) : (
        <TenderEditor
          key={id ?? "new"}
          record={tender.data}
          requisitions={requisitions.data ?? []}
          vendors={vendors.data ?? []}
        />
      )}
    </div>
  );
}
