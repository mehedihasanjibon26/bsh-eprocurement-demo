import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Activity,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/use-auth";
import { getAdminDashboard } from "@/services/dashboard";

import { RecentActivity } from "./dashboard-activity";
import { DashboardAlerts } from "./dashboard-alerts";
import {
  ProcurementTrend,
  SpendByCategory,
  TenderStatusChart,
} from "./dashboard-charts";
import { formatDate } from "./dashboard-format";
import { DashboardKpis } from "./dashboard-kpis";
import { DashboardTenders } from "./dashboard-tenders";

function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading procurement dashboard"
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#083344] p-7 shadow-[0_22px_60px_rgba(15,23,42,0.16)] sm:p-9">
        <div className="h-3 w-40 animate-pulse rounded bg-white/15" />
        <div className="mt-5 h-10 w-72 max-w-full animate-pulse rounded-lg bg-white/10" />
        <div className="mt-4 h-4 w-[420px] max-w-full animate-pulse rounded bg-white/10" />
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map((item) => (
          <Card
            key={item}
            className="overflow-hidden border-white/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
          >
            <CardContent className="space-y-4 p-5">
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 max-w-full animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3" aria-hidden="true">
        <div className="h-80 animate-pulse rounded-[24px] border border-white/80 bg-white shadow-sm xl:col-span-2" />
        <div className="h-80 animate-pulse rounded-[24px] border border-white/80 bg-white shadow-sm" />
      </div>
    </div>
  );
}

