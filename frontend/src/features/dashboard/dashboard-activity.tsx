import { Activity, ClipboardList, Gavel, ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import type { AdminDashboard } from "@/types/dashboard";

import { formatDate } from "./dashboard-format";

const activityConfig = {
  requisition: {
    icon: ClipboardList,
    label: "Requisition",
    iconClass:
      "bg-gradient-to-br from-indigo-500/20 to-blue-400/10 text-indigo-600",
    glowClass: "bg-indigo-400/15",
    dotClass: "bg-indigo-500",
  },

  tender: {
    icon: Gavel,
    label: "Tender",
    iconClass:
      "bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 text-violet-600",
    glowClass: "bg-violet-400/15",
    dotClass: "bg-violet-500",
  },

  vendor: {
    icon: ShieldCheck,
    label: "Supplier",
    iconClass:
      "bg-gradient-to-br from-cyan-500/20 to-emerald-400/10 text-cyan-700",
    glowClass: "bg-cyan-400/15",
    dotClass: "bg-cyan-500",
  },
} as const;

export function RecentActivity({
  activity,
}: {
  activity: AdminDashboard["recent_activity"];
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      {/* decorative atmosphere */}
      <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

      {/* header */}
      <header className="flex flex-col gap-4 border-b border-slate-100/90 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 text-indigo-600 shadow-sm">
            <Activity className="size-5" aria-hidden="true" />
          </div>

          <div>
            <p className="text-[9px] font-semibold tracking-[0.18em] text-indigo-600">
              LIVE PROCUREMENT FEED
            </p>

            <h3 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
              Recent Procurement Activity
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Latest requisition, tender and supplier updates • Dhaka time
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-medium text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
          Live activity
        </div>
      </header>

      <div className="px-5 py-5 sm:px-6">
        {activity.length === 0 ? (
          <EmptyState
            title="No recent procurement activity"
            description="Updates to requisitions, vendors, and tenders will appear here."
          />
        ) : (
          <ul className="relative space-y-3">
            {/* vertical timeline */}
            <div
              className="pointer-events-none absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-cyan-200"
              aria-hidden="true"
            />

            {activity.map((item) => {
              const config = activityConfig[item.kind];

              const Icon = config.icon;

              return (
                <li key={item.id} className="group relative flex gap-4">
                  {/* icon */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-2xl ${config.glowClass} blur-lg`}
                    />

                    <div
                      className={`relative flex size-[42px] items-center justify-center rounded-[14px] border border-white/90 shadow-sm ${config.iconClass}`}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </div>
                  </div>

                  {/* activity card */}
                  <div className="min-w-0 flex-1 rounded-[18px] border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 px-4 py-3.5 transition duration-300 group-hover:-translate-y-0.5 group-hover:border-indigo-100 group-hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-200/80 bg-white px-2 py-1 text-[9px] font-semibold tracking-[0.12em] text-slate-500">
                            {config.label.toUpperCase()}
                          </span>

                          <span
                            className={`size-1.5 rounded-full ${config.dotClass}`}
                            aria-hidden="true"
                          />
                        </div>

                        <p className="text-[13px] font-semibold leading-5 text-slate-900">
                          {item.title}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                          <span className="font-medium text-slate-600">
                            {item.reference}
                          </span>

                          <span className="text-slate-300" aria-hidden="true">
                            •
                          </span>

                          <span>
                            {item.updated_at ? (
                              <time dateTime={item.updated_at}>
                                {formatDate(item.updated_at, true)}
                              </time>
                            ) : (
                              "Update time unavailable"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
