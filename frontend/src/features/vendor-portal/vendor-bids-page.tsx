import { FileText, Gavel } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { vendorBidsDemo } from "./vendor-demo-data";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VendorBidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          BID TRACKING
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          My Bids
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review your submitted and active tender responses for Bangladesh
          Specialized Hospital PLC.
        </p>
      </div>

      <div className="grid gap-4">
        {vendorBidsDemo.map((bid) => (
          <Card key={bid.id}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-primary">
                      {bid.tenderNumber}
                    </p>

                    <Badge variant="outline">{bid.status}</Badge>
                  </div>

                  <h2 className="mt-2 text-base font-semibold sm:text-lg">
                    {bid.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Gavel className="size-3.5" />
                      Bid ID: {bid.id}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3.5" />
                      Submitted {bid.submittedAt}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:text-right">
                  <p className="text-xs text-muted-foreground">Bid Amount</p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatBdt(bid.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bid Submission</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Technical and financial bid preparation and submission will be
            available from the tender bidding workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
