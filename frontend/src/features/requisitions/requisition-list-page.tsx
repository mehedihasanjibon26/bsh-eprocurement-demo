import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  Layers3,
  WalletCards,
} from "lucide-react";

import { requisitionApi } from "@/services/procurement";
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
  CreateLink,
  Filters,
  QueryState,
} from "@/features/procurement/procurement-ui";
import {
  bdt,
  date,
  label,
  requisitionStatuses,
} from "@/features/procurement/procurement-options";

export function RequisitionListPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all_statuses");
  const [category, setCategory] = useState("all_categories");

  const query = useQuery({
    queryKey: ["requisitions"],
    queryFn: ({ signal }) => requisitionApi.list(signal),
  });

  const allRows = query.data ?? [];

  const rows = allRows.filter(
    (r) =>
      `${r.requisition_number} ${r.title} ${r.department} ${r.requester}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "all_statuses" || r.status === status) &&
      (category === "all_categories" || r.category === category),
  );

  const pendingCount = allRows.filter(
    (r) => r.status === "pending_approval",
  ).length;

  const approvedCount = allRows.filter(
    (r) => r.status === "approved" || r.status === "converted",
  ).length;

  const totalBudget = allRows.reduce(
    (sum, item) => sum + Number(item.estimated_budget ?? 0),
    0,
  );

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#172554] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_22px_65px_rgba(15,23,42,0.16)] sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-24 left-[30%] size-72 rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75 backdrop-blur">
              <ClipboardList className="size-3.5 text-cyan-200" />
              PROCUREMENT REQUESTS
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Requisitions
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Plan hospital demand, review procurement requests, manage
              approvals and move approved requirements into sourcing.
            </p>
          </div>

          {user?.role === "admin" && (
            <div className="[&_a]:!border-white/15 [&_a]:!bg-white/10 [&_a]:!text-white [&_a]:backdrop-blur [&_a:hover]:!bg-white/15">
              <CreateLink to="/admin/requisitions/new">
                Create requisition
              </CreateLink>
            </div>
          )}
        </div>
      </section>

      {!query.isPending && !query.isError && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative overflow-hidden rounded-[20px] border border-indigo-100/80 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute right-[-30px] top-[-35px] size-28 rounded-full bg-indigo-400/15 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <ClipboardList className="size-5" />
                </div>

                <span className="text-[9px] font-semibold tracking-[0.15em] text-indigo-500">
                  TOTAL
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                {allRows.length}
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Requisitions
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-amber-100/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute right-[-30px] top-[-35px] size-28 rounded-full bg-amber-400/15 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Layers3 className="size-5" />
                </div>

                <span className="text-[9px] font-semibold tracking-[0.15em] text-amber-600">
                  PENDING
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                {pendingCount}
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Awaiting approval
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute right-[-30px] top-[-35px] size-28 rounded-full bg-emerald-400/15 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FileCheck2 className="size-5" />
                </div>

                <span className="text-[9px] font-semibold tracking-[0.15em] text-emerald-600">
                  APPROVED
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                {approvedCount}
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Approved / converted
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-violet-100/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="absolute right-[-30px] top-[-35px] size-28 rounded-full bg-violet-400/15 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <WalletCards className="size-5" />
                </div>

                <span className="text-[9px] font-semibold tracking-[0.15em] text-violet-600">
                  VALUE
                </span>
              </div>

              <p className="mt-4 truncate text-xl font-semibold tracking-[-0.025em] text-slate-900">
                {bdt(totalBudget)}
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Estimated demand value
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="mb-4">
          <p className="text-[9px] font-semibold tracking-[0.16em] text-indigo-600">
            SEARCH & FILTER
          </p>

          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Find procurement requests
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Search by requisition, department or requester and narrow results by
            status or category.
          </p>
        </div>

        <Filters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          statuses={requisitionStatuses}
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
          title="No requisitions found"
          description="Create a hospital requisition or adjust your filters."
        />
      ) : (
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

          <header className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-100 to-cyan-50 text-indigo-600">
                <ClipboardList className="size-5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
                  PROCUREMENT REGISTER
                </p>

                <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
                  Requisition Records
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  {rows.length} requisition
                  {rows.length === 1 ? "" : "s"} shown • All amounts in BDT
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-medium text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              {rows.length} results
            </div>
          </header>

          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto rounded-[18px] border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-cyan-50/30 hover:bg-transparent">
                    <TableHead className="h-12 min-w-64 pl-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      REQUISITION
                    </TableHead>

                    <TableHead className="h-12 min-w-48 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      DEPARTMENT / REQUESTER
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      CATEGORY
                    </TableHead>

                    <TableHead className="h-12 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      BUDGET
                    </TableHead>

                    <TableHead className="h-12 min-w-36 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      REQUIRED DATE
                    </TableHead>

                    <TableHead className="h-12 pr-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r, index) => (
                    <TableRow
                      key={r.id}
                      className="group border-slate-100 transition-colors hover:bg-gradient-to-r hover:from-indigo-50/40 hover:via-white hover:to-cyan-50/30"
                    >
                      <TableCell className="min-w-64 whitespace-normal py-4 pl-4">
                        <div className="flex items-start gap-3">
                          <div className="hidden size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 text-[10px] font-semibold text-indigo-600 sm:flex">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0">
                            <Link
                              to={`/admin/requisitions/${r.id}`}
                              className="group/link inline-flex items-start gap-1.5 text-[13px] font-semibold leading-5 text-slate-900 transition hover:text-indigo-600"
                            >
                              <span>{r.title}</span>

                              <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-slate-300 transition group-hover/link:text-indigo-500" />
                            </Link>

                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                              <ClipboardList className="size-3 text-indigo-500" />

                              <span className="font-medium">
                                {r.requisition_number}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-start gap-2">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                            <Building2 className="size-3.5" />
                          </div>

                          <div>
                            <p className="text-[11px] font-medium text-slate-700">
                              {r.department}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {r.requester}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[10px] font-medium text-violet-700">
                          {label(r.category)}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700">
                          <WalletCards className="size-3.5" />
                          {bdt(r.estimated_budget)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <CalendarDays className="size-3.5" />
                          </div>

                          <span>{date(r.required_date)}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 pr-4">
                        <StatusBadge status={r.status} />
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