function PremiumPanel({
  children,
  accent = "indigo",
}: {
  children: React.ReactNode;
  accent?: "indigo" | "cyan" | "violet" | "emerald";
}) {
  const glow =
    accent === "cyan"
      ? "from-cyan-400/18 via-sky-400/8 to-transparent"
      : accent === "violet"
        ? "from-violet-400/18 via-fuchsia-400/8 to-transparent"
        : accent === "emerald"
          ? "from-emerald-400/18 via-teal-400/8 to-transparent"
          : "from-indigo-400/18 via-violet-400/8 to-transparent";

  return (
    <div className="relative min-w-0">
      <div
        className={`pointer-events-none absolute -inset-2 -z-10 rounded-[30px] bg-gradient-to-br ${glow} blur-2xl`}
      />

      <div className="min-w-0 rounded-[24px]">{children}</div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();

  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["dashboard", "internal", user?.role],
    queryFn: ({ signal }) => getAdminDashboard(signal),
    staleTime: 60_000,
    retry: (count, failure) =>
      count < 1 &&
      !(
        axios.isAxiosError(failure) &&
        [401, 403].includes(failure.response?.status ?? 0)
      ),
  });

  const forbidden = axios.isAxiosError(error) && error.response?.status === 403;

  const role = user?.role ?? "admin";

  const dashboardCopy =
    role === "approver"
      ? {
          eyebrow: "PROCUREMENT APPROVALS",
          title: "Approval Dashboard",
          description:
            "Review procurement activity, pending decisions, and sourcing items requiring approval attention.",
          badge: "Approval Workspace",
          gradient: "from-[#172554] via-[#312e81] to-[#0f766e]",
        }
      : role === "evaluator"
        ? {
            eyebrow: "TENDER EVALUATION",
            title: "Evaluation Dashboard",
            description:
              "Monitor tender activity, evaluation priorities, and procurement items ready for assessment.",
            badge: "Evaluation Workspace",
            gradient: "from-[#1e1b4b] via-[#581c87] to-[#155e75]",
          }
        : role === "management_viewer"
          ? {
              eyebrow: "MANAGEMENT PROCUREMENT OVERVIEW",
              title: "Management Dashboard",
              description:
                "A read-only executive view of procurement performance, spend, tender activity, and sourcing progress.",
              badge: "Executive Overview",
              gradient: "from-[#172554] via-[#164e63] to-[#065f46]",
            }
          : {
              eyebrow: "HOSPITAL PROCUREMENT OVERVIEW",
              title: "Admin Dashboard",
              description:
                "A clear view of procurement priorities for Bangladesh Specialized Hospital PLC.",
              badge: "Procurement Command Center",
              gradient: "from-[#111827] via-[#312e81] to-[#0e7490]",
            };

  return (
    <div className="min-w-0 space-y-7">
      {/* PREMIUM HERO */}
      <section
        className={`relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br ${dashboardCopy.gradient} px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10`}
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[28%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute right-[12%] top-[30%] size-40 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/75 backdrop-blur">
                <Sparkles className="size-3.5 text-cyan-200" />
                {dashboardCopy.badge}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1.5 text-[10px] font-medium text-emerald-100">
                <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]" />
                Live demo data
              </span>
            </div>

            <p className="text-[10px] font-semibold tracking-[0.22em] text-cyan-100/65">
              {dashboardCopy.eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-[42px]">
              {dashboardCopy.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58 sm:text-[15px]">
              {dashboardCopy.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 backdrop-blur sm:block">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-white/35">
                WORKSPACE
              </p>

              <p className="mt-1 text-xs font-medium text-white/85">
                Bangladesh Specialized Hospital PLC
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="h-11 rounded-xl border-white/15 bg-white/[0.08] px-4 text-white backdrop-blur hover:bg-white/[0.14] hover:text-white"
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />

              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </section>

      {isPending ? (
        <DashboardLoading />
      ) : !data ? (
        <div role="alert">
          <EmptyState
            title={
              forbidden
                ? "Dashboard access unavailable"
                : "Unable to load the dashboard"
            }
            description={
              forbidden
                ? "This account does not have hospital dashboard access."
                : "We couldn't retrieve procurement data. Check your connection and try again."
            }
            actionLabel={isFetching ? "Retrying..." : "Retry"}
            onAction={() => {
              if (!isFetching) {
                void refetch();
              }
            }}
          />
        </div>
      ) : (
        <>
          {isError && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-sm text-amber-900 shadow-sm"
            >
              <span>
                Refresh failed. Showing the last successfully loaded overview.
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => void refetch()}
                className="rounded-lg bg-white"
              >
                Retry
              </Button>
            </div>
          )}

          {/* STATUS BAR */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-indigo-600">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-medium text-foreground">
                  {role === "management_viewer"
                    ? "Read-only procurement records"
                    : "Current procurement records"}
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Secure internal procurement workspace
                </p>
              </div>
            </div>

            <div
              role="status"
              className="flex items-center gap-2 text-[11px] text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />

              {isFetching
                ? "Updating overview..."
                : `Updated ${formatDate(data.generated_at, true)} • Dhaka`}
            </div>
          </div>

          {/* KPI AREA */}
          <section className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-indigo-600" />

                  <h2 className="text-sm font-semibold">
                    Procurement Snapshot
                  </h2>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Key indicators across the current procurement cycle.
                </p>
              </div>
            </div>

            <PremiumPanel accent="indigo">
              <DashboardKpis kpis={data.kpis} />
            </PremiumPanel>
          </section>

          {role === "admin" && (
            <>
              {/* ANALYTICS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-cyan-600" />

                  <div>
                    <h2 className="text-sm font-semibold">
                      Procurement Analytics
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Spend movement and category distribution.
                    </p>
                  </div>
                </div>

                <div className="grid min-w-0 gap-5 xl:grid-cols-3">
                  <div className="min-w-0 xl:col-span-2">
                    <PremiumPanel accent="cyan">
                      <ProcurementTrend demo={data.demo} />
                    </PremiumPanel>
                  </div>

                  <div className="min-w-0">
                    <PremiumPanel accent="violet">
                      <SpendByCategory demo={data.demo} />
                    </PremiumPanel>
                  </div>
                </div>
              </section>

              {/* OPERATIONS */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold">
                    Procurement Operations
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Recent activity, tender progress and procurement attention
                    items.
                  </p>
                </div>

                <div className="grid min-w-0 items-start gap-5 xl:grid-cols-3">
                  <div className="min-w-0 space-y-5 xl:col-span-2">
                    <PremiumPanel accent="indigo">
                      <RecentActivity activity={data.recent_activity} />
                    </PremiumPanel>

                    <PremiumPanel accent="cyan">
                      <DashboardTenders tenders={data.tenders} />
                    </PremiumPanel>
                  </div>

                  <div className="min-w-0 space-y-5">
                    <PremiumPanel accent="violet">
                      <TenderStatusChart data={data.tender_status} />
                    </PremiumPanel>

                    <PremiumPanel accent="emerald">
                      <DashboardAlerts
                        alerts={data.alerts}
                        demoAlerts={data.demo.alerts}
                      />
                    </PremiumPanel>
                  </div>
                </div>
              </section>
            </>
          )}

          {role === "approver" && (
            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-3">
              <div className="min-w-0 space-y-5 xl:col-span-2">
                <PremiumPanel accent="indigo">
                  <RecentActivity activity={data.recent_activity} />
                </PremiumPanel>

                <PremiumPanel accent="cyan">
                  <DashboardTenders tenders={data.tenders} />
                </PremiumPanel>
              </div>

              <div className="min-w-0 space-y-5">
                <PremiumPanel accent="violet">
                  <TenderStatusChart data={data.tender_status} />
                </PremiumPanel>

                <PremiumPanel accent="emerald">
                  <DashboardAlerts
                    alerts={data.alerts}
                    demoAlerts={data.demo.alerts}
                  />
                </PremiumPanel>
              </div>
            </section>
          )}

          {role === "evaluator" && (
            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-3">
              <div className="min-w-0 space-y-5 xl:col-span-2">
                <PremiumPanel accent="cyan">
                  <DashboardTenders tenders={data.tenders} />
                </PremiumPanel>

                <PremiumPanel accent="indigo">
                  <RecentActivity activity={data.recent_activity} />
                </PremiumPanel>
              </div>

              <div className="min-w-0">
                <PremiumPanel accent="violet">
                  <TenderStatusChart data={data.tender_status} />
                </PremiumPanel>
              </div>
            </section>
          )}

          {role === "management_viewer" && (
            <>
              <section className="grid min-w-0 gap-5 xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                  <PremiumPanel accent="cyan">
                    <ProcurementTrend demo={data.demo} />
                  </PremiumPanel>
                </div>

                <div className="min-w-0">
                  <PremiumPanel accent="violet">
                    <SpendByCategory demo={data.demo} />
                  </PremiumPanel>
                </div>
              </section>

              <section className="grid min-w-0 gap-5 xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                  <PremiumPanel accent="indigo">
                    <RecentActivity activity={data.recent_activity} />
                  </PremiumPanel>
                </div>

                <div className="min-w-0">
                  <PremiumPanel accent="emerald">
                    <TenderStatusChart data={data.tender_status} />
                  </PremiumPanel>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
