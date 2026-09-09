import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  Building2,
  CalendarClock,
  FileCheck2,
  FileText,
  Gavel,
  History,
  Megaphone,
  MessageCircleQuestion,
  ShieldCheck,
  Tags,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { tenderApi, vendorApi } from "@/services/procurement";
import type { ActionEntry } from "@/types/procurement-records";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemSummary, QueryState } from "@/features/procurement/procurement-ui";
import { date, label } from "@/features/procurement/procurement-options";

import { TenderGovernance } from "./tender-governance";

function SummaryCard({
  icon: Icon,
  eyebrow,
  title,
  value,
  accent,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  value: string;
  accent: "indigo" | "cyan" | "violet" | "emerald";
}) {
  const styles = {
    indigo:
      "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 text-indigo-600",
    cyan: "border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 text-cyan-700",
    violet:
      "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 text-violet-600",
    emerald:
      "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 text-emerald-700",
  };

  return (
    <article
      className={`rounded-[20px] border p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ${styles[accent]}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl border border-white/80 bg-white/70">
          <Icon className="size-5" />
        </div>

        <span className="text-[9px] font-semibold tracking-[0.14em] opacity-80">
          {eyebrow}
        </span>
      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500">{title}</p>

      <p className="mt-1 break-words text-[15px] font-semibold text-slate-900">
        {value}
      </p>
    </article>
  );
}

function DetailSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

      <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-100 via-violet-50 to-cyan-50 text-indigo-600">
          <Icon className="size-5" />
        </div>

        <div>
          <p className="text-[9px] font-semibold tracking-[0.18em] text-indigo-600">
            {eyebrow}
          </p>

          <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
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

function HistoryTimeline({
  entries,
  emptyTitle,
}: {
  entries: ActionEntry[] | null | undefined;
  emptyTitle: string;
}) {
  if (!entries?.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <ol className="relative space-y-3">
      <div className="pointer-events-none absolute bottom-5 left-[17px] top-5 w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-cyan-200" />

      {entries.toReversed().map((entry, index) => (
        <li key={`${entry.at}-${index}`} className="relative flex gap-3">
          <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
            <Activity className="size-3.5" />
          </div>

          <div className="min-w-0 flex-1 rounded-[14px] border border-slate-100 bg-gradient-to-br from-white to-indigo-50/25 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-[11px] font-semibold text-slate-900">
                {label(entry.action)}
              </p>

              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[8px] font-semibold text-indigo-600">
                {label(entry.status)}
              </span>
            </div>

            <p className="mt-1.5 text-[9px] text-slate-400">
              {date(entry.at)} · {entry.actor}
            </p>

            {entry.note && (
              <p className="mt-2 whitespace-pre-wrap text-[10px] leading-5 text-slate-500">
                {entry.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function TenderDetailPage() {
  const { id = "" } = useParams();

  const query = useQuery({
    queryKey: ["tenders", id],
    queryFn: ({ signal }) => tenderApi.get(id, signal),
  });

  const vendors = useQuery({
    queryKey: ["vendors"],
    queryFn: ({ signal }) => vendorApi.list(signal),
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

  const tender = query.data;

  const selectedVendors = vendors.data?.filter((vendor) =>
    tender.type === "public_tender"
      ? vendor.status === "approved"
      : (tender.invited_vendor_ids ?? []).includes(vendor.id),
  );

  const closingTime = tender.closing_date
    ? new Date(tender.closing_date).toLocaleTimeString("en-GB", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      icon: FileText,
    },
    {
      value: "boq",
      label: "BOQ",
      icon: Boxes,
    },
    {
      value: "vendors",
      label: "Vendors",
      icon: Building2,
    },
    {
      value: "documents",
      label: "Documents",
      icon: FileCheck2,
    },
    {
      value: "clarifications",
      label: "Clarifications",
      icon: MessageCircleQuestion,
    },
    {
      value: "addenda",
      label: "Addenda",
      icon: Megaphone,
    },
    {
      value: "bids",
      label: "Bids",
      icon: UsersRound,
    },
    {
      value: "evaluation",
      label: "Evaluation",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-w-0 space-y-7">
      <Link
        to="/admin/tenders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-3.5" />
        Back to tenders
      </Link>

      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/75">
            <Gavel className="size-3.5 text-cyan-200" />
            TENDER DETAIL
          </span>

          <StatusBadge status={tender.status} />
        </div>

        <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {tender.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/55">
          <span>{tender.tender_number}</span>

          <span>{label(tender.category)}</span>

          <span>{label(tender.type)}</span>
        </div>
      </section>

      <TenderGovernance tender={tender} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Gavel}
          eyebrow="METHOD"
          title="Tender type"
          value={label(tender.type)}
          accent="indigo"
        />

        <SummaryCard
          icon={Tags}
          eyebrow="CATEGORY"
          title="Procurement category"
          value={label(tender.category)}
          accent="violet"
        />

        <SummaryCard
          icon={CalendarClock}
          eyebrow="DEADLINE"
          title="Closing deadline"
          value={`${date(tender.closing_date)} ${closingTime}`}
          accent="cyan"
        />

        <SummaryCard
          icon={UsersRound}
          eyebrow="BIDDING"
          title="Recorded bids"
          value={String(tender.bid_count)}
          accent="emerald"
        />
      </section>

      <Tabs defaultValue="overview" className="space-y-5">
        <div className="overflow-x-auto rounded-[18px] border border-white/90 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <TabsList className="h-auto min-w-max gap-1 bg-transparent p-0">
            {tabs.map(({ value, label: tabLabel, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 rounded-xl px-4 py-2.5 text-[10px] font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-violet-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                <Icon className="size-3.5" />
                {tabLabel}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-5 xl:grid-cols-3">
            <div className="space-y-5 xl:col-span-2">
              <DetailSection
                icon={FileText}
                eyebrow="SCOPE"
                title="Scope of Supply / Service"
                description="Tender scope and sourcing requirement."
              >
                <p className="whitespace-pre-wrap text-[13px] leading-7 text-slate-600">
                  {tender.scope ||
                    "Complete the scope before submitting this tender for approval."}
                </p>

                <div className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50/50 p-4">
                  <p className="text-[9px] font-semibold tracking-[0.12em] text-indigo-600">
                    SOURCE
                  </p>

                  <p className="mt-2 text-[11px] text-slate-600">
                    {tender.requisition_id ? (
                      <Link
                        to={`/admin/requisitions/${tender.requisition_id}`}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-violet-600"
                      >
                        Open linked requisition
                        <ArrowUpRight className="size-3" />
                      </Link>
                    ) : (
                      "Independent tender"
                    )}
                  </p>
                </div>
              </DetailSection>

              <DetailSection
                icon={ShieldCheck}
                eyebrow="ELIGIBILITY"
                title="Eligibility Requirements"
                description="Supplier qualification and participation requirements."
              >
                <p className="whitespace-pre-wrap text-[13px] leading-7 text-slate-600">
                  {tender.eligibility ||
                    "Complete supplier eligibility in Edit tender before submission."}
                </p>

                <div className="mt-4 inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">
                  {tender.type === "invited_tender"
                    ? "Approved invited vendors only"
                    : "Eligibility reviewed by hospital procurement"}
                </div>
              </DetailSection>
            </div>

            <DetailSection
              icon={History}
              eyebrow="GOVERNANCE HISTORY"
              title="Publication & Governance"
              description="Lifecycle and tender control activity."
            >
              <div className="mb-4 rounded-[16px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50/60 to-cyan-50 p-4 text-[10px] leading-5 text-slate-600">
                Draft → Pending Approval → Approved → Published
              </div>

              <HistoryTimeline
                entries={tender.history}
                emptyTitle="No governance activity recorded"
              />
            </DetailSection>
          </div>
        </TabsContent>

        <TabsContent value="boq" className="mt-0">
          <DetailSection
            icon={Boxes}
            eyebrow="BILL OF QUANTITIES"
            title="BOQ & Estimated Cost"
            description="Hospital estimates only; these values are not supplier bid prices."
          >
            <ItemSummary items={tender.boq} />
          </DetailSection>
        </TabsContent>

        <TabsContent value="vendors" className="mt-0">
          <DetailSection
            icon={Building2}
            eyebrow="SUPPLIER PARTICIPATION"
            title={
              tender.type === "public_tender"
                ? "Approved Supplier Reference List"
                : "Invited Vendors"
            }
          >
            <p className="mb-4 text-[10px] leading-5 text-slate-500">
              {tender.type === "public_tender"
                ? "Reference list only; no invitation or bid submission is implied."
                : "Selected suppliers for this sourcing exercise. Invitations are represented in the demo; no email is sent."}
            </p>

            {vendors.isPending || vendors.isError ? (
              <QueryState
                pending={vendors.isPending}
                error={vendors.error}
                retry={() => void vendors.refetch()}
              />
            ) : !selectedVendors?.length ? (
              <EmptyState
                title="No vendors listed"
                description="Select approved vendors while editing an invited tender."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedVendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    to={`/admin/vendors/${vendor.id}`}
                    className="group rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-cyan-50/30 p-4 transition hover:border-cyan-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                          <Building2 className="size-4" />
                        </div>

                        <p className="text-[12px] font-semibold text-slate-900 group-hover:text-indigo-600">
                          {vendor.name}
                        </p>
                      </div>

                      <StatusBadge status={vendor.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DetailSection>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <DetailSection
            icon={FileCheck2}
            eyebrow="DOCUMENT REGISTER"
            title="Supporting Documents"
          >
            {!tender.documents?.length ? (
              <EmptyState title="No document titles recorded" />
            ) : (
              <div className="space-y-3">
                {tender.documents.map((document, index) => (
                  <div
                    key={`${document}-${index}`}
                    className="flex items-center gap-3 rounded-[16px] border border-slate-100 bg-gradient-to-r from-white to-indigo-50/30 p-4"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText className="size-4" />
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">
                        {document}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        Document register entry · Demo metadata
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-[9px] text-slate-400">
              Original files are not attached in this demo register.
            </p>
          </DetailSection>
        </TabsContent>

        <TabsContent value="clarifications" className="mt-0">
          <DetailSection
            icon={MessageCircleQuestion}
            eyebrow="Q&A"
            title="Clarifications"
          >
            <HistoryTimeline
              entries={tender.clarifications}
              emptyTitle="No clarifications recorded"
            />
          </DetailSection>
        </TabsContent>

        <TabsContent value="addenda" className="mt-0">
          <DetailSection
            icon={Megaphone}
            eyebrow="TENDER UPDATES"
            title="Published Addenda"
          >
            <HistoryTimeline
              entries={tender.addenda}
              emptyTitle="No addenda published"
            />
          </DetailSection>
        </TabsContent>

        <TabsContent value="bids" className="mt-0">
          <DetailSection
            icon={UsersRound}
            eyebrow="ONLINE BIDDING"
            title="Bid Overview"
          >
            <div className="rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 text-center">
              <p className="text-5xl font-semibold tracking-[-0.05em] text-emerald-700">
                {tender.bid_count}
              </p>

              <p className="mt-2 text-[10px] font-semibold tracking-[0.12em] text-emerald-600">
                RECORDED BIDS
              </p>

              <p className="mx-auto mt-3 max-w-lg text-[10px] leading-5 text-slate-500">
                Bid submissions are managed through the vendor bidding workflow.
              </p>
            </div>
          </DetailSection>
        </TabsContent>

        <TabsContent value="evaluation" className="mt-0">
          <DetailSection
            icon={ShieldCheck}
            eyebrow="EVALUATION"
            title="Evaluation Overview"
          >
            <div className="rounded-[18px] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-5">
              <StatusBadge status={tender.status} />

              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                Technical scoring, financial comparison, ranking and award
                recommendations are handled in the evaluation module.
              </p>
            </div>
          </DetailSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
