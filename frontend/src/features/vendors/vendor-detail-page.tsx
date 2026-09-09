import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  FileWarning,
  History,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Star,
  Tags,
  UserRound,
} from "lucide-react";

import { vendorApi } from "@/services/procurement";
import { useAuth } from "@/features/auth/use-auth";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  ActionDialog,
  QueryState,
} from "@/features/procurement/procurement-ui";
import { date, label } from "@/features/procurement/procurement-options";

function DetailSection({
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
  icon: typeof Building2;
  accent?: "indigo" | "cyan" | "violet" | "emerald" | "amber";
  children: React.ReactNode;
}) {
  const styles = {
    indigo: {
      line: "from-indigo-500 via-violet-500 to-cyan-400",
      icon: "from-indigo-500/20 to-violet-400/10 text-indigo-600",
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

    amber: {
      line: "from-amber-400 via-orange-500 to-rose-400",
      icon: "from-amber-500/20 to-orange-400/10 text-amber-700",
      eyebrow: "text-amber-700",
      glow: "bg-amber-400/10",
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

function InfoCard({
  icon: Icon,
  labelText,
  value,
  accent = "indigo",
}: {
  icon: typeof Building2;
  labelText: string;
  value: string;
  accent?: "indigo" | "cyan" | "violet" | "emerald";
}) {
  const styles = {
    indigo: "border-indigo-100 bg-indigo-50/50 text-indigo-600",
    cyan: "border-cyan-100 bg-cyan-50/50 text-cyan-700",
    violet: "border-violet-100 bg-violet-50/50 text-violet-600",
    emerald: "border-emerald-100 bg-emerald-50/50 text-emerald-700",
  };

  return (
    <div className="rounded-[16px] border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${styles[accent]}`}
        >
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[8px] font-semibold tracking-[0.13em] text-slate-400">
            {labelText}
          </p>

          <p className="mt-1.5 break-words text-[12px] font-semibold leading-5 text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function VendorDetailPage() {
  const { id = "" } = useParams();

  const { user } = useAuth();

  const cache = useQueryClient();

  const query = useQuery({
    queryKey: ["vendors", id],
    queryFn: ({ signal }) => vendorApi.get(id, signal),
  });

  const action = useMutation({
    mutationFn: ({ name, note }: { name: string; note: string }) =>
      vendorApi.action(Number(id), name, note),

    onSuccess: async () => {
      await Promise.all([
        cache.invalidateQueries({
          queryKey: ["vendors"],
        }),
        cache.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      toast.success("Vendor record updated.");
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

  const vendor = query.data;
  const profile = vendor.profile;

  const act = (name: string) => async (note: string) => {
    await action.mutateAsync({
      name,
      note,
    });
  };

  return (
    <div className="min-w-0 space-y-7">
      {/* Back */}
      <Link
        to="/admin/vendors"
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-3.5" />
        Back to vendors
      </Link>

      {/* Hero */}
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
                <Building2 className="size-3.5 text-cyan-200" />
                SUPPLIER PROFILE
              </span>

              <StatusBadge status={vendor.status} />
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {vendor.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Tags className="size-3.5 text-violet-200" />
                {label(vendor.category)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-cyan-200" />
                {profile?.address ?? "Address not recorded"}
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex flex-wrap gap-2">
              {vendor.status !== "blacklisted" && !profile?.verified && (
                <ActionDialog
                  title="Verify compliance (demo)"
                  description="Record a simulated tax and banking check. No external verification service is contacted."
                  pending={action.isPending}
                  onConfirm={act("verify")}
                />
              )}

              {["pending_verification", "suspended"].includes(
                vendor.status,
              ) && (
                <ActionDialog
                  title="Approve vendor"
                  description="Approve this supplier for hospital procurement. Simulated compliance verification must be complete."
                  pending={action.isPending}
                  onConfirm={act("approve")}
                />
              )}

              {vendor.status === "approved" && (
                <ActionDialog
                  title="Suspend vendor"
                  description="Temporarily suspend supplier eligibility and record the reason."
                  needsNote
                  destructive
                  pending={action.isPending}
                  onConfirm={act("suspend")}
                />
              )}

              {vendor.status !== "blacklisted" && (
                <ActionDialog
                  title="Blacklist vendor"
                  description="Restrict this supplier from procurement and record the reason."
                  needsNote
                  destructive
                  pending={action.isPending}
                  onConfirm={act("blacklist")}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Alert */}
      {vendor.document_expiry_alert && (
        <section className="relative overflow-hidden rounded-[18px] border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/50 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <FileWarning className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] text-amber-700">
                DOCUMENT ATTENTION REQUIRED
              </p>

              <p className="mt-1.5 text-[12px] font-semibold text-amber-950">
                Supplier documentation requires review
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-800">
                {vendor.document_expiry_alert}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quick summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={UserRound}
          labelText="CONTACT PERSON"
          value={profile?.contact ?? "Not recorded"}
          accent="indigo"
        />

        <InfoCard
          icon={Star}
          labelText="PERFORMANCE SCORE"
          value={
            vendor.performance_score
              ? `${vendor.performance_score} / 5`
              : "Not rated"
          }
          accent="violet"
        />

        <InfoCard
          icon={FileCheck2}
          labelText="DOCUMENTS ON FILE"
          value={`${profile?.documents.length ?? 0} document(s)`}
          accent="cyan"
        />

        <InfoCard
          icon={ShieldCheck}
          labelText="COMPLIANCE STATUS"
          value={
            profile?.verified ? "Demo checks complete" : "Verification required"
          }
          accent="emerald"
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 xl:col-span-2">
          <DetailSection
            eyebrow="COMPANY PROFILE"
            title="Supplier Information"
            description="Core contact and organizational information recorded for this hospital supplier."
            icon={Building2}
            accent="indigo"
          >
            <div className="mb-5 flex items-start gap-4 rounded-[18px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50/40 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 text-indigo-600">
                <Building2 className="size-6" />
              </div>

              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-slate-900">
                  {vendor.name}
                </p>

                <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-5 text-slate-500">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-cyan-600" />
                  {profile?.address ?? "No address recorded"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard
                icon={UserRound}
                labelText="CONTACT"
                value={profile?.contact ?? "Not recorded"}
                accent="indigo"
              />

              <InfoCard
                icon={Phone}
                labelText="PHONE"
                value={profile?.phone ?? "Not recorded"}
                accent="cyan"
              />

              <InfoCard
                icon={Mail}
                labelText="EMAIL"
                value={profile?.email ?? "Not recorded"}
                accent="violet"
              />
            </div>
          </DetailSection>

          {/* Registration + tax */}
          <div className="grid gap-5 md:grid-cols-2">
            <DetailSection
              eyebrow="LEGAL IDENTITY"
              title="Registration"
              description="Supplier trade registration information."
              icon={ReceiptText}
              accent="violet"
            >
              <div className="rounded-[16px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/40 p-4">
                <p className="text-[9px] font-semibold tracking-[0.13em] text-violet-600">
                  REGISTRATION REFERENCE
                </p>

                <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                  {profile?.registration ?? "Not recorded"}
                </p>

                <p className="mt-2 text-[10px] leading-4 text-slate-500">
                  Sample trade registration reference used for this
                  demonstration.
                </p>
              </div>
            </DetailSection>

            <DetailSection
              eyebrow="TAX COMPLIANCE"
              title="Tax Information"
              description="Tax reference and demo verification state."
              icon={BadgeCheck}
              accent="emerald"
            >
              <div className="rounded-[16px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/40 p-4">
                <p className="text-[9px] font-semibold tracking-[0.13em] text-emerald-700">
                  TAX REFERENCE
                </p>

                <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                  {profile?.tax ?? "Not recorded"}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[9px] font-semibold text-emerald-700">
                  {profile?.verified ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Tax Verified · Simulated
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="size-3.5 text-amber-600" />
                      Tax verification pending
                    </>
                  )}
                </div>
              </div>
            </DetailSection>
          </div>

          {/* Banking */}
          <DetailSection
            eyebrow="FINANCIAL COMPLIANCE"
            title="Banking Information"
            description="Sample supplier banking information retained for procurement verification."
            icon={Banknote}
            accent="cyan"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[16px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-indigo-50/30 p-4">
                <p className="text-[9px] font-semibold tracking-[0.13em] text-cyan-700">
                  BANK
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {profile?.bank ?? "Not recorded"}
                </p>
              </div>

              <div className="rounded-[16px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50/30 p-4">
                <p className="text-[9px] font-semibold tracking-[0.13em] text-indigo-600">
                  ACCOUNT
                </p>

                <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                  {profile?.account ?? "Not recorded"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-slate-100 bg-slate-50/70 p-4">
              {profile?.verified ? (
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              ) : (
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
              )}

              <div>
                <p className="text-[11px] font-semibold text-slate-800">
                  {profile?.verified
                    ? "Banking Verified · Simulated"
                    : "Banking verification pending"}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Sample compliance information for the demonstration. No bank
                  or tax authority connection is used.
                </p>
              </div>
            </div>
          </DetailSection>

          {/* Documents */}
          <DetailSection
            eyebrow="DOCUMENT CONTROL"
            title="Supplier Documents"
            description="Compliance documentation and expiry metadata recorded against this supplier."
            icon={FileCheck2}
            accent="amber"
          >
            {!profile?.documents.length ? (
              <EmptyState title="No documents recorded" />
            ) : (
              <div className="space-y-3">
                {profile.documents.map((doc, index) => (
                  <div
                    key={doc.name}
                    className="group flex flex-col gap-3 rounded-[16px] border border-slate-100 bg-gradient-to-r from-white via-slate-50/50 to-amber-50/25 p-4 transition duration-200 hover:border-amber-200 hover:shadow-[0_8px_24px_rgba(245,158,11,0.06)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <FileCheck2 className="size-4" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-semibold text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <p className="text-[12px] font-semibold text-slate-900">
                            {doc.name}
                          </p>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {doc.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[10px] text-slate-500">
                      <CalendarClock className="size-3.5 text-amber-600" />

                      {doc.expiry
                        ? `Expires ${date(doc.expiry)}`
                        : "No expiry recorded"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-[9px] leading-4 text-slate-400">
              Document register contains sample metadata; no original supplier
              files are attached in this demonstration.
            </p>
          </DetailSection>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <DetailSection
            eyebrow="SUPPLIER RATING"
            title="Performance"
            icon={Star}
            accent="amber"
          >
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600">
                <Star className="size-8 fill-amber-400" />
              </div>

              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900">
                {vendor.performance_score ?? "—"}

                <span className="ml-1 text-sm font-medium text-slate-400">
                  / 5
                </span>
              </p>

              <p className="mt-2 text-[10px] leading-5 text-slate-500">
                {vendor.performance_score
                  ? "Seeded supplier performance score"
                  : "No performance assessment recorded"}
              </p>
            </div>
          </DetailSection>

          <DetailSection
            eyebrow="PROCUREMENT CATEGORY"
            title="Category"
            icon={Tags}
            accent="violet"
          >
            <div className="rounded-[16px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/30 p-4">
              <span className="inline-flex rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[10px] font-semibold text-violet-700">
                {label(vendor.category)}
              </span>
            </div>
          </DetailSection>

          <DetailSection
            eyebrow="ELIGIBILITY CONTROL"
            title="Compliance"
            icon={ShieldCheck}
            accent="emerald"
          >
            <div
              className={`rounded-[16px] border p-4 ${
                profile?.verified
                  ? "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/30"
                  : "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    profile?.verified
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {profile?.verified ? (
                    <ShieldCheck className="size-4" />
                  ) : (
                    <ShieldAlert className="size-4" />
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-900">
                    {profile?.verified
                      ? "Demo checks complete"
                      : "Verification required"}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    Lifecycle approval does not automatically clear supplier
                    document expiry alerts.
                  </p>
                </div>
              </div>
            </div>
          </DetailSection>

          {/* Lifecycle */}
          <DetailSection
            eyebrow="AUDIT TRAIL"
            title="Lifecycle Activity"
            description="Recorded supplier status and compliance actions."
            icon={History}
            accent="indigo"
          >
            {!vendor.history?.length ? (
              <EmptyState
                title="No lifecycle activity"
                description="Supplier lifecycle actions will appear here."
              />
            ) : (
              <ol className="relative space-y-3">
                <div className="pointer-events-none absolute bottom-5 left-[17px] top-5 w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-cyan-200" />

                {vendor.history.toReversed().map((entry, index) => (
                  <li
                    key={`${entry.at}-${index}`}
                    className="relative flex gap-3"
                  >
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

                      <p className="mt-1.5 text-[9px] leading-4 text-slate-400">
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
            )}
          </DetailSection>
        </div>
      </div>
    </div>
  );
}
