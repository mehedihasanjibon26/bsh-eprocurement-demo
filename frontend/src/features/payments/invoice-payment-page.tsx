import { useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  ReceiptText,
  Scale,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  if (!invoiceSubmitted) {
    return (
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
            INVOICE & PAYMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Invoices & Payments
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review supplier invoices, complete verification and three-way
            matching, and manage payment progression.
          </p>
        </div>

        <Card>
          <CardContent className="py-14 text-center">
            <ReceiptText className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-4 text-base font-semibold">
              Awaiting Supplier Invoice
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              MediSupply Ltd. has not submitted the invoice for{" "}
              {invoiceDemo.poNumber} yet. The invoice will appear here after
              supplier submission.
            </p>

            <div className="mx-auto mt-6 grid max-w-lg gap-3 rounded-lg border bg-muted/20 p-4 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Purchase Order</p>

                <p className="mt-1 text-sm font-medium">
                  {invoiceDemo.poNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Supplier</p>

                <p className="mt-1 text-sm font-medium">{invoiceDemo.vendor}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Goods Receipt</p>

                <p className="mt-1 text-sm font-medium">
                  {receiptConfirmed ? invoiceDemo.receiptNumber : "Pending"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Expected Invoice Value
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatBdt(invoiceDemo.amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          INVOICE & PAYMENT
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Invoice Verification & Payment
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Verify supplier billing, complete the three-way match, approve the
          invoice, and track payment status.
        </p>
      </div>

      {!receiptConfirmed && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">Goods receipt confirmation required</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Complete the delivery and goods receipt process before verifying
              this supplier invoice.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">
                  {invoiceDemo.invoiceNumber}
                </p>

                <Badge variant={stage === "paid" ? "secondary" : "outline"}>
                  {statusLabel}
                </Badge>
              </div>

              <h2 className="mt-2 text-lg font-semibold">Supplier Invoice</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {invoiceDemo.vendor} · {invoiceDemo.poNumber}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/20 px-5 py-4 lg:min-w-56 lg:text-right">
              <p className="text-xs text-muted-foreground">Invoice Amount</p>

              <p className="mt-1 text-xl font-semibold">
                {formatBdt(invoiceDemo.amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Invoice Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Invoice Number</p>

              <p className="mt-1 text-sm font-medium">
                {invoiceDemo.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Purchase Order</p>

              <p className="mt-1 text-sm font-medium">{invoiceDemo.poNumber}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Goods Receipt</p>

              <p className="mt-1 text-sm font-medium">
                {invoiceDemo.receiptNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Invoice Document</p>

              <p className="mt-1 text-sm font-medium">{invoiceFile}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(invoiceDemo.submittedDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(invoiceDemo.dueDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processing Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <ReceiptText className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">Invoice Submitted</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {invoiceDemo.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck2
                className={`mt-0.5 size-4 ${
                  stage !== "submitted"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Verification</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stage === "submitted" ? "Pending verification" : "Verified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scale
                className={`mt-0.5 size-4 ${
                  ["matched", "approved", "paid"].includes(stage)
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">3-Way Match</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {["matched", "approved", "paid"].includes(stage)
                    ? "MATCHED"
                    : "Pending"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CircleDollarSign
                className={`mt-0.5 size-4 ${
                  stage === "paid" ? "text-teal-700" : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Payment</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stage === "paid"
                    ? "Paid"
                    : stage === "approved"
                      ? "Approved for payment"
                      : "Pending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3-Way Match</CardTitle>

          <p className="text-xs text-muted-foreground">
            Compare the purchase order, confirmed goods receipt, and supplier
            invoice before payment approval.
          </p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Check</th>

                  <th className="pb-3 text-right font-medium">PO</th>

                  <th className="pb-3 text-right font-medium">Receipt</th>

                  <th className="pb-3 text-right font-medium">Invoice</th>

                  <th className="pb-3 text-right font-medium">Result</th>
                </tr>
              </thead>

              <tbody>
                {matchRowsDemo.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{row.label}</td>

                    <td className="py-4 text-right">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.poValue)
                        : row.poValue}
                    </td>

                    <td className="py-4 text-right">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.receiptValue)
                        : row.receiptValue}
                    </td>

                    <td className="py-4 text-right">
                      {row.label === "Purchase Order"
                        ? formatBdt(row.invoiceValue)
                        : row.invoiceValue}
                    </td>

                    <td className="py-4 text-right">
                      {["matched", "approved", "paid"].includes(stage) ? (
                        <Badge variant="secondary">{row.status}</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {["matched", "approved", "paid"].includes(stage) && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-teal-200 bg-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-700" />

                <div>
                  <p className="font-semibold text-teal-900">
                    3-Way Match: MATCHED
                  </p>

                  <p className="mt-1 text-xs text-teal-800">
                    {threeWayMatchDemo.poNumber},{" "}
                    {threeWayMatchDemo.receiptNumber}, and{" "}
                    {threeWayMatchDemo.invoiceNumber} are aligned.
                  </p>
                </div>
              </div>

              <p className="text-lg font-semibold text-teal-900">
                {formatBdt(threeWayMatchDemo.totalAmount)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Action</CardTitle>
        </CardHeader>

        <CardContent>
          {stage === "submitted" && (
            <Button
              disabled={!receiptConfirmed}
              onClick={() => setVerifyOpen(true)}
            >
              <FileCheck2 className="size-4" />
              Verify Invoice
            </Button>
          )}

          {stage === "verified" && (
            <Button onClick={() => setMatchOpen(true)}>
              <Scale className="size-4" />
              Run 3-Way Match
            </Button>
          )}

          {stage === "matched" && (
            <Button onClick={() => setApproveOpen(true)}>
              <CheckCircle2 className="size-4" />
              Approve Invoice
            </Button>
          )}

          {stage === "approved" && (
            <Button onClick={() => setPaymentOpen(true)}>
              <CircleDollarSign className="size-4" />
              Mark Payment Paid
            </Button>
          )}

          {stage === "paid" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                <CheckCircle2 className="size-4" />
                Payment completed successfully
              </div>

              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment Reference
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {paymentDemo.reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Method</p>

                  <p className="mt-1 text-sm font-medium">
                    {paymentDemo.method}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Paid Date</p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(paymentDemo.paidDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>

                  <p className="mt-1 text-sm font-medium">
                    {formatBdt(paymentDemo.amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
