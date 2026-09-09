import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarClock,
  FileCheck2,
  Gavel,
  Layers3,
  RadioTower,
  UsersRound,
} from "lucide-react";

import { tenderApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Choice,
  CreateLink,
  Filters,
  QueryState,
} from "@/features/procurement/procurement-ui";
import {
  date,
  label,
  tenderStatuses,
  tenderTypes,
} from "@/features/procurement/procurement-options";

export function TenderListPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all_statuses");
  const [category, setCategory] = useState("all_categories");
  const [type, setType] = useState("all_types");

  const query = useQuery({
    queryKey: ["tenders"],
    queryFn: ({ signal }) => tenderApi.list(signal),
  });

  const allRows = query.data ?? [];

  const rows = allRows.filter(
    (tender) =>
      `${tender.title} ${tender.tender_number}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "all_statuses" || tender.status === status) &&
      (category === "all_categories" || tender.category === category) &&
      (type === "all_types" || tender.type === type),
  );

  const activeCount = allRows.filter((tender) =>
    ["published", "bidding_open"].includes(tender.status),
  ).length;

  const approvalCount = allRows.filter((tender) =>
    ["pending_approval", "approved"].includes(tender.status),
  ).length;

  const totalBids = allRows.reduce(
    (sum, tender) => sum + Number(tender.bid_count ?? 0),
    0,
  );

  return (
    <div className="min-w-0 space-y-7">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_22px_65px_rgba(15,23,42,0.16)] sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-24 left-[30%] size-72 rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75 backdrop-blur">
              <Gavel className="size-3.5 text-cyan-200" />
              SOURCING MANAGEMENT
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Tenders
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Source hospital equipment, supplies and services through
              controlled tender workflows, specifications, approvals and
              supplier participation.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                BOQ & Specifications
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                Tender Governance
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                Online Bidding
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="[&_a]:!border-white/15 [&_a]:!bg-white/10 [&_a]:!text-white [&_a]:backdrop-blur [&_a:hover]:!bg-white/15">
              <CreateLink to="/admin/tenders/new">Create tender</CreateLink>
            </div>
          )}
        </div>
      </section>

      {/* KPI */}
      {!query.isPending && !query.isError && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="relative isolate overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-indigo-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Gavel className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-indigo-500">
                REGISTER
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {allRows.length}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Total tenders
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-cyan-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                <RadioTower className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-cyan-700">
                LIVE
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {activeCount}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Active sourcing events
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-violet-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <FileCheck2 className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-violet-600">
                GOVERNANCE
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {approvalCount}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Approval pipeline
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-emerald-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <UsersRound className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-emerald-600">
                BIDDING
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {totalBids}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Recorded bids
            </p>
          </article>
        </section>
      )}

      {/* Filters */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="mb-4">
          <p className="text-[9px] font-semibold tracking-[0.16em] text-indigo-600">
            SEARCH & FILTER
          </p>

          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Find sourcing events
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Search by tender reference and narrow the register by status,
            category or tender type.
          </p>
        </div>

        <Filters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          statuses={tenderStatuses}
          category={category}
          onCategory={setCategory}
        />

        <div className="mt-3 max-w-64">
          <Choice
            title="Filter by tender type"
            value={type}
            onChange={setType}
            options={["all_types", ...tenderTypes]}
          />
        </div>
      </section>

      {query.isPending || query.isError ? (
        <QueryState
          pending={query.isPending}
          error={query.error}
          retry={() => void query.refetch()}
        />
      ) : !rows.length ? (
        <EmptyState
          title="No tenders found"
          description="Create a tender, convert an approved requisition, or adjust your filters."
        />
      ) : (
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          <header className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
                <Layers3 className="size-5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                  SOURCING REGISTER
                </p>

                <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                  Tender Records
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  {rows.length} tender
                  {rows.length === 1 ? "" : "s"} shown · Dhaka time
                </p>
              </div>
            </div>

            <div className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-medium text-violet-700">
              {rows.length} results
            </div>
          </header>

          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto rounded-[18px] border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-gradient-to-r from-slate-50 via-violet-50/30 to-cyan-50/30 hover:bg-transparent">
                    <TableHead className="h-12 min-w-64 pl-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      TENDER
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      CATEGORY
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      TYPE
                    </TableHead>

                    <TableHead className="h-12 min-w-36 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      CLOSING DATE
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      BIDS
                    </TableHead>

                    <TableHead className="h-12 pr-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((tender, index) => (
                    <TableRow
                      key={tender.id}
                      className="group border-slate-100 transition hover:bg-gradient-to-r hover:from-violet-50/35 hover:via-white hover:to-cyan-50/30"
                    >
                      <TableCell className="min-w-64 whitespace-normal py-4 pl-4">
                        <div className="flex items-start gap-3">
                          <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-[10px] font-semibold text-violet-600 sm:flex">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div>
                            <Link
                              to={`/admin/tenders/${tender.id}`}
                              className="group/link inline-flex items-start gap-1.5 text-[13px] font-semibold text-slate-900 transition hover:text-indigo-600"
                            >
                              {tender.title}

                              <ArrowUpRight className="mt-0.5 size-3.5 text-slate-300 group-hover/link:text-indigo-500" />
                            </Link>

                            <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                              {tender.tender_number}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1.5 text-[10px] font-medium text-cyan-700">
                          {label(tender.category)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[10px] font-medium text-violet-700">
                          {label(tender.type)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <CalendarClock className="size-3.5" />
                          </div>

                          {date(tender.closing_date)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700">
                          <UsersRound className="size-3.5" />
                          {tender.bid_count}
                        </div>
                      </TableCell>

                      <TableCell className="pr-4">
                        <StatusBadge status={tender.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
