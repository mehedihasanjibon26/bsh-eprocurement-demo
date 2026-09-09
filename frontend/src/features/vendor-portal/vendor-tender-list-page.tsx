import { Badge, Card, CardContent, KpiCard, VendorHero } from "./vendor-portal-ui";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Gavel, RefreshCw, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tenderApi } from "@/services/procurement";

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

export function VendorTenderListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const {
    data: tenders = [],
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["vendor", "browse-tenders"],
    queryFn: ({ signal }) => tenderApi.list(signal),
    staleTime: 60_000,
  });

  const openTenders = useMemo(
    () =>
      tenders.filter((tender) =>
        ["published", "bidding_open"].includes(tender.status),
      ),
    [tenders],
  );

  const categories = useMemo(
    () => Array.from(new Set(openTenders.map((tender) => tender.category))),
    [openTenders],
  );

  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return openTenders.filter((tender) => {
      const matchesSearch =
        query.length === 0 ||
        tender.title.toLowerCase().includes(query) ||
        tender.tender_number.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || tender.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, openTenders, search]);

  return (
    <div className="vendor-portal space-y-6">
      <VendorHero icon={Gavel}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
              PROCUREMENT OPPORTUNITIES
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse Tenders
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              View current sourcing opportunities published by Bangladesh
              Specialized Hospital PLC.
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
      </VendorHero>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Open opportunities" value={isPending || isError ? "—" : String(openTenders.length)} description="Published and open for bidding" icon={<Gavel />} />
        <KpiCard title="Procurement categories" value={isPending || isError ? "—" : String(categories.length)} description="Across the available tenders" icon={<Users />} />
        <KpiCard title="Matching your search" value={isPending || isError ? "—" : String(filteredTenders.length)} description="Based on your current filters" icon={<Search />} />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                aria-label="Search tenders"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by tender title or number"
                className="pl-9"
              />
            </div>

            <select
              aria-label="Filter by procurement category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="all">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {isPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm font-medium">
              Unable to load tender opportunities.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Check the connection and try again.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => void refetch()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredTenders.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <Gavel className="mx-auto size-8 text-muted-foreground" />

            <h2 className="mt-4 text-sm font-semibold">
              No matching tenders found
            </h2>

            <p className="mt-2 text-xs text-muted-foreground">
              Try changing your search or procurement category.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTenders.map((tender) => (
            <Card key={tender.id} className="vendor-tender-card">
              <CardContent className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-primary">
                      {tender.tender_number}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold leading-snug">
                      {tender.title}
                    </h2>
                  </div>

                  <Badge variant="secondary">
                    {formatLabel(tender.status)}
                  </Badge>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Gavel className="size-3.5" />
                    {formatLabel(tender.type)}
                  </span>

                  <span className="vendor-deadline">
                    <CalendarDays className="size-3.5" />
                    Closes {formatDate(tender.closing_date)}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {tender.bid_count} bids
                  </span>
                </div>

                <div className="mt-5">
                  <Badge variant="outline">
                    {formatLabel(tender.category)}
                  </Badge>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100 pt-5">
                  <p className="text-xs text-muted-foreground">
                    Review requirements before submitting your bid.
                  </p>

                  <Link
                    to={`/vendor/tenders/${tender.id}`}
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    View Tender
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
