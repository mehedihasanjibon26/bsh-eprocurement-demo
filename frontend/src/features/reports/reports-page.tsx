import {
  BarChart3,
  Building2,
  CircleDollarSign,
  FileSpreadsheet,
  FileText,
  Gavel,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  categorySpendDemo,
  monthlySpendDemo,
  procurementReportSummary,
  tenderStatusDemo,
  vendorPerformanceDemo,
} from "./phase8-demo-data";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function ReportsPage() {
  function exportPdf() {
    toast.success("PDF report export prepared for demo.");
  }

  function exportExcel() {
    toast.success("Excel report export prepared for demo.");
  }

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-indigo-100">
              <BarChart3 className="size-3.5 text-cyan-200" />
              PROCUREMENT ANALYTICS
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reports</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Monitor procurement value, sourcing activity, vendor performance,
              and payment progress across Bangladesh Specialized Hospital PLC.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-cyan-100">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Management overview</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">BDT reporting currency</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Demo dataset</span>
            </div>
          </div>
          <div className="shrink-0 rounded-[20px] border border-white/15 bg-white/10 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100">Report exports &middot; Demo preview</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-10 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={exportPdf}>
                <FileText className="size-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="h-10 rounded-xl border-white bg-white text-indigo-900 hover:bg-cyan-50 hover:text-indigo-950" onClick={exportExcel}>
                <FileSpreadsheet className="size-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="relative min-w-0 rounded-[22px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:to-violet-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col 2xl:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-indigo-100 bg-indigo-100/70 text-indigo-700">
              <CircleDollarSign className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Procurement Value</p>

              <p className="mt-2 break-words text-xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {formatBdt(procurementReportSummary.totalProcurementValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[22px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-violet-500 before:to-fuchsia-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col 2xl:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-violet-100 bg-violet-100/70 text-violet-700">
              <Gavel className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Active Tenders</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {procurementReportSummary.activeTenders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[22px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-teal-500 before:to-cyan-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col 2xl:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-teal-100 bg-teal-100/70 text-teal-700">
              <Building2 className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Approved Vendors</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {procurementReportSummary.approvedVendors}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-emerald-500 before:to-teal-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col 2xl:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-emerald-100 bg-emerald-100/70 text-emerald-700">
              <WalletCards className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Completed Payments
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {procurementReportSummary.completedPayments}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">Spend intelligence</p>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">
              Monthly Procurement Spend
            </CardTitle>

            <p className="text-xs text-muted-foreground">
              Procurement value by month in BDT.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full min-w-0 rounded-[18px] bg-slate-50/60 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpendDemo} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="report-monthly-spend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <YAxis
                    tickFormatter={formatCompactBdt}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={52}
                  />

                  <Tooltip
                    cursor={{ fill: "#eef2ff", radius: 8 }}
                    contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(15,23,42,0.08)" }}
                    formatter={(value) => [formatBdt(Number(value)), "Spend"]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="url(#report-monthly-spend)"
                    maxBarSize={48}
                    isAnimationActive={false}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><CircleDollarSign className="size-5" /></div>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Category Spend</CardTitle>

            <p className="text-xs text-muted-foreground">
              Procurement value distributed across major purchasing categories.
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {categorySpendDemo.map((item) => {
                const percentage =
                  (item.amount /
                    procurementReportSummary.totalProcurementValue) *
                  100;

                return (
                  <div key={item.category}>
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <p className="text-sm font-medium">{item.category}</p>

                      <p className="text-sm font-semibold">
                        {formatBdt(item.amount)}
                      </p>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-[11px] text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Gavel className="size-5" /></div>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Tender Status</CardTitle>

            <p className="text-xs text-muted-foreground">
              Current sourcing pipeline across tender stages.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {tenderStatusDemo.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-100 bg-slate-50/50 p-4 hover:border-indigo-100 hover:bg-indigo-50/40"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="size-4 text-indigo-600" />

                  <p className="text-sm font-medium">{item.status}</p>
                </div>

                <Badge variant="outline" className="min-w-9 justify-center rounded-lg border-violet-100 bg-violet-50 px-2.5 py-1 text-violet-700 tabular-nums">{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Building2 className="size-5" /></div>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Vendor Performance</CardTitle>

            <p className="text-xs text-muted-foreground">
              Performance overview for approved suppliers.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {vendorPerformanceDemo.map((vendor, index) => (
              <div
                key={vendor.vendor}
                className="flex flex-col gap-3 rounded-[16px] border border-slate-100 bg-gradient-to-r from-white to-teal-50/30 p-4 hover:border-teal-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-sm font-semibold text-indigo-700">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{vendor.vendor}</p>

                    <p className="mt-1 text-xs font-medium text-emerald-700">
                      {vendor.status}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-800">
                  <TrendingUp className="size-4 text-emerald-600" />

                  <span className="text-lg font-semibold">{vendor.score}</span>

                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
        <CardContent className="px-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="size-10 shrink-0 rounded-xl bg-cyan-50 p-2.5 text-cyan-700" />

            <div>
              <p className="text-sm font-medium">Management reporting</p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Procurement reports can be exported to PDF and Excel in the
                production implementation. This interactive demo showcases the
                reporting and export workflow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
