import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  FileCheck2,
  FileWarning,
  ShieldCheck,
  Star,
  Store,
  UsersRound,
} from "lucide-react";

import { vendorApi } from "@/services/procurement";
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
import { Filters, QueryState } from "@/features/procurement/procurement-ui";
import {
  label,
  vendorStatuses,
} from "@/features/procurement/procurement-options";

export function VendorListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all_statuses");
  const [category, setCategory] = useState("all_categories");

  const query = useQuery({
    queryKey: ["vendors"],
    queryFn: ({ signal }) => vendorApi.list(signal),
  });

  const allRows = query.data ?? [];

  const rows = allRows.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === "all_statuses" || vendor.status === status) &&
      (category === "all_categories" || vendor.category === category),
  );

  const approvedCount = allRows.filter(
    (vendor) => vendor.status === "approved",
  ).length;

  const attentionCount = allRows.filter((vendor) =>
    Boolean(vendor.document_expiry_alert),
  ).length;

  const ratedVendors = allRows.filter(
    (vendor) =>
      vendor.performance_score !== null &&
      vendor.performance_score !== undefined,
  );

  const averagePerformance =
    ratedVendors.length > 0
      ? (
          ratedVendors.reduce(
            (sum, vendor) => sum + Number(vendor.performance_score),
            0,
          ) / ratedVendors.length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-w-0 space-y-7">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_22px_65px_rgba(15,23,42,0.16)] sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-24 left-[30%] size-72 rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75 backdrop-blur">
            <UsersRound className="size-3.5 text-cyan-200" />
            SUPPLIER MANAGEMENT
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Vendors
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Manage hospital supplier relationships, compliance, procurement
            eligibility, documentation and performance.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              Supplier Compliance
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              Document Control
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
              Vendor Performance
            </span>
          </div>
        </div>
      </section>

      {/* KPI summary */}
      {!query.isPending && !query.isError && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="relative isolate overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-indigo-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Store className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-indigo-500">
                REGISTER
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {allRows.length}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Total suppliers
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-emerald-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-emerald-600">
                ELIGIBLE
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {approvedCount}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Approved vendors
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-amber-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FileWarning className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-amber-600">
                ATTENTION
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {attentionCount}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Document alerts
            </p>
          </article>

          <article className="relative isolate overflow-hidden rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-violet-400/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Star className="size-5" />
              </div>

              <span className="text-[9px] font-semibold tracking-[0.15em] text-violet-600">
                PERFORMANCE
              </span>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              {averagePerformance}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Average score / 5
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
            Find hospital suppliers
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Search the supplier register and narrow results by lifecycle status
            or procurement category.
          </p>
        </div>

        <Filters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          statuses={vendorStatuses}
          category={category}
          onCategory={setCategory}
        />
      </section>

      {query.isPending || query.isError ? (
        <QueryState
          pending={query.isPending}
          error={query.error}
          retry={() => void query.refetch()}
        />
      ) : !rows.length ? (
        <EmptyState
          title="No vendors found"
          description="Adjust your filters to find a hospital supplier."
        />
      ) : (
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

          <header className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-100 to-indigo-50 text-cyan-700">
                <Building2 className="size-5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.17em] text-cyan-700">
                  SUPPLIER REGISTER
                </p>

                <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
                  Vendor Records
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  {rows.length} supplier
                  {rows.length === 1 ? "" : "s"} shown
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-[10px] font-medium text-cyan-700">
              <span className="size-1.5 rounded-full bg-cyan-500" />
              {rows.length} results
            </div>
          </header>

          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto rounded-[18px] border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-gradient-to-r from-slate-50 via-cyan-50/30 to-violet-50/30 hover:bg-transparent">
                    <TableHead className="h-12 min-w-64 pl-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      SUPPLIER
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      CATEGORY
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      STATUS
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      PERFORMANCE
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      DOCUMENTS
                    </TableHead>

                    <TableHead className="h-12 min-w-52 pr-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      ATTENTION REQUIRED
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((vendor, index) => (
                    <TableRow
                      key={vendor.id}
                      className="group border-slate-100 transition-colors hover:bg-gradient-to-r hover:from-cyan-50/35 hover:via-white hover:to-violet-50/30"
                    >
                      <TableCell className="min-w-64 whitespace-normal py-4 pl-4">
                        <div className="flex items-start gap-3">
                          <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-indigo-50 text-[10px] font-semibold text-cyan-700 sm:flex">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0">
                            <Link
                              to={`/admin/vendors/${vendor.id}`}
                              className="group/link inline-flex items-start gap-1.5 text-[13px] font-semibold leading-5 text-slate-900 transition hover:text-indigo-600"
                            >
                              <span>{vendor.name}</span>

                              <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-slate-300 transition group-hover/link:text-indigo-500" />
                            </Link>

                            <p className="mt-1.5 max-w-60 text-[10px] leading-4 text-slate-400">
                              {vendor.profile?.address ?? "Company profile"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[10px] font-medium text-violet-700">
                          {label(vendor.category)}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <StatusBadge status={vendor.status} />
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-2.5 py-1.5">
                          <Star className="size-3.5 fill-amber-400 text-amber-500" />

                          <span className="text-[11px] font-semibold text-amber-700">
                            {vendor.performance_score
                              ? `${vendor.performance_score} / 5`
                              : "Not rated"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-medium text-emerald-700">
                          <FileCheck2 className="size-3.5" />
                          {vendor.profile?.documents.length ?? 0} on file
                        </div>
                      </TableCell>

                      <TableCell className="min-w-52 max-w-72 whitespace-normal py-4 pr-4">
                        {vendor.document_expiry_alert ? (
                          <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/60 p-2.5 text-[10px] leading-4 text-amber-800">
                            <FileWarning className="mt-0.5 size-3.5 shrink-0" />

                            <span>{vendor.document_expiry_alert}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-[10px] text-slate-400">
                            <ShieldCheck className="size-3.5 text-emerald-500" />
                            No document alerts
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {attentionCount > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-amber-100 bg-amber-50/60 px-3 py-2.5 text-[10px] text-amber-700">
                <AlertTriangle className="size-3.5" />
                {attentionCount} supplier record
                {attentionCount === 1 ? "" : "s"} currently require document
                attention.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
