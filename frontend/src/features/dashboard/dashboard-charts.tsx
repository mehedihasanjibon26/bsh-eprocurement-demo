import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CircleDollarSign,
  PieChartIcon,
  TrendingUp,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import type { AdminDashboard } from "@/types/dashboard";
import type { TenderStatus } from "@/types/procurement";

import { formatBdt, formatLabel } from "./dashboard-format";

const statusColors: Record<TenderStatus, string> = {
  draft: "#94a3b8",
  pending_approval: "#f59e0b",
  approved: "#10b981",
  published: "#06b6d4",
  bidding_open: "#3b82f6",
  closed: "#64748b",
  evaluation: "#8b5cf6",
  awarded: "#ec4899",
  cancelled: "#ef4444",
};

const categoryColors = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid rgba(226,232,240,0.9)",
  boxShadow: "0 14px 40px rgba(15,23,42,0.12)",
  fontSize: 12,
  backgroundColor: "rgba(255,255,255,0.97)",
};

function PremiumChartCard({
  icon,
  eyebrow,
  title,
  description,
  accent,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: "indigo" | "cyan" | "violet";
  children: ReactNode;
}) {
  const accentStyles = {
    indigo: {
      icon: "from-indigo-500/20 to-blue-400/10 text-indigo-600",
      line: "from-indigo-500 via-violet-500 to-cyan-400",
      glow: "bg-indigo-400/15",
      eyebrow: "text-indigo-600",
    },

    cyan: {
      icon: "from-cyan-500/20 to-emerald-400/10 text-cyan-700",
      line: "from-cyan-500 via-teal-500 to-emerald-400",
      glow: "bg-cyan-400/15",
      eyebrow: "text-cyan-700",
    },

    violet: {
      icon: "from-violet-500/20 to-fuchsia-400/10 text-violet-600",
      line: "from-violet-500 via-purple-500 to-pink-400",
      glow: "bg-violet-400/15",
      eyebrow: "text-violet-600",
    },
  };

  const style = accentStyles[accent];

  return (
    <section className="group relative isolate h-full min-w-0 overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]">
      <div
        className={`pointer-events-none absolute -right-16 -top-20 -z-10 size-52 rounded-full ${style.glow} blur-3xl`}
      />

      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${style.line}`}
      />

      <header className="flex flex-col gap-4 border-b border-slate-100/90 px-5 pb-5 pt-6 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br shadow-sm ${style.icon}`}
          >
            {icon}
          </div>

          <div>
            <p
              className={`text-[9px] font-semibold tracking-[0.18em] ${style.eyebrow}`}
            >
              {eyebrow}
            </p>

            <h3 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-[9px] font-medium text-slate-500 sm:flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Demo analytics
        </div>
      </header>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function ProcurementTrend({ demo }: { demo: AdminDashboard["demo"] }) {
  return (
    <PremiumChartCard
      icon={<TrendingUp className="size-5" />}
      eyebrow="PROCUREMENT MOVEMENT"
      title="Procurement Activity Trend"
      description={`${demo.period} • Illustrative procurement history`}
      accent="indigo"
    >
      {demo.activity_trend.length === 0 ? (
        <EmptyState title="No activity trend available" />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-700">
              <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              Requisitions
            </div>

            <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-[11px] font-medium text-cyan-700">
              <span className="size-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              Tenders
            </div>

            <div className="ml-auto hidden items-center gap-2 text-[10px] text-slate-400 sm:flex">
              <Activity className="size-3.5" />
              Monthly activity
            </div>
          </div>

          <p className="sr-only">
            Monthly sample counts:{" "}
            {demo.activity_trend
              .map(
                (row) =>
                  `${row.month}: ${row.requisitions} requisitions, ${row.tenders} tenders`,
              )
              .join("; ")}
            .
          </p>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={demo.activity_trend}
                margin={{
                  top: 12,
                  right: 12,
                  bottom: 0,
                  left: -18,
                }}
                accessibilityLayer
              >
                <defs>
                  <linearGradient
                    id="requisitionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.02}
                    />
                  </linearGradient>

                  <linearGradient
                    id="tenderGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.22} />

                    <stop
                      offset="100%"
                      stopColor="#06b6d4"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#eef2f7"
                  strokeDasharray="4 6"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  dy={10}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  name="Requisitions"
                  type="monotone"
                  dataKey="requisitions"
                  stroke="#6366f1"
                  fill="url(#requisitionGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#6366f1",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                  isAnimationActive={false}
                />

                <Area
                  name="Tenders"
                  type="monotone"
                  dataKey="tenders"
                  stroke="#06b6d4"
                  fill="url(#tenderGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#06b6d4",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </PremiumChartCard>
  );
}

export function SpendByCategory({ demo }: { demo: AdminDashboard["demo"] }) {
  const total = demo.spend_by_category.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <PremiumChartCard
      icon={<CircleDollarSign className="size-5" />}
      eyebrow="CATEGORY DISTRIBUTION"
      title="Spend by Category"
      description={`${demo.period} • Procurement spend in BDT`}
      accent="cyan"
    >
      {demo.spend_by_category.length === 0 ? (
        <EmptyState title="No spend data available" />
      ) : (
        <>
          <div className="mb-5 rounded-2xl border border-cyan-100/80 bg-gradient-to-r from-cyan-50 via-white to-emerald-50 px-4 py-3">
            <p className="text-[9px] font-semibold tracking-[0.14em] text-cyan-700">
              SAMPLE PROCUREMENT VALUE
            </p>

            <p className="mt-1 text-xl font-semibold tracking-[-0.025em] text-slate-900">
              {formatBdt(total)}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Across {demo.spend_by_category.length} procurement categories
            </p>
          </div>

          <p className="sr-only">
            {demo.spend_by_category
              .map((row) => `${row.category}: ${formatBdt(row.amount)}`)
              .join("; ")}
            .
          </p>

          <div className="h-[275px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demo.spend_by_category}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 12,
                  left: 4,
                  bottom: 0,
                }}
                accessibilityLayer
              >
                <CartesianGrid
                  stroke="#eef2f7"
                  strokeDasharray="4 5"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#94a3b8",
                  }}
                  tickFormatter={(value: number) => `${value / 1000000}m`}
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={110}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#64748b",
                  }}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    formatBdt(Number(value)),
                    "Sample spend",
                  ]}
                  cursor={{
                    fill: "rgba(6,182,212,0.04)",
                  }}
                />

                <Bar
                  dataKey="amount"
                  radius={[0, 8, 8, 0]}
                  barSize={18}
                  isAnimationActive={false}
                >
                  {demo.spend_by_category.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={categoryColors[index % categoryColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </PremiumChartCard>
  );
}

export function TenderStatusChart({
  data,
}: {
  data: AdminDashboard["tender_status"];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <PremiumChartCard
      icon={<PieChartIcon className="size-5" />}
      eyebrow="TENDER PIPELINE"
      title="Tender Status"
      description={`${total} total tenders • Current records`}
      accent="violet"
    >
      {total === 0 ? (
        <EmptyState
          title="No tender statuses yet"
          description="Tender status distribution will appear when records are available."
        />
      ) : (
        <div className="flex h-full flex-col">
          <div className="relative h-[235px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="66%"
                  outerRadius="91%"
                  paddingAngle={4}
                  cornerRadius={5}
                  stroke="transparent"
                  isAnimationActive={false}
                >
                  {data.map((item) => (
                    <Cell key={item.status} fill={statusColors[item.status]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    value,
                    formatLabel(String(name)),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              aria-hidden="true"
            >
              <div className="flex size-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 shadow-inner">
                <span className="text-[32px] font-semibold leading-none tracking-[-0.04em] text-slate-900">
                  {total}
                </span>

                <span className="mt-1 text-[9px] font-semibold tracking-[0.12em] text-violet-600">
                  TENDERS
                </span>
              </div>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item) => (
              <li
                key={item.status}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[10px]"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full shadow-sm"
                  style={{
                    backgroundColor: statusColors[item.status],
                  }}
                />

                <span className="min-w-0 truncate text-slate-500">
                  {formatLabel(item.status)}
                </span>

                <strong className="ml-auto text-slate-800">{item.count}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PremiumChartCard>
  );
}
