import { CheckCircle2, FileSignature, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { vendorContractsDemo } from "./vendor-demo-data";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VendorContractsPosPage() {
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
          Track awarded procurement, purchase orders, and supplier contract
          status with Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <div className="grid gap-4">
        {vendorContractsDemo.map((contract) => (
          <Card key={contract.id}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-primary">
                      {contract.reference}
                    </p>

                    <Badge variant="outline">{contract.status}</Badge>
                  </div>

                  <h2 className="mt-2 text-base font-semibold sm:text-lg">
                    {contract.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ShoppingCart className="size-3.5" />
                      Purchase Order
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FileSignature className="size-3.5" />
                      Contract ID: {contract.id}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:min-w-52 lg:text-right">
                  <p className="text-xs text-muted-foreground">
                    Contract Value
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatBdt(contract.value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Acceptance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />

            <div>
              <p className="text-sm font-medium">
                Purchase order acceptance will be available here
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Vendor acceptance, contract activation, and related procurement
                actions will be connected in the award and contract workflow.
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This page currently shows the client-facing demo view only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
