import { useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  ReceiptText,
  Scale,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  invoiceDemo,
  paymentDemo,
} from "@/features/payments/payment-demo-data";

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

export function VendorInvoicesPage() {
  const receiptConfirmed =
    localStorage.getItem("bsh-phase7-delivery-stage") === "receipt_confirmed";

  const [submitted, setSubmitted] = useState(
    () => localStorage.getItem("bsh-phase7-invoice-submitted") === "true",
  );

  const [stage, setStage] = useState<InvoiceStage>(getInvoiceStage);

  const [invoiceFile, setInvoiceFile] = useState(
    () => localStorage.getItem("bsh-phase7-invoice-file") ?? "",
  );

  const [submitOpen, setSubmitOpen] = useState(false);

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

  function submitInvoice() {
    localStorage.setItem("bsh-phase7-invoice-submitted", "true");

    localStorage.setItem("bsh-phase7-invoice-stage", "submitted");

    localStorage.setItem("bsh-phase7-invoice-file", invoiceFile);

    setSubmitted(true);
    setStage("submitted");

    toast.success("Invoice submitted successfully");
  }

  if (!submitted) {
    return (
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
            SUPPLIER BILLING
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Submit Invoice
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Submit your supplier invoice against the completed purchase order
            and confirmed goods receipt.
          </p>
        </div>

        {!receiptConfirmed && (
          <Card>
            <CardContent className="p-5">
              <p className="font-medium">Goods receipt is not confirmed yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Bangladesh Specialized Hospital PLC must confirm receipt of the
                delivered goods before this invoice can be submitted.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Supplier Invoice</CardTitle>

            <p className="text-xs text-muted-foreground">
              Invoice for {invoiceDemo.poNumber}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium">Invoice Number</label>

                <Input
                  className="mt-2"
                  value={invoiceDemo.invoiceNumber}
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-medium">Purchase Order</label>

                <Input className="mt-2" value={invoiceDemo.poNumber} disabled />
              </div>

              <div>
                <label className="text-xs font-medium">Goods Receipt</label>

                <Input
                  className="mt-2"
                  value={invoiceDemo.receiptNumber}
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-medium">Invoice Amount</label>

                <Input
                  className="mt-2"
                  value={formatBdt(invoiceDemo.amount)}
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-medium">Invoice Date</label>

                <Input
                  className="mt-2"
                  value={formatDate(invoiceDemo.submittedDate)}
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-medium">Due Date</label>

                <Input
                  className="mt-2"
                  value={formatDate(invoiceDemo.dueDate)}
                  disabled
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Invoice Document</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Upload the invoice document for verification. File storage is
                simulated for this demo.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  className={buttonVariants({
                    variant: "outline",
                    className: "cursor-pointer",
                  })}
                >
                  <Upload className="size-4" />
                  Choose Invoice File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={!receiptConfirmed}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        setInvoiceFile(file.name);
                      }
                    }}
                  />
                </label>

                <p className="text-xs text-muted-foreground">
                  {invoiceFile || "No invoice document selected"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t pt-5">
              <Button
                disabled={!receiptConfirmed || !invoiceFile}
                onClick={() => setSubmitOpen(true)}
              >
                <ReceiptText className="size-4" />
                Submit Invoice
              </Button>

              {!invoiceFile && receiptConfirmed && (
                <p className="text-xs text-muted-foreground">
                  Select an invoice document before submission.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <ConfirmationDialog
          open={submitOpen}
          onOpenChange={setSubmitOpen}
          title="Submit supplier invoice?"
          description={`Submit ${invoiceDemo.invoiceNumber} for ${formatBdt(invoiceDemo.amount)} against ${invoiceDemo.poNumber}?`}
          confirmLabel="Submit Invoice"
          onConfirm={submitInvoice}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          SUPPLIER BILLING
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Invoices
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track submitted invoices, verification, three-way matching, approval,
          and payment status with Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">
                  {invoiceDemo.invoiceNumber}
                </p>

                <Badge variant={stage === "paid" ? "secondary" : "outline"}>
                  {statusLabel}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <ReceiptText className="size-4 text-muted-foreground" />

                <h2 className="text-base font-semibold">
                  Invoice for {invoiceDemo.poNumber}
                </h2>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="size-3.5" />
                  Invoice ID: {invoiceDemo.invoiceId}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  Submitted {formatDate(invoiceDemo.submittedDate)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:min-w-52 lg:text-right">
              <p className="text-xs text-muted-foreground">Invoice Amount</p>

              <p className="mt-1 text-lg font-semibold">
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
              <p className="text-xs text-muted-foreground">Submitted Date</p>

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

            <div>
              <p className="text-xs text-muted-foreground">Supplier</p>

              <p className="mt-1 text-sm font-medium">{invoiceDemo.vendor}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Status</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                Invoice Processing
              </p>

              <p className="mt-1 text-lg font-semibold">{statusLabel}</p>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {stage === "submitted" &&
                  "Your invoice has been submitted and is awaiting BSH verification."}

                {stage === "verified" &&
                  "Your invoice has been verified and is ready for three-way matching."}

                {stage === "matched" &&
                  "Purchase order, goods receipt, and invoice have been successfully matched."}

                {stage === "approved" &&
                  "Your invoice has been approved and is awaiting payment."}

                {stage === "paid" &&
                  "Payment has been completed by Bangladesh Specialized Hospital PLC."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Processing Timeline</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-5">
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-0.5 size-4 text-teal-700" />

            <div>
              <p className="text-sm font-medium">Submitted</p>

              <p className="mt-1 text-xs text-muted-foreground">Complete</p>
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
              <p className="text-sm font-medium">Verified</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stage === "submitted" ? "Pending" : "Complete"}
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
            <CheckCircle2
              className={`mt-0.5 size-4 ${
                ["approved", "paid"].includes(stage)
                  ? "text-teal-700"
                  : "text-muted-foreground"
              }`}
            />

            <div>
              <p className="text-sm font-medium">Approved</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {["approved", "paid"].includes(stage) ? "Complete" : "Pending"}
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
                {stage === "paid" ? "Paid" : "Pending"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stage === "paid" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Payment Reference</p>

              <p className="mt-1 text-sm font-medium">
                {paymentDemo.reference}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Payment Method</p>

              <p className="mt-1 text-sm font-medium">{paymentDemo.method}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Paid Date</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(paymentDemo.paidDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Paid Amount</p>

              <p className="mt-1 text-sm font-medium">
                {formatBdt(paymentDemo.amount)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
