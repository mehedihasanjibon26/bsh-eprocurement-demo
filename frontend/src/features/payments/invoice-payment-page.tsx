import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileCheck2,
  FileText,
  PackageCheck,
  ReceiptText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  invoiceDemo,
  matchRowsDemo,
  paymentDemo,
  threeWayMatchDemo,
} from "./payment-demo-data";

type InvoiceStage = "submitted" | "verified" | "matched" | "approved" | "paid";

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

function getInvoiceStage(): InvoiceStage {
  const saved = localStorage.getItem("bsh-phase7-invoice-stage");

  if (
    saved === "verified" ||
    saved === "matched" ||
    saved === "approved" ||
    saved === "paid"
  ) {
    return saved;
  }

  return "submitted";
}

const stageOrder: InvoiceStage[] = [
  "submitted",
  "verified",
  "matched",
  "approved",
  "paid",
];

export function InvoicePaymentPage() {
  const [stage, setStage] = useState<InvoiceStage>(getInvoiceStage);

  const [verifyOpen, setVerifyOpen] = useState(false);

  const [matchOpen, setMatchOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);

  const receiptConfirmed =
    localStorage.getItem("bsh-phase7-delivery-stage") === "receipt_confirmed";

  const invoiceSubmitted =
    localStorage.getItem("bsh-phase7-invoice-submitted") === "true";

  const invoiceFile =
    localStorage.getItem("bsh-phase7-invoice-file") ?? "Supplier Invoice.pdf";

  const currentStageIndex = stageOrder.indexOf(stage);

  const statusLabel =
    stage === "submitted"
      ? "Submitted"
      : stage === "verified"
        ? "Verified"
        : stage === "matched"
          ? "Matched"
          : stage === "approved"
            ? "Approved"
            : "Paid";

  function verifyInvoice() {
    setStage("verified");

    localStorage.setItem("bsh-phase7-invoice-stage", "verified");

    toast.success("Invoice verified");
  }

  function runMatch() {
    setStage("matched");

    localStorage.setItem("bsh-phase7-invoice-stage", "matched");

    toast.success("3-way match completed — MATCHED");
  }

  function approveInvoice() {
    setStage("approved");

    localStorage.setItem("bsh-phase7-invoice-stage", "approved");

    toast.success("Invoice approved for payment");
  }

  function markPaid() {
    setStage("paid");

    localStorage.setItem("bsh-phase7-invoice-stage", "paid");

    toast.success("Payment marked as paid");
  }

  if (!invoiceSubmitted) {
    return (
      <div className="min-w-0 space-y-7">
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

            <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/75">
            <ReceiptText className="size-3.5 text-cyan-200" />
            INVOICE & PAYMENT
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Invoices & Payments
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Review supplier invoices, complete verification and three-way
            matching, approve invoices and track payment progression.
          </p>
        </section>

        <section className="relative isolate overflow-hidden rounded-[26px] border border-white/90 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-8">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-indigo-100 via-violet-50 to-cyan-50 text-indigo-600">
              <ReceiptText className="size-7" />
            </div>

            <p className="mt-5 text-[9px] font-semibold tracking-[0.16em] text-indigo-600">
              WAITING FOR SUPPLIER
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              Awaiting Supplier Invoice
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-[11px] leading-5 text-slate-500">
              MediSupply Ltd. has not submitted the invoice for{" "}
              {invoiceDemo.poNumber} yet. The invoice will appear here after
              supplier submission.
            </p>

            <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
              <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4">
                <p className="text-[8px] font-semibold tracking-[0.13em] text-indigo-500">
                  PURCHASE ORDER
                </p>

                <p className="mt-2 text-[12px] font-semibold text-slate-900">
                  {invoiceDemo.poNumber}
                </p>
              </div>

              <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4">
                <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-500">
                  SUPPLIER
                </p>

                <p className="mt-2 text-[12px] font-semibold text-slate-900">
                  {invoiceDemo.vendor}
                </p>
              </div>

              <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/40 p-4">
                <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                  GOODS RECEIPT
                </p>

                <p className="mt-2 text-[12px] font-semibold text-slate-900">
                  {receiptConfirmed ? invoiceDemo.receiptNumber : "Pending"}
                </p>
              </div>

              <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                  EXPECTED VALUE
                </p>

                <p className="mt-2 text-[12px] font-semibold text-emerald-700">
                  {formatBdt(invoiceDemo.amount)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-7">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/75">
              <ReceiptText className="size-3.5 text-cyan-200" />
              INVOICE & PAYMENT
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Invoice Verification & Payment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Verify supplier billing, complete the three-way match, approve the
              invoice and track payment status.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {invoiceDemo.invoiceNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {invoiceDemo.poNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {invoiceDemo.vendor}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[18px] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-md lg:w-auto lg:min-w-64">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <CircleDollarSign className="size-4" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-white/45">
                  INVOICE AMOUNT
                </p>

                <p className="mt-1.5 text-lg font-semibold text-white">
                  {formatBdt(invoiceDemo.amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!receiptConfirmed && (
        <section className="relative overflow-hidden rounded-[18px] border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <PackageCheck className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-amber-700">
                PREVIOUS STEP REQUIRED
              </p>

              <p className="mt-1.5 text-[12px] font-semibold text-amber-950">
                Goods receipt confirmation required
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-800">
                Complete delivery and goods receipt before verifying this
                supplier invoice.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* KPI */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <ReceiptText className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-indigo-500">
            INVOICE
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {invoiceDemo.invoiceNumber}
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
            {invoiceDemo.vendor}
          </p>
        </article>

        <article className="rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <CalendarDays className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-cyan-700">
            DUE DATE
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {formatDate(invoiceDemo.dueDate)}
          </p>
        </article>

        <article className="rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-emerald-600">
            PROCESSING STATUS
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {statusLabel}
          </p>
        </article>
      </section>

      {/* Invoice identity */}
      <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-indigo-600">
                {invoiceDemo.invoiceNumber}
              </p>

              <Badge
                variant={stage === "paid" ? "secondary" : "outline"}
                className={
                  stage === "paid"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-violet-100 bg-violet-50 text-violet-700"
                }
              >
                {statusLabel}
              </Badge>
            </div>

            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Supplier Invoice
            </h2>

            <p className="mt-2 text-[11px] text-slate-500">
              {invoiceDemo.vendor} · {invoiceDemo.poNumber}
            </p>
          </div>

          <div className="rounded-[18px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 px-5 py-4 lg:min-w-64 lg:text-right">
            <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
              INVOICE VALUE
            </p>

            <p className="mt-1.5 text-xl font-semibold text-emerald-700">
              {formatBdt(invoiceDemo.amount)}
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
              <FileText className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                BILLING INFORMATION
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Invoice Details
              </h2>
            </div>
          </header>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            {[
              ["INVOICE NUMBER", invoiceDemo.invoiceNumber],
              ["PURCHASE ORDER", invoiceDemo.poNumber],
              ["GOODS RECEIPT", invoiceDemo.receiptNumber],
              ["INVOICE DOCUMENT", invoiceFile],
              ["SUBMITTED", formatDate(invoiceDemo.submittedDate)],
              ["DUE DATE", formatDate(invoiceDemo.dueDate)],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-indigo-50/25 p-4"
              >
                <p className="text-[8px] font-semibold tracking-[0.13em] text-slate-400">
                  {title}
                </p>

                <p className="mt-2 break-words text-[11px] font-semibold text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Processing */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />

          <header className="border-b border-slate-100 px-5 pb-5 pt-6">
            <p className="text-[9px] font-semibold tracking-[0.17em] text-emerald-600">
              WORKFLOW
            </p>

            <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
              Processing Status
            </h2>
          </header>

          <div className="relative space-y-3 p-5">
            <div className="pointer-events-none absolute bottom-10 left-[37px] top-10 w-px bg-gradient-to-b from-indigo-200 via-cyan-200 to-emerald-200" />

            {[
              {
                title: "Invoice Submitted",
                description: invoiceDemo.invoiceNumber,
                icon: ReceiptText,
                done: true,
              },
              {
                title: "Verification",
                description:
                  currentStageIndex >= 1 ? "Verified" : "Pending verification",
                icon: FileCheck2,
                done: currentStageIndex >= 1,
              },
              {
                title: "3-Way Match",
                description: currentStageIndex >= 2 ? "MATCHED" : "Pending",
                icon: Scale,
                done: currentStageIndex >= 2,
              },
              {
                title: "Payment Approval",
                description:
                  currentStageIndex >= 3 ? "Approved for payment" : "Pending",
                icon: ShieldCheck,
                done: currentStageIndex >= 3,
              },
              {
                title: "Payment",
                description: stage === "paid" ? "Paid" : "Pending",
                icon: CircleDollarSign,
                done: stage === "paid",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative flex gap-3">
                  <div
                    className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                      step.done
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 bg-white text-slate-400"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-[11px] font-semibold text-slate-800">
                      {step.title}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3 Way Match */}
      <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

        <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
          <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-100 to-violet-50 text-cyan-700">
            <Scale className="size-5" />
          </div>

          <div>
            <p className="text-[9px] font-semibold tracking-[0.17em] text-cyan-700">
              CONTROL CHECK
            </p>

            <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
              3-Way Match
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Compare the purchase order, confirmed goods receipt and supplier
              invoice before payment approval.
            </p>
          </div>
        </header>

        <div className="p-4 sm:p-5">
          <div className="overflow-x-auto rounded-[18px] border border-slate-100">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-cyan-50/30 to-violet-50/30">
                  <th className="h-12 px-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    CHECK
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    PO
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    RECEIPT
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    INVOICE
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    RESULT
                  </th>
                </tr>
              </thead>

              <tbody>
                {matchRowsDemo.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-cyan-50/30"
                  >
                    <td className="px-4 py-4 text-[11px] font-semibold text-slate-900">
                      {row.label}
                    </td>

                    <td className="px-4 py-4 text-right text-[10px] text-slate-600">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.poValue)
                        : row.poValue}
                    </td>

                    <td className="px-4 py-4 text-right text-[10px] text-slate-600">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.receiptValue)
                        : row.receiptValue}
                    </td>

                    <td className="px-4 py-4 text-right text-[10px] text-slate-600">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.invoiceValue)
                        : row.invoiceValue}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {currentStageIndex >= 2 ? (
                        <Badge
                          variant="secondary"
                          className="border border-emerald-100 bg-emerald-50 text-emerald-700"
                        >
                          {row.status}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-100 bg-amber-50 text-amber-700"
                        >
                          Pending
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentStageIndex >= 2 && (
            <div className="mt-5 flex flex-col gap-4 rounded-[18px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-5" />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-emerald-900">
                    3-Way Match: MATCHED
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-emerald-800">
                    {threeWayMatchDemo.poNumber},{" "}
                    {threeWayMatchDemo.receiptNumber} and{" "}
                    {threeWayMatchDemo.invoiceNumber} are aligned.
                  </p>
                </div>
              </div>

              <p className="text-lg font-semibold text-emerald-900">
                {formatBdt(threeWayMatchDemo.totalAmount)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
                WORKFLOW ACTION
              </p>

              <h2 className="mt-1 text-[16px] font-semibold text-slate-900">
                Invoice Action
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Progress invoice controls sequentially through payment
                completion.
              </p>
            </div>

            <div>
              {stage === "submitted" && (
                <Button
                  disabled={!receiptConfirmed}
                  onClick={() => setVerifyOpen(true)}
                  className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white"
                >
                  <FileCheck2 className="size-4" />
                  Verify Invoice
                </Button>
              )}

              {stage === "verified" && (
                <Button
                  onClick={() => setMatchOpen(true)}
                  className="h-11 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 text-white"
                >
                  <Scale className="size-4" />
                  Run 3-Way Match
                </Button>
              )}

              {stage === "matched" && (
                <Button
                  onClick={() => setApproveOpen(true)}
                  className="h-11 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 text-white"
                >
                  <CheckCircle2 className="size-4" />
                  Approve Invoice
                </Button>
              )}

              {stage === "approved" && (
                <Button
                  onClick={() => setPaymentOpen(true)}
                  className="h-11 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 text-white"
                >
                  <CircleDollarSign className="size-4" />
                  Mark Payment Paid
                </Button>
              )}
            </div>
          </div>

          {stage === "paid" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-4" />
                Payment completed successfully
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[15px] border border-indigo-100 bg-indigo-50/40 p-4">
                  <p className="text-[8px] font-semibold tracking-[0.13em] text-indigo-500">
                    PAYMENT REFERENCE
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-slate-900">
                    {paymentDemo.reference}
                  </p>
                </div>

                <div className="rounded-[15px] border border-violet-100 bg-violet-50/40 p-4">
                  <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-500">
                    METHOD
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <CreditCard className="size-3.5 text-violet-600" />

                    <p className="text-[11px] font-semibold text-slate-900">
                      {paymentDemo.method}
                    </p>
                  </div>
                </div>

                <div className="rounded-[15px] border border-cyan-100 bg-cyan-50/40 p-4">
                  <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                    PAID DATE
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-slate-900">
                    {formatDate(paymentDemo.paidDate)}
                  </p>
                </div>

                <div className="rounded-[15px] border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                    AMOUNT
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-emerald-700">
                    {formatBdt(paymentDemo.amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ConfirmationDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        title="Verify supplier invoice?"
        description={`Verify ${invoiceDemo.invoiceNumber} against the confirmed goods receipt?`}
        confirmLabel="Verify Invoice"
        onConfirm={verifyInvoice}
      />

      <ConfirmationDialog
        open={matchOpen}
        onOpenChange={setMatchOpen}
        title="Run 3-way match?"
        description="Compare the purchase order, goods receipt, and supplier invoice."
        confirmLabel="Run Match"
        onConfirm={runMatch}
      />

      <ConfirmationDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve invoice for payment?"
        description={`Approve ${invoiceDemo.invoiceNumber} for ${formatBdt(invoiceDemo.amount)}?`}
        confirmLabel="Approve Invoice"
        onConfirm={approveInvoice}
      />

      <ConfirmationDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        title="Mark payment as paid?"
        description={`Record payment of ${formatBdt(paymentDemo.amount)} to ${paymentDemo.vendor}?`}
        confirmLabel="Mark Paid"
        onConfirm={markPaid}
      />
    </div>
  );
}
