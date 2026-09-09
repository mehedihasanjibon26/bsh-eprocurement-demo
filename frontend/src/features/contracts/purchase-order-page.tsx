import { useState } from "react";
import { CheckCircle2, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          PURCHASE ORDER
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Purchase Order
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Issue and track the purchase order following the approved tender
          award.
        </p>
      </div>

      {!awardApproved && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">Award approval required</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Approve the recommended vendor from the Evaluation module before
              issuing the purchase order.
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
                  {purchaseOrderDemo.poNumber}
                </p>

                <Badge
                  variant={poStage === "accepted" ? "secondary" : "outline"}
                >
                  {poStage === "not_issued"
                    ? "Ready to Issue"
                    : poStage === "issued"
                      ? "Awaiting Vendor Acceptance"
                      : "Accepted"}
                </Badge>
              </div>

              <h2 className="mt-2 text-lg font-semibold">
                ICU Equipment Supply 2026
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Vendor: {purchaseOrderDemo.vendor}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/20 px-5 py-4 lg:min-w-56 lg:text-right">
              <p className="text-xs text-muted-foreground">
                Purchase Order Value
              </p>

              <p className="mt-1 text-xl font-semibold">
                {formatBdt(purchaseOrderDemo.value)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Tender Number</p>

              <p className="mt-1 text-sm font-medium">
                {purchaseOrderDemo.tenderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Supplier</p>

              <p className="mt-1 text-sm font-medium">
                {purchaseOrderDemo.vendor}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Award Value</p>

              <p className="mt-1 text-sm font-medium">
                {formatBdt(awardDemo.awardValue)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Expected Delivery</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(purchaseOrderDemo.deliveryDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">Award Approved</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  MediSupply Ltd. selected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShoppingCart
                className={`mt-0.5 size-4 ${
                  poStage !== "not_issued"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Purchase Order Issued</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {poStage === "not_issued"
                    ? "Pending"
                    : purchaseOrderDemo.poNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PackageCheck
                className={`mt-0.5 size-4 ${
                  poStage === "accepted"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Vendor Acceptance</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {poStage === "accepted"
                    ? "Accepted by supplier"
                    : "Awaiting supplier"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">Delivery</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Phase 7 delivery workflow
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Order Actions</CardTitle>
        </CardHeader>

        <CardContent>
          {poStage === "not_issued" && (
            <Button
              disabled={!awardApproved}
              onClick={() => setIssueOpen(true)}
            >
              Issue Purchase Order
            </Button>
          )}

          {poStage === "issued" && (
            <Button onClick={() => setAcceptOpen(true)}>
              Record Vendor Acceptance
            </Button>
          )}

          {poStage === "accepted" && (
            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
              <CheckCircle2 className="size-4" />
              Purchase Order Accepted
            </div>
          )}
        </CardContent>
      </Card>

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
