import { useState } from "react";
import {
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Gavel,
  PackageCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  awardDemo,
  purchaseOrderDemo,
} from "@/features/evaluations/evaluation-demo-data";

type PoStage = "not_issued" | "issued" | "accepted";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function PurchaseOrderPage() {
  const [poStage, setPoStage] = useState<PoStage>(() => {
    const saved = localStorage.getItem("bsh-phase6-po-stage");

    if (saved === "issued" || saved === "accepted") {
      return saved;
    }

    return "not_issued";
  });

  const [issueOpen, setIssueOpen] = useState(false);

  const [acceptOpen, setAcceptOpen] = useState(false);

  const awardApproved =
    localStorage.getItem("bsh-phase6-award-stage") === "approved";

  const currentStatus =
    poStage === "not_issued"
      ? "Ready to Issue"
      : poStage === "issued"
        ? "Awaiting Vendor Acceptance"
        : "Accepted";

  function issuePurchaseOrder() {
    setPoStage("issued");

    localStorage.setItem("bsh-phase6-po-stage", "issued");

    toast.success("Purchase order issued");
  }

  function acceptPurchaseOrder() {
    setPoStage("accepted");

    localStorage.setItem("bsh-phase6-po-stage", "accepted");

    toast.success("Vendor acceptance recorded");
  }

  return (
    <div className="min-w-0 space-y-7">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/75 backdrop-blur">
              <ShoppingCart className="size-3.5 text-cyan-200" />
              PURCHASE ORDER
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Purchase Order
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Issue and track the supplier purchase order following approved
              tender evaluation and award.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {purchaseOrderDemo.poNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {purchaseOrderDemo.tenderNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {purchaseOrderDemo.vendor}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[18px] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-md lg:w-auto lg:min-w-64">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <CircleDollarSign className="size-4.5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-white/45">
                  PURCHASE ORDER VALUE
                </p>

                <p className="mt-1.5 text-lg font-semibold text-white">
                  {formatBdt(purchaseOrderDemo.value)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependency */}
      {!awardApproved && (
        <section className="relative overflow-hidden rounded-[18px] border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/40 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Gavel className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-amber-700">
                PREVIOUS STEP REQUIRED
              </p>

              <p className="mt-1.5 text-[12px] font-semibold text-amber-950">
                Award approval required
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-800">
                Approve the recommended vendor from the Evaluation module before
                issuing the purchase order.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <ShoppingCart className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-indigo-500">
            PO NUMBER
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {purchaseOrderDemo.poNumber}
          </p>
        </article>

        <article className="rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Building2 className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-violet-500">
            SUPPLIER
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {purchaseOrderDemo.vendor}
          </p>
        </article>

        <article className="rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CircleDollarSign className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-emerald-600">
            AWARD VALUE
          </p>

          <p className="mt-1.5 truncate text-[14px] font-semibold text-slate-900">
            {formatBdt(awardDemo.awardValue)}
          </p>
        </article>

        <article className="rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <CalendarDays className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-cyan-700">
            EXPECTED DELIVERY
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {formatDate(purchaseOrderDemo.deliveryDate)}
          </p>
        </article>
      </section>

      {/* PO Identity */}
      <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-indigo-600">
                {purchaseOrderDemo.poNumber}
              </p>

              <Badge
                variant={poStage === "accepted" ? "secondary" : "outline"}
                className={
                  poStage === "accepted"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : poStage === "issued"
                      ? "border-cyan-100 bg-cyan-50 text-cyan-700"
                      : "border-amber-100 bg-amber-50 text-amber-700"
                }
              >
                {currentStatus}
              </Badge>
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              ICU Equipment Supply 2026
            </h2>

            <p className="mt-2 text-[11px] text-slate-500">
              Supplier:{" "}
              <span className="font-semibold text-slate-700">
                {purchaseOrderDemo.vendor}
              </span>
            </p>
          </div>

          <div className="rounded-[18px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 px-5 py-4 lg:min-w-64 lg:text-right">
            <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
              ORDER VALUE
            </p>

            <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-emerald-700">
              {formatBdt(purchaseOrderDemo.value)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Details */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] xl:col-span-2">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
              <ShoppingCart className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                ORDER INFORMATION
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Purchase Order Details
              </h2>
            </div>
          </header>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-indigo-500">
                TENDER NUMBER
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {purchaseOrderDemo.tenderNumber}
              </p>
            </div>

            <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-500">
                SUPPLIER
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {purchaseOrderDemo.vendor}
              </p>
            </div>

            <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                AWARD VALUE
              </p>

              <p className="mt-2 text-[12px] font-semibold text-emerald-700">
                {formatBdt(awardDemo.awardValue)}
              </p>
            </div>

            <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                EXPECTED DELIVERY
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {formatDate(purchaseOrderDemo.deliveryDate)}
              </p>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />

          <header className="border-b border-slate-100 px-5 pb-5 pt-6">
            <p className="text-[9px] font-semibold tracking-[0.17em] text-emerald-600">
              WORKFLOW
            </p>

            <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
              Order Progress
            </h2>
          </header>

          <div className="relative space-y-3 p-5">
            <div className="pointer-events-none absolute bottom-10 left-[37px] top-10 w-px bg-gradient-to-b from-emerald-200 via-cyan-200 to-slate-200" />

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  awardApproved
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <Award className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Award Approved
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {awardApproved
                    ? "MediSupply Ltd. selected."
                    : "Awaiting award approval"}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  poStage !== "not_issued"
                    ? "border-cyan-100 bg-cyan-50 text-cyan-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <ShoppingCart className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Purchase Order Issued
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {poStage === "not_issued"
                    ? "Pending"
                    : purchaseOrderDemo.poNumber}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  poStage === "accepted"
                    ? "border-violet-100 bg-violet-50 text-violet-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <PackageCheck className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Vendor Acceptance
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {poStage === "accepted"
                    ? "Accepted by supplier"
                    : "Awaiting supplier"}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400">
                <Truck className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Delivery
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  Phase 7 delivery workflow
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Actions */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
              WORKFLOW ACTION
            </p>

            <h2 className="mt-1 text-[16px] font-semibold text-slate-900">
              Purchase Order Actions
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Progress the order through issue and supplier acceptance.
            </p>
          </div>

          <div>
            {poStage === "not_issued" && (
              <Button
                disabled={!awardApproved}
                onClick={() => setIssueOpen(true)}
                className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.2)]"
              >
                <ShoppingCart className="size-4" />
                Issue Purchase Order
              </Button>
            )}

            {poStage === "issued" && (
              <Button
                onClick={() => setAcceptOpen(true)}
                className="h-11 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 text-white"
              >
                <PackageCheck className="size-4" />
                Record Vendor Acceptance
              </Button>
            )}

            {poStage === "accepted" && (
              <div className="flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-4" />
                Purchase Order Accepted
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmationDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
        title="Issue purchase order?"
        description={`Issue ${purchaseOrderDemo.poNumber} to ${purchaseOrderDemo.vendor} for ${formatBdt(purchaseOrderDemo.value)}?`}
        confirmLabel="Issue PO"
        onConfirm={issuePurchaseOrder}
      />

      <ConfirmationDialog
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        title="Record vendor acceptance?"
        description="This demo action will mark the purchase order as accepted by MediSupply Ltd."
        confirmLabel="Confirm Acceptance"
        onConfirm={acceptPurchaseOrder}
      />
    </div>
  );
}
