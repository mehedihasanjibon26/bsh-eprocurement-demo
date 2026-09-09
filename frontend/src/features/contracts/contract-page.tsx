import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  FileSignature,
  ShieldCheck,
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
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          CONTRACT MANAGEMENT
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Contract
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review and activate the supplier agreement linked to the approved
          purchase order.
        </p>
      </div>

      {!poAccepted && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">Vendor acceptance required</p>

            <p className="mt-1 text-sm text-muted-foreground">
              The purchase order must be accepted before this contract can be
              activated.
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
                  {contractDemo.contractNumber}
                </p>

                <Badge
                  variant={contractStage === "active" ? "secondary" : "outline"}
                >
                  {contractStage === "active" ? "Active" : "Draft"}
                </Badge>
              </div>

              <h2 className="mt-2 text-lg font-semibold">
                ICU Equipment Supply 2026
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Supplier: {contractDemo.vendor}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/20 px-5 py-4 lg:min-w-56 lg:text-right">
              <p className="text-xs text-muted-foreground">Contract Value</p>

              <p className="mt-1 text-xl font-semibold">
                {formatBdt(contractDemo.value)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Contract Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Tender</p>

              <p className="mt-1 text-sm font-medium">
                {contractDemo.tenderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Purchase Order</p>

              <p className="mt-1 text-sm font-medium">
                {contractDemo.poNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(contractDemo.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">End Date</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(contractDemo.endDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contract Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">Award Approved</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  MediSupply Ltd.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">PO Accepted</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {purchaseOrderDemo.poNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileSignature
                className={`mt-0.5 size-4 ${
                  contractStage === "active"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Contract Activation</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {contractStage === "active"
                    ? "Contract is active"
                    : "Pending activation"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">Delivery</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Next stage in Phase 7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contract Action</CardTitle>
        </CardHeader>

        <CardContent>
          {contractStage === "draft" ? (
            <Button
              disabled={!poAccepted}
              onClick={() => setActivateOpen(true)}
            >
              <ShieldCheck className="size-4" />
              Activate Contract
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
              <CheckCircle2 className="size-4" />
              Contract Active
            </div>
          )}
        </CardContent>
      </Card>

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
