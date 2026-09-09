import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileSignature,
  Gavel,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  contractDemo,
  purchaseOrderDemo,
} from "@/features/evaluations/evaluation-demo-data";

type ContractStage = "draft" | "active";

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

export function ContractPage() {
  const [contractStage, setContractStage] = useState<ContractStage>(() => {
    const saved = localStorage.getItem("bsh-phase6-contract-stage");

    return saved === "active" ? "active" : "draft";
  });

  const [activateOpen, setActivateOpen] = useState(false);

  const poAccepted = localStorage.getItem("bsh-phase6-po-stage") === "accepted";

  function activateContract() {
    setContractStage("active");

    localStorage.setItem("bsh-phase6-contract-stage", "active");

    toast.success("Contract activated");
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
              <FileSignature className="size-3.5 text-cyan-200" />
              CONTRACT MANAGEMENT
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Contract
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Review and activate the supplier agreement linked to the accepted
              purchase order and approved tender award.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {contractDemo.contractNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {contractDemo.poNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {contractDemo.vendor}
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
                  CONTRACT VALUE
                </p>

                <p className="mt-1.5 text-lg font-semibold text-white">
                  {formatBdt(contractDemo.value)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependency */}
      {!poAccepted && (
        <section className="relative overflow-hidden rounded-[18px] border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/40 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <PackageCheck className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-amber-700">
                PREVIOUS STEP REQUIRED
              </p>

              <p className="mt-1.5 text-[12px] font-semibold text-amber-950">
                Vendor acceptance required
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-800">
                The purchase order must be accepted before this contract can be
                activated.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FileSignature className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-indigo-500">
            CONTRACT NUMBER
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {contractDemo.contractNumber}
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
            {contractDemo.vendor}
          </p>
        </article>

        <article className="rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CircleDollarSign className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-emerald-600">
            CONTRACT VALUE
          </p>

          <p className="mt-1.5 truncate text-[14px] font-semibold text-slate-900">
            {formatBdt(contractDemo.value)}
          </p>
        </article>

        <article className="rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <CalendarDays className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-cyan-700">
            CONTRACT PERIOD
          </p>

          <p className="mt-1.5 text-[12px] font-semibold text-slate-900">
            {formatDate(contractDemo.startDate)}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-400">
            to {formatDate(contractDemo.endDate)}
          </p>
        </article>
      </section>

      {/* Identity */}
      <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-indigo-600">
                {contractDemo.contractNumber}
              </p>

              <Badge
                variant={contractStage === "active" ? "secondary" : "outline"}
                className={
                  contractStage === "active"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-amber-100 bg-amber-50 text-amber-700"
                }
              >
                {contractStage === "active" ? "Active" : "Draft"}
              </Badge>
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              ICU Equipment Supply 2026
            </h2>

            <p className="mt-2 text-[11px] text-slate-500">
              Supplier:{" "}
              <span className="font-semibold text-slate-700">
                {contractDemo.vendor}
              </span>
            </p>
          </div>

          <div className="rounded-[18px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 px-5 py-4 lg:min-w-64 lg:text-right">
            <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
              AGREEMENT VALUE
            </p>

            <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-emerald-700">
              {formatBdt(contractDemo.value)}
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
              <FileSignature className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                AGREEMENT INFORMATION
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Contract Details
              </h2>
            </div>
          </header>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-indigo-500">
                TENDER
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {contractDemo.tenderNumber}
              </p>
            </div>

            <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-500">
                PURCHASE ORDER
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {contractDemo.poNumber}
              </p>
            </div>

            <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                START DATE
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {formatDate(contractDemo.startDate)}
              </p>
            </div>

            <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                END DATE
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {formatDate(contractDemo.endDate)}
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
              Contract Progress
            </h2>
          </header>

          <div className="relative space-y-3 p-5">
            <div className="pointer-events-none absolute bottom-10 left-[37px] top-10 w-px bg-gradient-to-b from-emerald-200 via-cyan-200 to-slate-200" />

            <div className="relative flex gap-3">
              <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Gavel className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Award Approved
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  MediSupply Ltd.
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  poAccepted
                    ? "border-cyan-100 bg-cyan-50 text-cyan-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <PackageCheck className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  PO Accepted
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {poAccepted
                    ? purchaseOrderDemo.poNumber
                    : "Awaiting supplier acceptance"}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  contractStage === "active"
                    ? "border-violet-100 bg-violet-50 text-violet-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <FileSignature className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Contract Activation
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {contractStage === "active"
                    ? "Contract is active"
                    : "Pending activation"}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400">
                <CalendarDays className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Delivery
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  Next stage in Phase 7
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
              WORKFLOW ACTION
            </p>

            <h2 className="mt-1 text-[16px] font-semibold text-slate-900">
              Contract Action
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Activate the agreement after supplier acceptance of the purchase
              order.
            </p>
          </div>

          <div>
            {contractStage === "draft" ? (
              <Button
                disabled={!poAccepted}
                onClick={() => setActivateOpen(true)}
                className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.2)]"
              >
                <ShieldCheck className="size-4" />
                Activate Contract
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-4" />
                Contract Active
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmationDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        title="Activate contract?"
        description={`Activate ${contractDemo.contractNumber} for ${contractDemo.vendor}?`}
        confirmLabel="Activate Contract"
        onConfirm={activateContract}
      />
    </div>
  );
}
