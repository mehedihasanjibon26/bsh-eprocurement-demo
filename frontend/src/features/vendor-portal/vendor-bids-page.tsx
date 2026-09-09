import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tenderApi } from "@/services/procurement";

import { vendorBidsDemo } from "./vendor-demo-data";

type LocalFinancialItem = {
  quantity: number;
  unitPrice: number;
};

type LocalBidDraft = {
  financialItems?: LocalFinancialItem[];
  status?: "Draft" | "Submitted" | "Withdrawn";
  bidId?: string;
  submittedAt?: string;
};

type DisplayBid = {
  id: string;
  tenderId?: number;
  tenderNumber: string;
  title: string;
  amount: number;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Withdrawn" | "Under Evaluation" | "Awarded";
};

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function VendorBidsPage() {
  const { data: tenders = [] } = useQuery({
    queryKey: ["vendor", "my-bids", "tenders"],
    queryFn: ({ signal }) => tenderApi.list(signal),
    staleTime: 60_000,
  });

  const bids = useMemo<DisplayBid[]>(() => {
    const localBids: DisplayBid[] = [];

    tenders.forEach((tender) => {
      const saved = localStorage.getItem(`bsh-demo-bid-${tender.id}`);

      if (!saved) {
        return;
      }

      try {
        const draft = JSON.parse(saved) as LocalBidDraft;

        if (
          draft.status !== "Draft" &&
          draft.status !== "Submitted" &&
          draft.status !== "Withdrawn"
        ) {
          return;
        }

        const amount = (draft.financialItems ?? []).reduce(
          (total, item) =>
            total + Number(item.quantity || 0) * Number(item.unitPrice || 0),
          0,
        );

        localBids.push({
          id: draft.bidId ?? `DRAFT-${String(tender.id).padStart(3, "0")}-MSL`,
          tenderId: tender.id,
          tenderNumber: tender.tender_number,
          title: tender.title,
          amount,
          submittedAt: draft.submittedAt ?? "Draft saved locally",
          status: draft.status,
        });
      } catch {
        localStorage.removeItem(`bsh-demo-bid-${tender.id}`);
      }
    });

    const localTenderNumbers = new Set(
      localBids.map((bid) => bid.tenderNumber),
    );

    const fallbackBids: DisplayBid[] = vendorBidsDemo
      .filter((bid) => !localTenderNumbers.has(bid.tenderNumber))
      .map((bid) => ({
        id: bid.id,
        tenderNumber: bid.tenderNumber,
        title: bid.title,
        amount: bid.amount,
        submittedAt: bid.submittedAt,
        status: bid.status,
      }));

    return [...localBids, ...fallbackBids];
  }, [tenders]);

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
          Review your draft, submitted, and active tender responses for
          Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <div className="grid gap-4">
        {bids.map((bid) => (
          <Card key={`${bid.tenderNumber}-${bid.id}`}>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-primary">
                      {bid.tenderNumber}
                    </p>

                    <Badge
                      variant={
                        bid.status === "Awarded" ? "secondary" : "outline"
                      }
                    >
                      {bid.status}
                    </Badge>
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

                      {bid.status === "Draft"
                        ? "Draft saved locally"
                        : `Submitted ${formatDate(bid.submittedAt)}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="rounded-lg border bg-muted/20 px-4 py-3 lg:min-w-52 lg:text-right">
                    <p className="text-xs text-muted-foreground">Bid Amount</p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatBdt(bid.amount)}
                    </p>
                  </div>

                  {bid.tenderId && (
                    <Link
                      to={`/vendor/bids/submit/${bid.tenderId}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      {bid.status === "Draft" ? "Continue Bid" : "View Bid"}
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bid Tracking</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Bid status is synchronized with the vendor bidding workspace so
            saved drafts, final submissions, and withdrawals remain consistent
            throughout the demo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
