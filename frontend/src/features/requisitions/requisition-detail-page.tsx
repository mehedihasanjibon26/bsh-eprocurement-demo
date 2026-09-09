import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gavel,
  History,
  Layers3,
  Pencil,
  Send,
  UserRound,
  WalletCards,
} from "lucide-react";

import { requisitionApi, procurementError } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ActionDialog,
  ActionHistory,
  Choice,
  Field,
  ItemSummary,
  QueryState,
} from "@/features/procurement/procurement-ui";
import {
  bdt,
  closingIso,
  date,
  label,
  tenderTypes,
} from "@/features/procurement/procurement-options";

function SummaryCard({
  icon: Icon,
  eyebrow,
  title,
  value,
  accent,
}: {
  icon: typeof WalletCards;
  eyebrow: string;
  title: string;
  value: string;
  accent: "indigo" | "cyan" | "violet";
}) {
  const styles = {
    indigo: {
      wrapper:
        "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60",
      icon: "bg-gradient-to-br from-indigo-500/20 to-blue-400/10 text-indigo-600",
      eyebrow: "text-indigo-600",
      glow: "bg-indigo-400/15",
    },

    cyan: {
      wrapper:
        "border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-emerald-50/60",
      icon: "bg-gradient-to-br from-cyan-500/20 to-emerald-400/10 text-cyan-700",
      eyebrow: "text-cyan-700",
      glow: "bg-cyan-400/15",
    },

    violet: {
      wrapper:
        "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50",
      icon: "bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 text-violet-600",
      eyebrow: "text-violet-600",
      glow: "bg-violet-400/15",
    },
  };

  const style = styles[accent];

  return (
    <article
      className={`relative isolate overflow-hidden rounded-[20px] border p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ${style.wrapper}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-10 -z-10 size-28 rounded-full ${style.glow} blur-2xl`}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex size-10 items-center justify-center rounded-xl border border-white/80 shadow-sm ${style.icon}`}
        >
          <Icon className="size-5" />
        </div>

        <span
          className={`text-[9px] font-semibold tracking-[0.15em] ${style.eyebrow}`}
        >
          {eyebrow}
        </span>
      </div>

      <p className="mt-4 text-[11px] font-medium text-slate-500">{title}</p>

      <p className="mt-1 break-words text-lg font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>
    </article>
  );
}

function PremiumSection({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "indigo",
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon: typeof FileText;
  accent?: "indigo" | "cyan" | "violet" | "emerald";
  children: React.ReactNode;
}) {
  const styles = {
    indigo: {
      line: "from-indigo-500 via-violet-500 to-cyan-400",
      icon: "from-indigo-500/20 to-blue-400/10 text-indigo-600",
      eyebrow: "text-indigo-600",
      glow: "bg-indigo-400/10",
    },

    cyan: {
      line: "from-cyan-500 via-teal-500 to-emerald-400",
      icon: "from-cyan-500/20 to-emerald-400/10 text-cyan-700",
      eyebrow: "text-cyan-700",
      glow: "bg-cyan-400/10",
    },

    violet: {
      line: "from-violet-500 via-purple-500 to-fuchsia-400",
      icon: "from-violet-500/20 to-fuchsia-400/10 text-violet-600",
      eyebrow: "text-violet-600",
      glow: "bg-violet-400/10",
    },

    emerald: {
      line: "from-emerald-500 via-teal-500 to-cyan-400",
      icon: "from-emerald-500/20 to-teal-400/10 text-emerald-700",
      eyebrow: "text-emerald-700",
      glow: "bg-emerald-400/10",
    },
  };

  const style = styles[accent];

  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div
        className={`pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full ${style.glow} blur-3xl`}
      />

      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${style.line}`}
      />

      <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-gradient-to-br shadow-sm ${style.icon}`}
        >
          <Icon className="size-5" />
        </div>

        <div>
          <p
            className={`text-[9px] font-semibold tracking-[0.18em] ${style.eyebrow}`}
          >
            {eyebrow}
          </p>

          <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.015em] text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </header>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function RequisitionDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const cache = useQueryClient();
  const navigate = useNavigate();

  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState("");
  const [type, setType] = useState("public_tender");

  const query = useQuery({
    queryKey: ["requisitions", id],
    queryFn: ({ signal }) => requisitionApi.get(id, signal),
  });

  const action = useMutation({
    mutationFn: ({ name, note }: { name: string; note: string }) =>
      requisitionApi.action(Number(id), name, note),

    onSuccess: async () => {
      await Promise.all([
        cache.invalidateQueries({
          queryKey: ["requisitions"],
        }),
        cache.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      toast.success("Requisition updated.");
    },
  });

  if (query.isPending || query.isError) {
    return (
      <QueryState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
    );
  }

  const record = query.data;

  const admin = user?.role === "admin";

  const canReview = admin || user?.role === "approver";

  const act = (name: string) => async (note: string) => {
    await action.mutateAsync({
      name,
      note,
    });
  };

  const approvalHistory =
    record.history?.filter((entry) =>
      ["submit", "approve", "reject", "request_revision"].includes(
        entry.action,
      ),
    ) ?? [];

  return (
    <div className="min-w-0 space-y-7">
      {/* back navigation */}
      <Link
        to="/admin/requisitions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-3.5" />
        Back to requisitions
      </Link>

      {/* Premium detail hero */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75 backdrop-blur">
                <ClipboardList className="size-3.5 text-cyan-200" />
                REQUISITION DETAIL
              </span>

              <StatusBadge status={record.status} />
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {record.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList className="size-3.5 text-cyan-200" />
                {record.requisition_number}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-3.5 text-violet-200" />
                {record.department}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5 text-emerald-200" />
                {record.requester}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {admin &&
              ["draft", "revision_required"].includes(record.status) && (
                <>
                  <Button
                    nativeButton={false}
                    render={<Link to={`/admin/requisitions/${id}/edit`} />}
                    className="h-10 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  >
                    <Pencil className="size-4" />
                    Edit requisition
                  </Button>

                  <ActionDialog
                    title="Submit for approval"
                    description="Send this request to the hospital approval queue."
                    pending={action.isPending}
                    onConfirm={act("submit")}
                  />
                </>
              )}

            {canReview && record.status === "pending_approval" && (
              <>
                <ActionDialog
                  title="Approve"
                  description="Approve this hospital requisition for procurement."
                  pending={action.isPending}
                  onConfirm={act("approve")}
                />

                <ActionDialog
                  title="Request revision"
                  description="Return the request with clear revision instructions."
                  needsNote
                  pending={action.isPending}
                  onConfirm={act("request_revision")}
                />

                <ActionDialog
                  title="Reject"
                  description="Reject this requisition and record the reason."
                  needsNote
                  destructive
                  pending={action.isPending}
                  onConfirm={act("reject")}
                />
              </>
            )}

            {record.tender_id && (
              <Button
                nativeButton={false}
                render={<Link to={`/admin/tenders/${record.tender_id}`} />}
                className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white"
              >
                <Gavel className="size-4" />
                Open linked tender
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={WalletCards}
          eyebrow="VALUE"
          title="Estimated budget"
          value={bdt(record.estimated_budget)}
          accent="indigo"
        />

        <SummaryCard
          icon={CalendarDays}
          eyebrow="TIMELINE"
          title="Required date"
          value={date(record.required_date)}
          accent="violet"
        />

        <SummaryCard
          icon={UserRound}
          eyebrow="REQUESTER"
          title="Requested by"
          value={record.requester}
          accent="cyan"
        />
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-5">
        <div className="overflow-x-auto rounded-[18px] border border-white/90 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <TabsList className="h-auto min-w-max gap-1 bg-transparent p-0">
            {[
              {
                value: "overview",
                icon: FileText,
              },
              {
                value: "items",
                icon: Layers3,
              },
              {
                value: "approval_history",
                icon: FileCheck2,
              },
              {
                value: "activity",
                icon: History,
              },
            ].map(({ value, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 rounded-xl px-4 py-2.5 text-[11px] font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-violet-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(99,102,241,0.18)]"
              >
                <Icon className="size-3.5" />
                {label(value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <PremiumSection
            eyebrow="PROCUREMENT SCOPE"
            title="Clinical Need & Procurement Scope"
            description="Core requirement information submitted by the requesting department."
            icon={FileText}
            accent="indigo"
          >
            <div className="space-y-5">
              <div className="rounded-[18px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-5">
                <p className="whitespace-pre-wrap text-[13px] leading-7 text-slate-600">
                  {record.description || "No description recorded."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[16px] border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-[9px] font-semibold tracking-[0.14em] text-violet-600">
                    PROCUREMENT CATEGORY
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {label(record.category)}
                  </p>
                </div>

                <div className="rounded-[16px] border border-cyan-100 bg-cyan-50/60 p-4">
                  <p className="text-[9px] font-semibold tracking-[0.14em] text-cyan-700">
                    DEPARTMENT
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {record.department}
                  </p>
                </div>
              </div>

              <div className="rounded-[18px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50/60 to-cyan-50 px-5 py-4">
                <p className="mb-3 text-[9px] font-semibold tracking-[0.15em] text-indigo-600">
                  APPROVAL ROUTE
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Department Request",
                    "Hospital Approver",
                    "Procurement",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="rounded-full border border-white bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm">
                        {step}
                      </span>

                      {index < 2 && (
                        <ArrowRight className="size-3.5 text-indigo-400" />
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-[10px] leading-4 text-slate-500">
                  This demonstration uses a single hospital approval step.
                </p>
              </div>
            </div>
          </PremiumSection>
        </TabsContent>

        <TabsContent value="items" className="mt-0">
          <PremiumSection
            eyebrow="REQUESTED ITEMS"
            title="Item & Specification Summary"
            description="Requested quantities, specifications and estimated values."
            icon={Layers3}
            accent="cyan"
          >
            <ItemSummary items={record.items} />
          </PremiumSection>
        </TabsContent>

        <TabsContent value="approval_history" className="mt-0">
          <PremiumSection
            eyebrow="APPROVAL GOVERNANCE"
            title="Approval History"
            description="Recorded approval, revision and rejection decisions for this requisition."
            icon={CheckCircle2}
            accent="emerald"
          >
            <ActionHistory entries={approvalHistory} />
          </PremiumSection>
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <PremiumSection
            eyebrow="AUDIT ACTIVITY"
            title="Requisition Activity"
            description="Complete requisition activity recorded in this demo workspace."
            icon={History}
            accent="violet"
          >
            <ActionHistory entries={record.history} />
          </PremiumSection>
        </TabsContent>
      </Tabs>

      {/* Conversion */}
      {admin && record.status === "approved" && (
        <PremiumSection
          eyebrow="SOURCE FROM REQUEST"
          title="Convert Approved Requisition to Tender / RFQ"
          description="Carry the approved requirement into a sourcing event without re-entering the item specifications."
          icon={Gavel}
          accent="violet"
        >
          <div className="mb-5 rounded-[18px] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Send className="size-4" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-900">
                  Ready for sourcing
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Item specifications and quantities will carry forward into the
                  tender BOQ. Review eligibility and timeline before publishing.
                </p>
              </div>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();

              const form = new FormData(event.currentTarget);

              setConverting(true);
              setConversionError("");

              try {
                const tender = await requisitionApi.convert(record.id, {
                  title: String(form.get("title")),
                  type,
                  closing_date: closingIso(String(form.get("closing_date"))),
                });

                await Promise.all([
                  cache.invalidateQueries({
                    queryKey: ["requisitions"],
                  }),
                  cache.invalidateQueries({
                    queryKey: ["tenders"],
                  }),
                  cache.invalidateQueries({
                    queryKey: ["dashboard"],
                  }),
                ]);

                toast.success("Tender created from approved requisition.");

                navigate(`/admin/tenders/${tender.id}`);
              } catch (failure) {
                setConversionError(procurementError(failure));
              } finally {
                setConverting(false);
              }
            }}
          >
            <fieldset
              disabled={converting}
              className="grid gap-4 sm:grid-cols-3"
            >
              <Field title="Tender title">
                <Input
                  name="title"
                  required
                  maxLength={200}
                  defaultValue={
                    record.requisition_number === "PR-001"
                      ? "ICU Equipment Supply 2026"
                      : record.title
                  }
                  className="h-11 rounded-xl border-slate-200 bg-white transition hover:border-indigo-300 focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100/70"
                />
              </Field>

              <Field title="Tender type">
                <Choice
                  title="Tender type"
                  value={type}
                  onChange={setType}
                  options={tenderTypes}
                />
              </Field>

              <Field title="Closing date / time (Dhaka)">
                <Input
                  name="closing_date"
                  required
                  type="datetime-local"
                  className="h-11 rounded-xl border-slate-200 bg-white transition hover:border-violet-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-100/70"
                />
              </Field>
            </fieldset>

            {conversionError && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                {conversionError}
              </p>
            )}

            <Button
              type="submit"
              disabled={converting}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_28px_rgba(99,102,241,0.18)]"
            >
              <Gavel className="size-4" />

              {converting ? "Converting..." : "Convert to tender"}
            </Button>
          </form>
        </PremiumSection>
      )}
    </div>
  );
}
