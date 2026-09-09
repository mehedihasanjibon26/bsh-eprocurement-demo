import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  PackageCheck,
  PackageOpen,
  Truck,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  deliveryDemo,
  deliveryItemsDemo,
  goodsReceiptDemo,
} from "./payment-demo-data";

type DeliveryStage = "pending" | "delivered" | "receipt_confirmed";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function DeliveryReceiptPage() {
  const [stage, setStage] = useState<DeliveryStage>(() => {
    const saved = localStorage.getItem("bsh-phase7-delivery-stage");

    if (saved === "delivered" || saved === "receipt_confirmed") {
      return saved;
    }

    return "pending";
  });

  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const [receiptOpen, setReceiptOpen] = useState(false);

  const contractActive =
    localStorage.getItem("bsh-phase6-contract-stage") === "active";

  const deliveredCount =
    stage === "pending"
      ? 0
      : deliveryItemsDemo.reduce(
          (sum, item) => sum + item.deliveredQuantity,
          0,
        );

  const orderedCount = deliveryItemsDemo.reduce(
    (sum, item) => sum + item.orderedQuantity,
    0,
  );

  const stageLabel =
    stage === "pending"
      ? "Pending Delivery"
      : stage === "delivered"
        ? "Delivered"
        : "Receipt Confirmed";

  function recordDelivery() {
    setStage("delivered");

    localStorage.setItem("bsh-phase7-delivery-stage", "delivered");

    toast.success("Delivery recorded successfully");
  }

  function confirmReceipt() {
    setStage("receipt_confirmed");

    localStorage.setItem("bsh-phase7-delivery-stage", "receipt_confirmed");

    toast.success("Goods receipt confirmed");
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
              <Truck className="size-3.5 text-cyan-200" />
              DELIVERY & RECEIVING
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Delivery & Goods Receipt
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Record supplier delivery, inspect delivered items and confirm
              hospital goods receipt against the approved purchase order.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {deliveryDemo.deliveryNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {deliveryDemo.poNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {deliveryDemo.vendor}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[18px] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-md lg:w-auto lg:min-w-64">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <CalendarDays className="size-4" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-white/45">
                  EXPECTED DELIVERY
                </p>

                <p className="mt-1.5 text-sm font-semibold text-white">
                  {formatDate(deliveryDemo.deliveryDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependency alert */}
      {!contractActive && (
        <section className="relative overflow-hidden rounded-[18px] border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/40 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <PackageOpen className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-amber-700">
                PREVIOUS STEP REQUIRED
              </p>

              <p className="mt-1.5 text-[12px] font-semibold text-amber-950">
                Active contract required
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-800">
                Activate the supplier contract before recording delivery.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* KPI */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Truck className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-indigo-500">
            DELIVERY NUMBER
          </p>

          <p className="mt-1.5 text-[14px] font-semibold text-slate-900">
            {deliveryDemo.deliveryNumber}
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
            {deliveryDemo.vendor}
          </p>
        </article>

        <article className="rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <PackageCheck className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-cyan-700">
            ITEMS RECEIVED
          </p>

          <p className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            {deliveredCount}
            <span className="ml-1 text-xs font-medium text-slate-400">
              / {orderedCount}
            </span>
          </p>
        </article>

        <article className="rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ClipboardCheck className="size-5" />
          </div>

          <p className="mt-4 text-[9px] font-semibold tracking-[0.13em] text-emerald-600">
            RECEIVING STATUS
          </p>

          <p className="mt-1.5 text-[13px] font-semibold text-slate-900">
            {stageLabel}
          </p>
        </article>
      </section>

      {/* Delivery identity */}
      <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-indigo-600">
                {deliveryDemo.deliveryNumber}
              </p>

              <Badge
                variant={
                  stage === "receipt_confirmed" ? "secondary" : "outline"
                }
                className={
                  stage === "receipt_confirmed"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : stage === "delivered"
                      ? "border-cyan-100 bg-cyan-50 text-cyan-700"
                      : "border-amber-100 bg-amber-50 text-amber-700"
                }
              >
                {stageLabel}
              </Badge>
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {deliveryDemo.title}
            </h2>

            <p className="mt-2 text-[11px] text-slate-500">
              Supplier:{" "}
              <span className="font-semibold text-slate-700">
                {deliveryDemo.vendor}
              </span>
            </p>
          </div>

          <div className="rounded-[18px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-indigo-50/40 px-5 py-4 lg:min-w-64 lg:text-right">
            <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
              PURCHASE ORDER
            </p>

            <p className="mt-1.5 text-[15px] font-semibold text-slate-900">
              {deliveryDemo.poNumber}
            </p>

            <p className="mt-1 text-[9px] text-slate-400">
              {deliveryDemo.contractNumber}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Delivered items */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] xl:col-span-2">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
              <Warehouse className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                GOODS RECEIVING
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Delivered Items
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Items received against {deliveryDemo.poNumber}.
              </p>
            </div>
          </header>

          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto rounded-[18px] border border-slate-100">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-violet-50/30 to-cyan-50/30">
                    <th className="h-12 px-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      ITEM
                    </th>

                    <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      ORDERED
                    </th>

                    <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      DELIVERED
                    </th>

                    <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      CONDITION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {deliveryItemsDemo.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-gradient-to-r hover:from-violet-50/35 hover:via-white hover:to-cyan-50/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-[10px] font-semibold text-violet-600">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div>
                            <p className="text-[12px] font-semibold text-slate-900">
                              {item.item}
                            </p>

                            <p className="mt-1 text-[9px] text-slate-400">
                              {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right text-[11px] font-medium text-slate-600">
                        {item.orderedQuantity} {item.unit}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex rounded-xl px-2.5 py-1.5 text-[11px] font-semibold ${
                            stage === "pending"
                              ? "border border-slate-100 bg-slate-50 text-slate-400"
                              : "border border-cyan-100 bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {stage === "pending"
                            ? "—"
                            : `${item.deliveredQuantity} ${item.unit}`}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {stage === "pending" ? (
                          <Badge
                            variant="outline"
                            className="border-amber-100 bg-amber-50 text-amber-700"
                          >
                            Pending
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="border border-emerald-100 bg-emerald-50 text-emerald-700"
                          >
                            {item.condition}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Receiving Progress
            </h2>
          </header>

          <div className="relative space-y-3 p-5">
            <div className="pointer-events-none absolute bottom-10 left-[37px] top-10 w-px bg-gradient-to-b from-emerald-200 via-cyan-200 to-slate-200" />

            <div className="relative flex gap-3">
              <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Purchase Order
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {deliveryDemo.poNumber}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  contractActive
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <PackageOpen className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Contract Active
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {contractActive
                    ? deliveryDemo.contractNumber
                    : "Pending activation"}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  stage !== "pending"
                    ? "border-cyan-100 bg-cyan-50 text-cyan-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <Truck className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Supplier Delivery
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {stage === "pending"
                    ? "Awaiting delivery"
                    : deliveryDemo.deliveryNumber}
                </p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                  stage === "receipt_confirmed"
                    ? "border-violet-100 bg-violet-50 text-violet-700"
                    : "border-slate-100 bg-white text-slate-400"
                }`}
              >
                <ClipboardCheck className="size-4" />
              </div>

              <div className="flex-1 rounded-[14px] border border-slate-100 bg-slate-50/50 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  Goods Receipt
                </p>

                <p className="mt-1 text-[9px] text-slate-500">
                  {stage === "receipt_confirmed"
                    ? goodsReceiptDemo.receiptNumber
                    : "Pending confirmation"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* GRN */}
      {stage !== "pending" && (
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-100 to-indigo-50 text-cyan-700">
              <ClipboardCheck className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-cyan-700">
                GOODS RECEIPT NOTE
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Goods Receipt Details
              </h2>
            </div>
          </header>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-indigo-500">
                GRN NUMBER
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {stage === "receipt_confirmed"
                  ? goodsReceiptDemo.receiptNumber
                  : "Pending"}
              </p>
            </div>

            <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                RECEIVED BY
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {goodsReceiptDemo.receivedBy}
              </p>
            </div>

            <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-600">
                CHECKED BY
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {goodsReceiptDemo.checkedBy}
              </p>
            </div>

            <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                RECEIVED DATE
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {formatDate(goodsReceiptDemo.receivedDate)}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Action */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
              WORKFLOW ACTION
            </p>

            <h2 className="mt-1 text-[16px] font-semibold text-slate-900">
              Receiving Action
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Record physical delivery and confirm hospital receipt.
            </p>
          </div>

          <div>
            {stage === "pending" && (
              <Button
                disabled={!contractActive}
                onClick={() => setDeliveryOpen(true)}
                className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.2)]"
              >
                <Truck className="size-4" />
                Record Delivery
              </Button>
            )}

            {stage === "delivered" && (
              <Button
                onClick={() => setReceiptOpen(true)}
                className="h-11 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 text-white"
              >
                <PackageCheck className="size-4" />
                Confirm Goods Receipt
              </Button>
            )}

            {stage === "receipt_confirmed" && (
              <div className="flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-4" />
                Goods Receipt Confirmed · {goodsReceiptDemo.receiptNumber}
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmationDialog
        open={deliveryOpen}
        onOpenChange={setDeliveryOpen}
        title="Record supplier delivery?"
        description={`Record ${deliveryDemo.deliveryNumber} against ${deliveryDemo.poNumber}?`}
        confirmLabel="Record Delivery"
        onConfirm={recordDelivery}
      />

      <ConfirmationDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        title="Confirm goods receipt?"
        description={`Confirm that all items under ${deliveryDemo.deliveryNumber} were received and checked by Bangladesh Specialized Hospital PLC?`}
        confirmLabel="Confirm Receipt"
        onConfirm={confirmReceipt}
      />
    </div>
  );
}
