import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BellRing,
  CircleCheck,
  ClipboardList,
  Clock3,
  CreditCard,
  FileClock,
  FileWarning,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import type { DashboardAlert } from "@/types/dashboard";

const alertConfig = {
  approval: {
    icon: ClipboardList,
    label: "Approval",
    card: "border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40",
    iconBox:
      "bg-gradient-to-br from-indigo-500/20 to-blue-400/10 text-indigo-600",
    badge: "border-indigo-100 bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },

  document: {
    icon: FileWarning,
    label: "Document",
    card: "border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40",
    iconBox:
      "bg-gradient-to-br from-amber-500/20 to-orange-400/10 text-amber-700",
    badge: "border-amber-100 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },

  deadline: {
    icon: Clock3,
    label: "Deadline",
    card: "border-rose-100 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/30",
    iconBox:
      "bg-gradient-to-br from-rose-500/20 to-orange-400/10 text-rose-600",
    badge: "border-rose-100 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },

  payment: {
    icon: CreditCard,
    label: "Payment",
    card: "border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40",
    iconBox:
      "bg-gradient-to-br from-emerald-500/20 to-teal-400/10 text-emerald-700",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },

  contract: {
    icon: FileClock,
    label: "Contract",
    card: "border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/30",
    iconBox:
      "bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 text-violet-600",
    badge: "border-violet-100 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
} as const;

function getAlertLink(alert: DashboardAlert) {
  if (alert.source !== "database") {
    return null;
  }

  if (alert.kind === "approval") {
    return "/admin/requisitions";
  }

  if (alert.kind === "document") {
    return `/admin/vendors/${alert.id.replace("vendor-", "")}`;
  }

  return `/admin/tenders/${alert.id.replace("tender-", "")}`;
}

function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <ul className="space-y-3">
      {alerts.map((alert) => {
        const config = alertConfig[alert.kind];

        const Icon = config.icon;

        const link = getAlertLink(alert);

        return (
          <li
            key={alert.id}
            className={`group relative overflow-hidden rounded-[18px] border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.07)] ${config.card}`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-[3px] ${config.dot}`}
            />

            <div className="flex items-start gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-[13px] border border-white/80 shadow-sm ${config.iconBox}`}
              >
                <Icon className="size-[17px]" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold tracking-[0.12em] ${config.badge}`}
                  >
                    <span className={`size-1.5 rounded-full ${config.dot}`} />

                    {config.label.toUpperCase()}
                  </span>
                </div>

                {link ? (
                  <Link
                    to={link}
                    className="text-[12px] font-semibold leading-5 text-slate-900 transition hover:text-indigo-600"
                  >
                    {alert.title}
                  </Link>
                ) : (
                  <p className="text-[12px] font-semibold leading-5 text-slate-900">
                    {alert.title}
                  </p>
                )}

                <p className="mt-1.5 text-[10px] leading-[1.6] text-slate-500">
                  {alert.description}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardAlerts({
  alerts,
  demoAlerts,
}: {
  alerts: DashboardAlert[];
  demoAlerts: DashboardAlert[];
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-amber-400/12 blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

      {/* Header */}
      <header className="border-b border-slate-100/90 px-5 pb-5 pt-6 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br from-amber-500/20 to-rose-400/10 text-amber-700 shadow-sm">
              <BellRing className="size-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.18em] text-amber-700">
                ACTION CENTER
              </p>

              <h3 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
                Attention Required
              </h3>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Approvals, deadlines and supplier documents requiring attention.
              </p>
            </div>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-[12px] font-semibold text-amber-700">
            {alerts.length}
          </div>
        </div>
      </header>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        {alerts.length === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="No current approval, deadline, or document alerts."
            icon={<CircleCheck className="size-6 text-emerald-600" />}
          />
        ) : (
          <AlertList alerts={alerts} />
        )}

        {demoAlerts.length > 0 && (
          <div className="border-t border-slate-100 pt-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-cyan-400/10 text-violet-600">
                  <AlertTriangle className="size-4" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-800">
                    Payment & Contract Alerts
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Illustrative workflow reminders
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] text-violet-700">
                DEMO EXAMPLES
              </span>
            </div>

            <AlertList alerts={demoAlerts} />

            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-[9px] leading-4 text-slate-400">
              These reminders are illustrative demo examples and are not
              connected to live payment or contract processing.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
