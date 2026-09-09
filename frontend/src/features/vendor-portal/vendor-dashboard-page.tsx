import { Badge, Card, CardContent, CardHeader, CardTitle, KpiCard, VendorHero } from "./vendor-portal-ui";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarDays,
  FileClock,
  FileText,
  Gavel,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { tenderApi } from "@/services/procurement";

import {
  vendorBidsDemo,
  vendorContractsDemo,
  vendorDashboardDemo,
  vendorDocumentsDemo,
  vendorNotificationsDemo,
  vendorProfileDemo,
} from "./vendor-demo-data";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VendorDashboardPage() {
  const {
    data: tenders = [],
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["vendor", "tenders"],
    queryFn: ({ signal }) => tenderApi.list(signal),
    staleTime: 60_000,
  });

  const openTenders = tenders
    .filter((tender) => ["published", "bidding_open"].includes(tender.status))
    .slice(0, 3);

  return (
    <div className="vendor-portal space-y-6">
      <VendorHero icon={Gavel}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
              SUPPLIER PORTAL
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Vendor Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track tender opportunities, bid activity, documents, and procurement
              updates with Bangladesh Specialized Hospital PLC.
            </p>
          </div>

          <Button
            variant="outline"
            className="bg-card"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw className="size-4" />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <div className="vendor-identity">
          <strong>{vendorProfileDemo.name}</strong>
          <span>{vendorProfileDemo.vendorId}</span>
          <Badge>{vendorProfileDemo.status}</Badge>
          <span className="sm:ml-auto">{vendorProfileDemo.category}</span>
        </div>
      </VendorHero>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">Your procurement snapshot</h2>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">Demo account metrics</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Eligible Tenders"
          value={String(vendorDashboardDemo.eligibleTenders)}
          description="Available procurement opportunities"
          icon={<Gavel className="size-4 text-primary" />}
        />

        <KpiCard
          title="Active Bids"
          value={String(vendorDashboardDemo.activeBids)}
          description="Submitted or under evaluation"
          icon={<FileText className="size-4 text-primary" />}
        />

        <KpiCard
          title="Awarded Contracts"
          value={String(vendorDashboardDemo.awardedContracts)}
          description="Current hospital procurement awards"
          icon={<Award className="size-4 text-primary" />}
        />

        <KpiCard
          title="Pending Documents"
          value={String(vendorDashboardDemo.pendingDocuments)}
          description="Requires supplier attention"
          icon={<FileClock className="size-4 text-amber-600" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Open Tenders</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Current opportunities available through the hospital portal.
              </p>
            </div>

            <Link
              to="/vendor/tenders"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Browse All
              <ArrowRight className="size-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {isPending ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Loading tenders...
              </p>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm font-medium">
                  Unable to load tender opportunities.
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => void refetch()}
                >
                  Try Again
                </Button>
              </div>
            ) : openTenders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No open tenders are currently available.
              </p>
            ) : (
              <div className="space-y-3">
                {openTenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="vendor-row flex flex-col gap-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{tender.title}</p>

                        <Badge variant="secondary">
                          {tender.status.replaceAll("_", " ")}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {tender.tender_number} · {tender.bid_count} bids
                      </p>
                      <span className="vendor-deadline mt-3">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        Closes {new Date(tender.closing_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <Link
                      to={`/vendor/tenders/${tender.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      View Tender
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attention Required</CardTitle>

            <p className="text-xs text-muted-foreground">
              Supplier items that may need action.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {vendorDocumentsDemo
              .filter((document) => document.status !== "Verified")
              .map((document) => (
                <div
                  key={document.id}
                  className="vendor-row flex gap-3"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-sm font-medium">{document.name}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {document.status}
                      {document.expiryDate
                        ? ` · Expires ${document.expiryDate}`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}

            <Link
              to="/vendor/documents"
              className={buttonVariants({
                variant: "outline",
                className: "w-full",
              })}
            >
              View Documents
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Bid Activity</CardTitle>
            <p className="text-xs text-muted-foreground">Sample account activity · Open My Bids for saved responses.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {vendorBidsDemo.map((bid) => (
              <div
                key={bid.id}
                className="vendor-row flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{bid.title}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {bid.tenderNumber} · {formatBdt(bid.amount)}
                  </p>
                </div>

                <Badge variant="outline">{bid.status}</Badge>
              </div>
            ))}

            <Link
              to="/vendor/bids"
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
              })}
            >
              View My Bids
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Updates & Notifications</CardTitle>

            <p className="text-xs text-muted-foreground">
              Recent procurement updates for your supplier account.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {vendorNotificationsDemo.map((notification) => (
              <div
                key={notification.id}
                className="vendor-row"
              >
                <p className="text-sm font-medium">{notification.title}</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {vendorContractsDemo.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                Contracts & Purchase Orders
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Current procurement awards associated with your company.
              </p>
            </div>

            <Link
              to="/vendor/contracts-pos"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {vendorContractsDemo.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{contract.title}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {contract.reference} · {formatBdt(contract.value)}
                  </p>
                </div>

                <Badge variant="outline">{contract.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
