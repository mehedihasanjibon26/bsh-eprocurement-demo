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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
            PROCUREMENT ANALYTICS
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Reports
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor procurement value, sourcing activity, vendor performance,
            and payment progress across Bangladesh Specialized Hospital PLC.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportPdf}>
            <FileText className="size-4" />
            Export PDF
          </Button>

          <Button variant="outline" onClick={exportExcel}>
            <FileSpreadsheet className="size-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <CircleDollarSign className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Procurement Value</p>

              <p className="mt-1 text-lg font-semibold">
                {formatBdt(procurementReportSummary.totalProcurementValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <Gavel className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Active Tenders</p>

              <p className="mt-1 text-xl font-semibold">
                {procurementReportSummary.activeTenders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <Building2 className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Approved Vendors</p>

              <p className="mt-1 text-xl font-semibold">
                {procurementReportSummary.approvedVendors}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <WalletCards className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Completed Payments
              </p>

              <p className="mt-1 text-xl font-semibold">
                {procurementReportSummary.completedPayments}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Monthly Procurement Spend
            </CardTitle>

            <p className="text-xs text-muted-foreground">
              Procurement value by month in BDT.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpendDemo}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

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
                    formatter={(value) => [formatBdt(Number(value)), "Spend"]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="currentColor"
                    className="text-primary"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Spend</CardTitle>

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
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium">{item.category}</p>

                      <p className="text-sm font-semibold">
                        {formatBdt(item.amount)}
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tender Status</CardTitle>

            <p className="text-xs text-muted-foreground">
              Current sourcing pipeline across tender stages.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {tenderStatusDemo.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="size-4 text-primary" />

                  <p className="text-sm font-medium">{item.status}</p>
                </div>

                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendor Performance</CardTitle>

            <p className="text-xs text-muted-foreground">
              Performance overview for approved suppliers.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {vendorPerformanceDemo.map((vendor, index) => (
              <div
                key={vendor.vendor}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/30 text-sm font-semibold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{vendor.vendor}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {vendor.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />

                  <span className="text-lg font-semibold">{vendor.score}</span>

                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-0.5 size-5 shrink-0 text-primary" />

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
