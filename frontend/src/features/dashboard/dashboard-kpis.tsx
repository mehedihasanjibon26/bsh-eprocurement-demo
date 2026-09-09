import {
  ArrowUpRight,
  ClipboardList,
  FileSearch,
  Gavel,
  ShieldCheck,
} from "lucide-react";

import type { AdminDashboard } from "@/types/dashboard";

const kpiConfig = [
  {
    key: "pending_requisitions",
    title: "Pending Requisitions",
    description: "Awaiting hospital approval",
    icon: ClipboardList,
    eyebrow: "REQUESTS",
    gradient: "from-indigo-500 via-blue-500 to-sky-400",
    glow: "bg-indigo-400/25",
    iconBackground: "from-indigo-500/20 to-blue-400/10",
    iconColor: "text-indigo-600",
    numberColor: "from-indigo-700 to-blue-500",
  },
  {
    key: "active_tenders",
    title: "Active Tenders",
    description: "Published and open for bidding",
    icon: Gavel,
    eyebrow: "SOURCING",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-400",
    glow: "bg-violet-400/20",
    iconBackground: "from-violet-500/20 to-fuchsia-400/10",
    iconColor: "text-violet-600",
    numberColor: "from-violet-700 to-fuchsia-500",
  },
  {
    key: "approved_vendors",
    title: "Approved Vendors",
    description: "Verified supplier records",
    icon: ShieldCheck,
    eyebrow: "SUPPLIERS",
    gradient: "from-cyan-500 via-teal-500 to-emerald-400",
    glow: "bg-cyan-400/20",
    iconBackground: "from-cyan-500/20 to-emerald-400/10",
    iconColor: "text-teal-600",
    numberColor: "from-cyan-700 to-emerald-500",
  },
  {
    key: "under_evaluation",
    title: "Under Evaluation",
    description: "Tenders currently being assessed",
    icon: FileSearch,
    eyebrow: "EVALUATION",
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    glow: "bg-amber-400/20",
    iconBackground: "from-orange-500/20 to-amber-400/10",
    iconColor: "text-orange-600",
    numberColor: "from-orange-700 to-amber-500",
  },
] as const;

export function DashboardKpis({ kpis }: { kpis: AdminDashboard["kpis"] }) {
  return (
    <section
      aria-label="Procurement key performance indicators"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpiConfig.map((item) => {
        const Icon = item.icon;
        const value = kpis[item.key];

        return (
          <article
            key={item.key}
            className="group relative isolate min-h-[176px] overflow-hidden rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]"
          >
            {/* soft glow */}
            <div
              className={`pointer-events-none absolute -right-12 -top-14 -z-10 size-40 rounded-full ${item.glow} blur-3xl transition duration-300 group-hover:scale-110`}
            />

            {/* subtle tinted background */}
            <div
              className={`pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br ${item.gradient} opacity-[0.035]`}
            />

            {/* top accent */}
            <div
              className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${item.gradient}`}
            />

            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex size-11 items-center justify-center rounded-[14px] border border-white/70 bg-gradient-to-br ${item.iconBackground} shadow-sm`}
              >
                <Icon
                  className={`size-5 ${item.iconColor}`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 px-2 py-1 text-[9px] font-semibold tracking-[0.14em] text-slate-400 backdrop-blur">
                {item.eyebrow}
                <ArrowUpRight className="size-3" />
              </div>
            </div>

            <div className="mt-5">
              <p
                className={`bg-gradient-to-r ${item.numberColor} bg-clip-text text-[34px] font-semibold leading-none tracking-[-0.04em] text-transparent`}
              >
                {value}
              </p>

              <h3 className="mt-3 text-[13px] font-semibold text-slate-800">
                {item.title}
              </h3>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                {item.description}
              </p>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] font-medium text-slate-400">
              <span
                className={`size-1.5 rounded-full bg-gradient-to-r ${item.gradient}`}
              />
              Current
            </div>
          </article>
        );
      })}
    </section>
  );
}
