import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Gavel,
  Tag,
  UsersRound,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminDashboard } from "@/types/dashboard";

import { formatDate, formatLabel } from "./dashboard-format";

export function DashboardTenders({
  tenders,
}: {
  tenders: AdminDashboard["tenders"];
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100/90 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-600 shadow-sm">
            <Gavel className="size-5" aria-hidden="true" />
          </div>

          <div>
            <p className="text-[9px] font-semibold tracking-[0.18em] text-violet-600">
              SOURCING PIPELINE
            </p>

            <h3 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
              Active / Recent Tenders
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Active tenders first, followed by the latest procurement activity.
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-medium text-indigo-700">
          <span className="size-1.5 rounded-full bg-indigo-500" />
          {tenders.length} records
        </div>
      </header>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {tenders.length === 0 ? (
          <EmptyState
            title="No tenders available"
            description="Active and recent hospital tenders will appear here when records are available."
          />
        ) : (
          <div className="overflow-hidden rounded-[18px] border border-slate-100">
            <Table aria-label="Active and recent hospital tenders">
              <TableHeader>
                <TableRow className="border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-cyan-50/30 hover:bg-transparent">
                  <TableHead className="h-12 pl-4 text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    TENDER
                  </TableHead>

                  <TableHead className="h-12 text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    CATEGORY
                  </TableHead>

                  <TableHead className="h-12 text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    CLOSING
                  </TableHead>

                  <TableHead className="h-12 text-right text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    BIDS
                  </TableHead>

                  <TableHead className="h-12 pr-4 text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    STATUS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tenders.map((tender, index) => (
                  <TableRow
                    key={tender.id}
                    className="group border-slate-100 bg-white transition-colors hover:bg-gradient-to-r hover:from-indigo-50/40 hover:via-white hover:to-cyan-50/30"
                  >
                    <TableCell className="min-w-60 max-w-96 whitespace-normal py-4 pl-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 sm:flex">
                          <span className="text-[10px] font-semibold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <Link
                            className="group/link inline-flex items-start gap-1.5 text-[13px] font-semibold leading-5 text-slate-900 transition hover:text-indigo-600"
                            to={`/admin/tenders/${tender.id}`}
                          >
                            <span>{tender.title}</span>

                            <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-slate-300 transition group-hover/link:text-indigo-500" />
                          </Link>

                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Gavel className="size-3" />

                            <span className="font-medium text-slate-500">
                              {tender.tender_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="inline-flex max-w-40 items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50/70 px-2.5 py-1.5 text-[10px] font-medium text-cyan-700">
                        <Tag className="size-3 shrink-0" />

                        <span className="truncate">
                          {formatLabel(tender.category)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex max-w-40 items-start gap-2 text-[10px] text-slate-500">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <CalendarDays className="size-3.5" />
                        </div>

                        <span className="pt-1 leading-4">
                          {tender.closing_date ? (
                            <time dateTime={tender.closing_date}>
                              {formatDate(tender.closing_date, true)}
                            </time>
                          ) : (
                            "Not scheduled"
                          )}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <div className="ml-auto inline-flex min-w-12 items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
                        <UsersRound className="size-3.5 text-indigo-500" />

                        <span className="tabular-nums">{tender.bid_count}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 pr-4">
                      <StatusBadge status={tender.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {tenders.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] text-slate-400">
            <span>Up to 8 active and recent tenders shown</span>

            <Link
              to="/admin/tenders"
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 transition hover:text-violet-600"
            >
              View all tenders
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
