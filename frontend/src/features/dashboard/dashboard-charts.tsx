import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/chart-container";
import { EmptyState } from "@/components/empty-state";
import type { AdminDashboard } from "@/types/dashboard";
import type { TenderStatus } from "@/types/procurement";
import { formatBdt, formatLabel } from "./dashboard-format";

const statusColors: Record<TenderStatus, string> = {
  draft: "#94a3b8", pending_approval: "#b7791f", approved: "#047857", published: "#0d9488",
  bidding_open: "#0891b2", closed: "#64748b", evaluation: "#2563eb", awarded: "#126780", cancelled: "#dc2626",
};
const tooltipStyle = { borderRadius: 10, border: "1px solid #dce5ea", fontSize: 12 };

export function ProcurementTrend({ demo }: { demo: AdminDashboard["demo"] }) {
  return <ChartContainer title="Procurement Activity Trend" description={`${demo.period} · Illustrative demo history`}>
    {demo.activity_trend.length === 0 ? <EmptyState title="No activity trend available" /> : <>
      <div className="mb-4 flex gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-600" />Requisitions</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-teal-600" />Tenders</span></div>
      <p className="sr-only">Monthly sample counts: {demo.activity_trend.map((row) => `${row.month}: ${row.requisitions} requisitions, ${row.tenders} tenders`).join("; ")}.</p>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={demo.activity_trend} margin={{ top: 10, right: 12, bottom: 0, left: -25 }} accessibilityLayer>
          <CartesianGrid stroke="#e7eef2" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#627784" }} dy={8} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#627784" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area name="Requisitions" type="monotone" dataKey="requisitions" stroke="#2563eb" fill="#2563eb" fillOpacity={0.07} strokeWidth={2.5} isAnimationActive={false} />
          <Area name="Tenders" type="monotone" dataKey="tenders" stroke="#0d9488" fill="#0d9488" fillOpacity={0.08} strokeWidth={2.5} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </>}
  </ChartContainer>;
}

export function SpendByCategory({ demo }: { demo: AdminDashboard["demo"] }) {
  return <ChartContainer title="Spend by Category" description={`${demo.period} · Demo spend in BDT`}>
    {demo.spend_by_category.length === 0 ? <EmptyState title="No spend data available" /> : <>
      <p className="mb-2 text-xs text-muted-foreground">Sample total <strong className="font-semibold text-foreground">{formatBdt(demo.spend_by_category.reduce((sum, item) => sum + item.amount, 0))}</strong></p>
      <p className="sr-only">{demo.spend_by_category.map((row) => `${row.category}: ${formatBdt(row.amount)}`).join("; ")}.</p>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={demo.spend_by_category} layout="vertical" margin={{ top: 0, right: 18, left: 0, bottom: 0 }} accessibilityLayer>
          <CartesianGrid stroke="#e7eef2" horizontal={false} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#627784" }} tickFormatter={(value: number) => `${value / 1000000}m`} />
          <YAxis type="category" dataKey="category" width={122} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#627784" }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatBdt(Number(value)), "Sample spend"]} cursor={{ fill: "#f0f7f8" }} />
          <Bar dataKey="amount" fill="#168b8a" radius={[0, 4, 4, 0]} barSize={17} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </>}
  </ChartContainer>;
}

export function TenderStatusChart({ data }: { data: AdminDashboard["tender_status"] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return <ChartContainer title="Tender Status" description={`${total} total tenders · Current records`}>
    {total === 0 ? <EmptyState title="No tender statuses yet" description="Tender status distribution will appear when records are available." /> : <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius="65%" outerRadius="90%" paddingAngle={3} isAnimationActive={false}>
              {data.map((item) => <Cell key={item.status} fill={statusColors[item.status]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, formatLabel(String(name))]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true"><span className="text-3xl font-semibold">{total}</span><span className="text-xs text-muted-foreground">Tenders</span></div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {data.map((item) => <li key={item.status} className="flex items-center gap-2"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: statusColors[item.status] }} /><span className="text-muted-foreground">{formatLabel(item.status)}</span><strong className="ml-auto">{item.count}</strong></li>)}
      </ul>
    </div>}
  </ChartContainer>;
}
