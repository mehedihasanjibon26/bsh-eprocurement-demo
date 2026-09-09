import { Clock3, FileText, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { vendorInvoicesDemo } from "./vendor-demo-data";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VendorInvoicesPage() {
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
          Track submitted invoices and payment-related status for your
          procurement orders with Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <div className="grid gap-4">
        {vendorInvoicesDemo.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-primary">
                      {invoice.invoiceNumber}
                    </p>

                    <Badge variant="outline">{invoice.status}</Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <ReceiptText className="size-4 text-muted-foreground" />

                    <h2 className="text-base font-semibold">
                      Invoice for {invoice.reference}
                    </h2>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3.5" />
                      Invoice ID: {invoice.id}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      Submitted {invoice.submittedAt}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:min-w-52 lg:text-right">
                  <p className="text-xs text-muted-foreground">
                    Invoice Amount
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatBdt(invoice.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Processing</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm font-medium">
              Invoice verification status will appear here
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Invoice submission, verification, three-way matching, approval,
              and payment progression will be connected in the later payment
              workflow.
            </p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This page currently provides the client-facing demo view only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
