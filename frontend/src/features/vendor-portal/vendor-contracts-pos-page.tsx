import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileSignature,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  contractDemo,
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

export function VendorContractsPosPage() {
  const [poStage, setPoStage] = useState<PoStage>(() => {
    const saved = localStorage.getItem("bsh-phase6-po-stage");

    if (saved === "issued" || saved === "accepted") {
      return saved;
    }

    return "not_issued";
  });

  const [acceptOpen, setAcceptOpen] = useState(false);

  const contractActive =
    localStorage.getItem("bsh-phase6-contract-stage") === "active";

  function acceptPurchaseOrder() {
    setPoStage("accepted");
    localStorage.setItem("bsh-phase6-po-stage", "accepted");
    toast.success("Purchase order accepted successfully");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          AWARDS & PROCUREMENT ORDERS
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Contracts & POs
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review awarded procurement, respond to purchase orders, and track
          active contracts with Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">
                  {purchaseOrderDemo.poNumber}
                </p>

                <Badge
                  variant={poStage === "accepted" ? "secondary" : "outline"}
                >
                  {poStage === "not_issued"
                    ? "Not Issued"
                    : poStage === "issued"
                      ? "Awaiting Acceptance"
                      : "Accepted"}
                </Badge>
              </div>

              <h2 className="mt-2 text-base font-semibold sm:text-lg">
                ICU Equipment Supply 2026
              </h2>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="size-3.5" />
                  {purchaseOrderDemo.tenderNumber}
                </span>

                <span>
                  Expected Delivery:{" "}
                  {formatDate(purchaseOrderDemo.deliveryDate)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:min-w-52 lg:text-right">
              <p className="text-xs text-muted-foreground">
                Purchase Order Value
              </p>

              <p className="mt-1 text-lg font-semibold">
                {formatBdt(purchaseOrderDemo.value)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Acceptance</CardTitle>
        </CardHeader>

        <CardContent>
          {poStage === "not_issued" && (
            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  Purchase order has not been issued yet
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  The approved purchase order will appear here when BSH
                  Procurement issues it.
                </p>
              </div>
            </div>
          )}

          {poStage === "issued" && (
            <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShoppingCart className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">
                    Purchase order awaiting your acceptance
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Review {purchaseOrderDemo.poNumber} and confirm supplier
                    acceptance to continue the procurement process.
                  </p>
                </div>
              </div>

              <Button className="shrink-0" onClick={() => setAcceptOpen(true)}>
                Accept Purchase Order
              </Button>
            </div>
          )}

          {poStage === "accepted" && (
            <div className="flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />

              <div>
                <p className="text-sm font-medium text-teal-900">
                  Purchase order accepted
                </p>

                <p className="mt-1 text-xs leading-relaxed text-teal-800">
                  MediSupply Ltd. has accepted {purchaseOrderDemo.poNumber}. The
                  procurement team can now proceed with contract activation.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contract</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <FileSignature className="size-4 text-primary" />

                <p className="text-sm font-semibold">
                  {contractDemo.contractNumber}
                </p>

                <Badge variant={contractActive ? "secondary" : "outline"}>
                  {contractActive ? "Active" : "Pending Activation"}
                </Badge>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                ICU Equipment Supply 2026
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span>Start: {formatDate(contractDemo.startDate)}</span>

                <span>End: {formatDate(contractDemo.endDate)}</span>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground">Contract Value</p>

              <p className="mt-1 text-base font-semibold">
                {formatBdt(contractDemo.value)}
              </p>
            </div>
          </div>

          {contractActive && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />

              <div>
                <p className="text-sm font-medium text-teal-900">
                  Contract is active
                </p>

                <p className="mt-1 text-xs text-teal-800">
                  Delivery and fulfilment activities can now proceed.
                </p>
              </div>
            </div>
          )}

          {!contractActive && poStage === "accepted" && (
            <p className="mt-4 text-xs text-muted-foreground">
              Purchase order acceptance is complete. Contract activation is
              currently pending with BSH Procurement.
            </p>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        title="Accept purchase order?"
        description={`Confirm acceptance of ${purchaseOrderDemo.poNumber} for ${formatBdt(purchaseOrderDemo.value)}?`}
        confirmLabel="Accept PO"
        onConfirm={acceptPurchaseOrder}
      />
    </div>
  );
}
