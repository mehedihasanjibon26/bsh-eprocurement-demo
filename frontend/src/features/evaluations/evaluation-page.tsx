import { useState } from "react";
import { Award, CheckCircle2, Gavel, Medal, Trophy } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          TENDER EVALUATION
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Comparative Statement
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Technical and financial comparison for {evaluationTenderDemo.title}.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">
                  {evaluationTenderDemo.tenderNumber}
                </p>

                <Badge variant="secondary">{evaluationTenderDemo.status}</Badge>
              </div>

              <h2 className="mt-2 text-lg font-semibold">
                {evaluationTenderDemo.title}
              </h2>

              <p className="mt-2 text-xs text-muted-foreground">
                {evaluationTenderDemo.category} ·{" "}
                {evaluationTenderDemo.bidsReceived} bids received
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-4 py-3">
              <Gavel className="size-4 text-primary" />

              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Evaluation Status
                </p>

                <p className="text-sm font-semibold">
                  {awardStage === "approved"
                    ? "Award Approved"
                    : awardStage === "recommended"
                      ? "Award Recommended"
                      : "Evaluation in Progress"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vendor Ranking</CardTitle>

          <p className="text-xs text-muted-foreground">
            Combined technical and financial scoring for qualified bids.
          </p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Rank</th>
                  <th className="pb-3 font-medium">Vendor</th>
                  <th className="pb-3 text-right font-medium">Technical</th>
                  <th className="pb-3 text-right font-medium">Financial</th>
                  <th className="pb-3 text-right font-medium">Total Score</th>
                  <th className="pb-3 text-right font-medium">Bid Amount</th>
                  <th className="pb-3 text-right font-medium">
                    Responsiveness
                  </th>
                </tr>
              </thead>

              <tbody>
                {evaluationVendorsDemo.map((vendor) => (
                  <tr key={vendor.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {vendor.rank === 1 ? (
                          <Trophy className="size-4 text-amber-500" />
                        ) : (
                          <Medal className="size-4 text-muted-foreground" />
                        )}

                        <span className="font-semibold">#{vendor.rank}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <p className="font-medium">{vendor.vendorName}</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {vendor.id}
                      </p>
                    </td>

                    <td className="py-4 text-right">{vendor.technicalScore}</td>

                    <td className="py-4 text-right">{vendor.financialScore}</td>

                    <td className="py-4 text-right">
                      <span className="text-base font-semibold">
                        {vendor.totalScore}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      {formatBdt(vendor.bidAmount)}
                    </td>

                    <td className="py-4 text-right">
                      <Badge
                        variant={
                          vendor.technicalStatus === "Responsive"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {vendor.technicalStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recommended Vendor</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-primary" />

                  <h3 className="font-semibold">
                    {awardDemo.recommendedVendor}
                  </h3>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {awardDemo.reason}
                </p>

                <p className="mt-3 text-lg font-semibold">
                  {formatBdt(awardDemo.awardValue)}
                </p>
              </div>

              <div className="shrink-0">
                {awardStage === "evaluation" && (
                  <Button onClick={() => setRecommendOpen(true)}>
                    Recommend for Award
                  </Button>
                )}

                {awardStage === "recommended" && (
                  <Button onClick={() => setApproveOpen(true)}>
                    Approve Award
                  </Button>
                )}

                {awardStage === "approved" && (
                  <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                    <CheckCircle2 className="size-4" />
                    Award Approved
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evaluation Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Highest Score</p>

              <p className="mt-1 text-lg font-semibold">92 / 100</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Recommended Vendor
              </p>

              <p className="mt-1 text-sm font-medium">MediSupply Ltd.</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Recommended Award</p>

              <p className="mt-1 text-sm font-medium">
                {formatBdt(awardDemo.awardValue)}
              </p>
            </div>
          </CardContent>
        </Card>
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
