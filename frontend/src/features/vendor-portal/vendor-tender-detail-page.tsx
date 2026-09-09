import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Gavel,
  PackageCheck,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { procurementError, tenderApi } from "@/services/procurement";

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VendorTenderDetailPage() {
  const { id } = useParams();

  const {
    data: tender,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vendor", "tender", id],
    queryFn: ({ signal }) => tenderApi.get(id ?? "", signal),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  if (isPending) {
    return (
      <div className="space-y-5">
        <div className="h-24 animate-pulse rounded-xl border bg-card" />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-xl border bg-card lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-xl border bg-card" />
        </div>
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <Card>
        <CardContent className="py-14 text-center">
          <Gavel className="mx-auto size-8 text-muted-foreground" />

          <h1 className="mt-4 text-base font-semibold">
            Unable to load tender
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {procurementError(error)}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <Link
              to="/vendor/tenders"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Back to Tenders
            </Link>

            <Button onClick={() => void refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canSubmitBid = ["published", "bidding_open"].includes(tender.status);

  return (
    <div className="space-y-6">
      <Link
        to="/vendor/tenders"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "-ml-2",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to Tenders
      </Link>

      <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-primary">
              {tender.tender_number}
            </p>

            <Badge variant="secondary">{formatLabel(tender.status)}</Badge>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {tender.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Bangladesh Specialized Hospital PLC
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Gavel className="size-3.5" />
              {formatLabel(tender.type)}
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Closing {formatDate(tender.closing_date)}
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {tender.bid_count} bids
            </span>

            <span className="flex items-center gap-1.5">
              <PackageCheck className="size-3.5" />
              {formatLabel(tender.category)}
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-lg border bg-muted/30 p-4 lg:w-64">
          <p className="text-xs font-medium text-muted-foreground">
            Bid Submission
          </p>

          {canSubmitBid ? (
            <>
              <p className="mt-2 text-sm font-medium">
                This tender is accepting supplier bids.
              </p>

              <Link
                to={`/vendor/bids/submit/${tender.id}`}
                className={buttonVariants({
                  className: "mt-4 w-full",
                })}
              >
                Submit Bid
              </Link>

              <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
                Complete technical, financial, and supporting document sections
                before final submission.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm font-medium">
                Bid submission is currently unavailable.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Current tender status: {formatLabel(tender.status)}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scope of Supply</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {tender.scope || "Tender scope information is not available."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">BOQ / Required Items</CardTitle>

              <p className="text-xs text-muted-foreground">
                Review the requested items and specifications before preparing
                your bid.
              </p>
            </CardHeader>

            <CardContent>
              {tender.boq.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No BOQ items have been added.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="pb-3 font-medium">Item</th>
                        <th className="pb-3 font-medium">Specification</th>
                        <th className="pb-3 text-right font-medium">
                          Quantity
                        </th>
                        <th className="pb-3 text-right font-medium">
                          Reference Cost
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tender.boq.map((item, index) => (
                        <tr
                          key={`${item.name}-${index}`}
                          className="border-b last:border-0"
                        >
                          <td className="py-4 font-medium">{item.name}</td>

                          <td className="max-w-xs py-4 text-muted-foreground">
                            {item.specification}
                          </td>

                          <td className="py-4 text-right">
                            {item.quantity} {item.unit}
                          </td>

                          <td className="py-4 text-right">
                            {formatBdt(item.unit_cost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendor Eligibility</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {tender.eligibility ||
                  "Standard hospital vendor eligibility requirements apply."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Documents</CardTitle>
            </CardHeader>

            <CardContent>
              {tender.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No additional documents specified.
                </p>
              ) : (
                <div className="space-y-3">
                  {tender.documents.map((document) => (
                    <div
                      key={document}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <FileText className="mt-0.5 size-4 shrink-0 text-primary" />

                      <div>
                        <p className="text-sm font-medium">{document}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Required with bid submission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supplier Checklist</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                "Review tender scope and BOQ",
                "Confirm vendor eligibility",
                "Prepare supporting documents",
                "Complete technical and financial bid",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />

                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
