import { useState } from "react";
import {
  Award,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Gavel,
  Medal,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  awardDemo,
  evaluationTenderDemo,
  evaluationVendorsDemo,
} from "./evaluation-demo-data";

type AwardStage = "evaluation" | "recommended" | "approved";

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function EvaluationPage() {
  const [awardStage, setAwardStage] = useState<AwardStage>(() => {
    const saved = localStorage.getItem("bsh-phase6-award-stage");

    if (saved === "recommended" || saved === "approved") {
      return saved;
    }

    return "evaluation";
  });

  const [recommendOpen, setRecommendOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);

  const rankedVendors = [...evaluationVendorsDemo].sort(
    (a, b) => a.rank - b.rank,
  );

  const topVendor = rankedVendors[0];

  const responsiveCount = evaluationVendorsDemo.filter(
    (vendor) => vendor.technicalStatus === "Responsive",
  ).length;

  const lowestBid = Math.min(
    ...evaluationVendorsDemo.map((vendor) => vendor.bidAmount),
  );

  const evaluationStatus =
    awardStage === "approved"
      ? "Award Approved"
      : awardStage === "recommended"
        ? "Award Recommended"
        : "Evaluation in Progress";

  function recommendVendor() {
    setAwardStage("recommended");

    localStorage.setItem("bsh-phase6-award-stage", "recommended");

    toast.success("MediSupply Ltd. recommended for award");
  }

  function approveAward() {
    setAwardStage("approved");

    localStorage.setItem("bsh-phase6-award-stage", "approved");

    toast.success("Award approved successfully");
  }

  return (
    <div className="min-w-0 space-y-7">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-28 size-[320px] rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="absolute -bottom-28 left-[30%] size-[300px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white/75 backdrop-blur">
              <Scale className="size-3.5 text-cyan-200" />
              TENDER EVALUATION
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Comparative Statement
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Technical and financial comparison of qualified supplier bids for{" "}
              {evaluationTenderDemo.title}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {evaluationTenderDemo.tenderNumber}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {evaluationTenderDemo.category}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] font-medium text-white/55">
                {evaluationTenderDemo.bidsReceived} Bids Received
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[18px] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-md lg:w-auto lg:min-w-64">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <Gavel className="size-4.5" />
              </div>

              <div>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-white/45">
                  EVALUATION STATUS
                </p>

                <p className="mt-1.5 text-sm font-semibold text-white">
                  {evaluationStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="relative isolate overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-indigo-400/15 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <UsersRound className="size-5" />
            </div>

            <span className="text-[9px] font-semibold tracking-[0.15em] text-indigo-500">
              PARTICIPATION
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
            {evaluationTenderDemo.bidsReceived}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-600">
            Bids received
          </p>
        </article>

        <article className="relative isolate overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-emerald-400/15 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="size-5" />
            </div>

            <span className="text-[9px] font-semibold tracking-[0.15em] text-emerald-600">
              RESPONSIVE
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
            {responsiveCount}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-600">
            Technically responsive
          </p>
        </article>

        <article className="relative isolate overflow-hidden rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-violet-400/15 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Target className="size-5" />
            </div>

            <span className="text-[9px] font-semibold tracking-[0.15em] text-violet-600">
              TOP SCORE
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
            {topVendor?.totalScore ?? "—"}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-600">
            Highest score / 100
          </p>
        </article>

        <article className="relative isolate overflow-hidden rounded-[20px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/60 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="absolute -right-10 -top-10 -z-10 size-32 rounded-full bg-cyan-400/15 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <CircleDollarSign className="size-5" />
            </div>

            <span className="text-[9px] font-semibold tracking-[0.15em] text-cyan-700">
              LOWEST BID
            </span>
          </div>

          <p className="mt-4 truncate text-lg font-semibold tracking-[-0.025em] text-slate-900">
            {formatBdt(lowestBid)}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-600">
            Lowest submitted value
          </p>
        </article>
      </section>

      {/* Evaluation workflow */}
      <section className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.17em] text-indigo-600">
              AWARD WORKFLOW
            </p>

            <h2 className="mt-1.5 text-[17px] font-semibold text-slate-900">
              Evaluation to Award
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Comparative evaluation, recommendation and final award approval
              status.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
            <div
              className={`rounded-[14px] border p-3 ${
                awardStage === "evaluation"
                  ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm"
                  : "border-emerald-100 bg-emerald-50/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    awardStage === "evaluation"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {awardStage === "evaluation" ? (
                    <Scale className="size-3.5" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                </div>

                <div>
                  <p className="text-[8px] font-semibold tracking-[0.1em] text-slate-400">
                    STEP 01
                  </p>

                  <p className="text-[10px] font-semibold text-slate-700">
                    Evaluation
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-[14px] border p-3 ${
                awardStage === "recommended"
                  ? "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-sm"
                  : awardStage === "approved"
                    ? "border-emerald-100 bg-emerald-50/50"
                    : "border-slate-100 bg-slate-50/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    awardStage === "recommended"
                      ? "bg-violet-100 text-violet-600"
                      : awardStage === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {awardStage === "approved" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Award className="size-3.5" />
                  )}
                </div>

                <div>
                  <p className="text-[8px] font-semibold tracking-[0.1em] text-slate-400">
                    STEP 02
                  </p>

                  <p className="text-[10px] font-semibold text-slate-700">
                    Recommendation
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-[14px] border p-3 ${
                awardStage === "approved"
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-sm"
                  : "border-slate-100 bg-slate-50/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    awardStage === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Gavel className="size-3.5" />
                </div>

                <div>
                  <p className="text-[8px] font-semibold tracking-[0.1em] text-slate-400">
                    STEP 03
                  </p>

                  <p className="text-[10px] font-semibold text-slate-700">
                    Award Approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor ranking */}
      <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

        <header className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
              <Trophy className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                COMPARATIVE STATEMENT
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Vendor Ranking
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Combined technical and financial scoring for all evaluated
                supplier bids.
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="w-fit border border-violet-100 bg-violet-50 text-violet-700"
          >
            {evaluationVendorsDemo.length} Evaluated
          </Badge>
        </header>

        <div className="p-4 sm:p-5">
          <div className="overflow-x-auto rounded-[18px] border border-slate-100">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-violet-50/30 to-cyan-50/30">
                  <th className="h-12 px-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    RANK
                  </th>

                  <th className="h-12 px-4 text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    VENDOR
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    TECHNICAL
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    FINANCIAL
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    TOTAL SCORE
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    BID AMOUNT
                  </th>

                  <th className="h-12 px-4 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500">
                    RESPONSIVENESS
                  </th>
                </tr>
              </thead>

              <tbody>
                {rankedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className={`border-b border-slate-100 transition last:border-0 ${
                      vendor.rank === 1
                        ? "bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/30 hover:from-amber-50 hover:to-emerald-50/50"
                        : "hover:bg-gradient-to-r hover:from-violet-50/35 hover:via-white hover:to-cyan-50/30"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex size-9 items-center justify-center rounded-xl ${
                            vendor.rank === 1
                              ? "bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {vendor.rank === 1 ? (
                            <Trophy className="size-4 fill-amber-400" />
                          ) : (
                            <Medal className="size-4" />
                          )}
                        </div>

                        <span className="text-[12px] font-semibold text-slate-800">
                          #{vendor.rank}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[12px] font-semibold text-slate-900">
                        {vendor.vendorName}
                      </p>

                      <p className="mt-1 text-[9px] font-medium text-slate-400">
                        {vendor.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto w-28">
                        <div className="mb-1 flex items-center justify-end gap-1.5">
                          <span className="text-[11px] font-semibold text-indigo-700">
                            {vendor.technicalScore}
                          </span>

                          <span className="text-[9px] text-slate-400">
                            / 60
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-indigo-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (vendor.technicalScore / 60) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto w-28">
                        <div className="mb-1 flex items-center justify-end gap-1.5">
                          <span className="text-[11px] font-semibold text-cyan-700">
                            {vendor.financialScore}
                          </span>

                          <span className="text-[9px] text-slate-400">
                            / 40
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-cyan-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (vendor.financialScore / 40) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex min-w-14 justify-center rounded-xl px-2.5 py-1.5 text-[13px] font-semibold ${
                          vendor.rank === 1
                            ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border border-violet-100 bg-violet-50 text-violet-700"
                        }`}
                      >
                        {vendor.totalScore}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {formatBdt(vendor.bidAmount)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-semibold ${
                          vendor.technicalStatus === "Responsive"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-amber-100 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {vendor.technicalStatus === "Responsive" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <FileCheck2 className="size-3" />
                        )}

                        {vendor.technicalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Recommendation */}
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] xl:col-span-2">
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 size-56 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-emerald-500 to-cyan-500" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6 sm:px-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-100 to-emerald-50 text-amber-600">
              <Award className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-amber-600">
                AWARD RECOMMENDATION
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Recommended Vendor
              </h2>
            </div>
          </header>

          <div className="p-5 sm:p-6">
            <div className="relative overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50 p-5 sm:p-6">
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-cyan-300/15 blur-2xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600">
                      <Trophy className="size-5 fill-amber-400" />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold tracking-[0.13em] text-emerald-600">
                        RANKED #1
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {awardDemo.recommendedVendor}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 max-w-xl text-[11px] leading-5 text-slate-600">
                    {awardDemo.reason}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-3 rounded-[14px] border border-emerald-100 bg-white/80 px-4 py-3">
                    <CircleDollarSign className="size-4 text-emerald-600" />

                    <div>
                      <p className="text-[8px] font-semibold tracking-[0.13em] text-slate-400">
                        RECOMMENDED AWARD VALUE
                      </p>

                      <p className="mt-1 text-lg font-semibold text-emerald-700">
                        {formatBdt(awardDemo.awardValue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {awardStage === "evaluation" && (
                    <Button
                      onClick={() => setRecommendOpen(true)}
                      className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)]"
                    >
                      <Award className="size-4" />
                      Recommend for Award
                    </Button>
                  )}

                  {awardStage === "recommended" && (
                    <Button
                      onClick={() => setApproveOpen(true)}
                      className="h-11 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                    >
                      <Gavel className="size-4" />
                      Approve Award
                    </Button>
                  )}

                  {awardStage === "approved" && (
                    <div className="flex items-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">
                      <CheckCircle2 className="size-4" />
                      Award Approved
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-5 pt-6">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-100 to-cyan-50 text-violet-600">
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold tracking-[0.17em] text-violet-600">
                DECISION SUMMARY
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                Evaluation Summary
              </h2>
            </div>
          </header>

          <div className="space-y-3 p-5">
            <div className="rounded-[15px] border border-violet-100 bg-violet-50/50 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-violet-500">
                HIGHEST SCORE
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                {topVendor?.totalScore ?? "—"}{" "}
                <span className="text-xs font-medium text-slate-400">
                  / 100
                </span>
              </p>
            </div>

            <div className="rounded-[15px] border border-amber-100 bg-amber-50/50 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-amber-600">
                RECOMMENDED VENDOR
              </p>

              <p className="mt-2 text-[12px] font-semibold text-slate-900">
                {awardDemo.recommendedVendor}
              </p>
            </div>

            <div className="rounded-[15px] border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-emerald-600">
                RECOMMENDED AWARD
              </p>

              <p className="mt-2 text-[12px] font-semibold text-emerald-700">
                {formatBdt(awardDemo.awardValue)}
              </p>
            </div>

            <div className="rounded-[15px] border border-cyan-100 bg-cyan-50/50 p-4">
              <p className="text-[8px] font-semibold tracking-[0.13em] text-cyan-700">
                CURRENT STATUS
              </p>

              <p className="mt-2 text-[11px] font-semibold text-slate-900">
                {evaluationStatus}
              </p>
            </div>
          </div>
        </section>
      </div>

      <ConfirmationDialog
        open={recommendOpen}
        onOpenChange={setRecommendOpen}
        title="Recommend MediSupply Ltd.?"
        description="This will record MediSupply Ltd. as the recommended vendor for the ICU Equipment Supply 2026 tender."
        confirmLabel="Recommend Vendor"
        onConfirm={recommendVendor}
      />

      <ConfirmationDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve award?"
        description="This will approve the award recommendation for MediSupply Ltd. and make the tender ready for purchase order issuance."
        confirmLabel="Approve Award"
        onConfirm={approveAward}
      />
    </div>
  );
}
