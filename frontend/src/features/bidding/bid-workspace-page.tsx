import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  Send,
  Upload,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { procurementError, tenderApi } from "@/services/procurement";
import type { TenderRecord } from "@/types/procurement-records";

import {
  bidCommercialTermsDemo,
  type FinancialBidItem,
  type TechnicalBidItem,
} from "./bid-demo-data";

type BidStatus = "Draft" | "Submitted" | "Withdrawn";

type BidDraft = {
  technicalItems: TechnicalBidItem[];
  financialItems: FinancialBidItem[];
  documents: Record<string, string>;
  bidValidityDays: number;
  deliveryPeriod: string;
  paymentTerms: string;
  status: BidStatus;
  bidId?: string;
  submittedAt?: string;
};

function formatBdt(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function createInitialDraft(tender: TenderRecord): BidDraft {
  return {
    technicalItems: tender.boq.map((item, index) => ({
      id: `TECH-${index + 1}`,
      item: item.name,
      requirement: item.specification,
      offeredSpecification: `Complies with required specification: ${item.specification}`,
      compliance: "Comply",
      remarks: "",
    })),
    financialItems: tender.boq.map((item, index) => ({
      id: `FIN-${index + 1}`,
      item: item.name,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unit_cost,
    })),
    documents: {},
    bidValidityDays: bidCommercialTermsDemo.bidValidityDays,
    deliveryPeriod: bidCommercialTermsDemo.deliveryPeriod,
    paymentTerms: bidCommercialTermsDemo.paymentTerms,
    status: "Draft",
  };
}

export function BidWorkspacePage() {
  const { id } = useParams();

  const {
    data: tender,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vendor", "bid-tender", id],
    queryFn: ({ signal }) => tenderApi.get(id ?? "", signal),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  const storageKey = `bsh-demo-bid-${id ?? "unknown"}`;

  const [draft, setDraft] = useState<BidDraft | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  useEffect(() => {
    if (!tender) {
      return;
    }

    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        setDraft(JSON.parse(saved) as BidDraft);
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setDraft(createInitialDraft(tender));
  }, [storageKey, tender]);

  useEffect(() => {
    if (draft) {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    }
  }, [draft, storageKey]);

  if (isPending) {
    return (
      <div className="space-y-5">
        <div className="h-24 animate-pulse rounded-xl border bg-card" />
        <div className="h-96 animate-pulse rounded-xl border bg-card" />
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <Card>
        <CardContent className="py-14 text-center">
          <h1 className="text-base font-semibold">
            Unable to open bidding workspace
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {procurementError(error)}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!draft) {
    return <div className="h-96 animate-pulse rounded-xl border bg-card" />;
  }

  const tenderId = tender.id;

  const closingTime = new Date(tender.closing_date).getTime();

  const biddingClosed =
    !["published", "bidding_open"].includes(tender.status) ||
    (Number.isFinite(closingTime) && closingTime < Date.now());

  const canEdit = draft.status === "Draft" && !biddingClosed;

  const subtotal = draft.financialItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  const vatAmount = subtotal * (bidCommercialTermsDemo.vatPercentage / 100);

  const grandTotal =
    subtotal + vatAmount + bidCommercialTermsDemo.deliveryCharge;

  const technicalComplete = draft.technicalItems.every(
    (item) =>
      item.offeredSpecification.trim().length > 0 && item.compliance.length > 0,
  );

  const financialComplete = draft.financialItems.every(
    (item) => item.unitPrice > 0,
  );

  const documentsComplete = tender.documents.every((document) =>
    Boolean(draft.documents[document]),
  );

  const canSubmit =
    technicalComplete && financialComplete && documentsComplete && canEdit;

  function updateTechnicalItem<
    K extends "offeredSpecification" | "compliance" | "remarks",
  >(itemId: string, field: K, value: TechnicalBidItem[K]) {
    setDraft((current) =>
      current
        ? {
            ...current,
            technicalItems: current.technicalItems.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    [field]: value,
                  }
                : item,
            ),
          }
        : current,
    );
  }

  function updateUnitPrice(itemId: string, value: number) {
    setDraft((current) =>
      current
        ? {
            ...current,
            financialItems: current.financialItems.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    unitPrice: value,
                  }
                : item,
            ),
          }
        : current,
    );
  }

  function handleDocument(documentName: string, fileName: string) {
    setDraft((current) =>
      current
        ? {
            ...current,
            documents: {
              ...current.documents,
              [documentName]: fileName,
            },
          }
        : current,
    );
  }

  function removeDocument(documentName: string) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const documents = { ...current.documents };
      delete documents[documentName];

      return {
        ...current,
        documents,
      };
    });
  }

  function saveDraft() {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    toast.success("Bid draft saved");
  }

  function submitBid() {
    setDraft((current) =>
      current
        ? {
            ...current,
            status: "Submitted",
            bidId: `BID-${String(tenderId).padStart(3, "0")}-MSL`,
            submittedAt: new Date().toISOString(),
          }
        : current,
    );

    toast.success("Bid submitted successfully");
  }

  function withdrawBid() {
    setDraft((current) =>
      current
        ? {
            ...current,
            status: "Withdrawn",
          }
        : current,
    );

    toast.success("Bid withdrawn");
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/vendor/tenders/${tender.id}`}
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "-ml-2",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to Tender
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
            ONLINE BIDDING
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {tender.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {tender.tender_number} · Closes {formatDate(tender.closing_date)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {biddingClosed && <Badge variant="outline">Bidding Closed</Badge>}

          <Badge
            variant={draft.status === "Submitted" ? "secondary" : "outline"}
          >
            {draft.status}
          </Badge>
        </div>
      </div>

      {biddingClosed && draft.status === "Draft" && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">Bid submission is closed</p>

            <p className="mt-1 text-sm text-muted-foreground">
              This tender is no longer accepting new or updated bids.
            </p>
          </CardContent>
        </Card>
      )}

      {draft.status === "Submitted" && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-700" />

              <div>
                <p className="font-semibold">Bid submitted successfully</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {draft.bidId} · {tender.tender_number}
                </p>

                {draft.submittedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {formatDate(draft.submittedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/vendor/bids"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                View My Bids
              </Link>

              <Button
                variant="destructive"
                onClick={() => setWithdrawDialogOpen(true)}
              >
                Withdraw Bid
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {draft.status === "Withdrawn" && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">This bid has been withdrawn</p>

            <p className="mt-1 text-sm text-muted-foreground">
              The bid remains visible for demo tracking but is no longer active.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="technical">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="technical">Technical</TabsTrigger>

          <TabsTrigger value="financial">Financial</TabsTrigger>

          <TabsTrigger value="documents">Documents</TabsTrigger>

          <TabsTrigger value="review">Review & Submit</TabsTrigger>
        </TabsList>

        <TabsContent value="technical" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Technical Bid</CardTitle>

              <p className="text-xs text-muted-foreground">
                Confirm your offered specification and compliance against each
                BOQ requirement.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {draft.technicalItems.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <p className="font-semibold">{item.item}</p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Requirement: {item.requirement}
                  </p>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium">
                        Offered Specification
                      </label>

                      <textarea
                        value={item.offeredSpecification}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updateTechnicalItem(
                            item.id,
                            "offeredSpecification",
                            event.target.value,
                          )
                        }
                        className="mt-2 min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium">
                          Compliance
                        </label>

                        <select
                          value={item.compliance}
                          disabled={!canEdit}
                          onChange={(event) =>
                            updateTechnicalItem(
                              item.id,
                              "compliance",
                              event.target
                                .value as TechnicalBidItem["compliance"],
                            )
                          }
                          className="mt-2 h-9 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                        >
                          <option value="Comply">Comply</option>

                          <option value="Partially Comply">
                            Partially Comply
                          </option>

                          <option value="Not Comply">Not Comply</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium">Remarks</label>

                        <Input
                          value={item.remarks}
                          disabled={!canEdit}
                          onChange={(event) =>
                            updateTechnicalItem(
                              item.id,
                              "remarks",
                              event.target.value,
                            )
                          }
                          placeholder="Optional vendor remarks"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Bid</CardTitle>

              <p className="text-xs text-muted-foreground">
                Enter offered unit prices. Bid totals are calculated
                automatically in BDT.
              </p>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="pb-3 font-medium">Item</th>

                      <th className="pb-3 text-right font-medium">Quantity</th>

                      <th className="pb-3 text-right font-medium">
                        Unit Price
                      </th>

                      <th className="pb-3 text-right font-medium">
                        Line Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {draft.financialItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-4 font-medium">{item.item}</td>

                        <td className="py-4 text-right">
                          {item.quantity} {item.unit}
                        </td>

                        <td className="py-4">
                          <div className="ml-auto w-40">
                            <Input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              disabled={!canEdit}
                              onChange={(event) =>
                                updateUnitPrice(
                                  item.id,
                                  Number(event.target.value),
                                )
                              }
                              className="text-right"
                            />
                          </div>
                        </td>

                        <td className="py-4 text-right font-medium">
                          {formatBdt(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 ml-auto max-w-sm space-y-3 rounded-lg border bg-muted/20 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span>{formatBdt(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT / Tax</span>

                  <span>{formatBdt(vatAmount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>

                  <span>
                    {formatBdt(bidCommercialTermsDemo.deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 font-semibold">
                  <span>Grand Total</span>
                  <span>{formatBdt(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-medium">
                    Bid Validity (Days)
                  </label>

                  <Input
                    type="number"
                    value={draft.bidValidityDays}
                    disabled={!canEdit}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              bidValidityDays: Number(event.target.value),
                            }
                          : current,
                      )
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Delivery Period</label>

                  <Input
                    value={draft.deliveryPeriod}
                    disabled={!canEdit}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              deliveryPeriod: event.target.value,
                            }
                          : current,
                      )
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Payment Terms</label>

                  <Input
                    value={draft.paymentTerms}
                    disabled={!canEdit}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              paymentTerms: event.target.value,
                            }
                          : current,
                      )
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supporting Documents</CardTitle>

              <p className="text-xs text-muted-foreground">
                Attach the documents required by this tender. File storage is
                simulated for the demo.
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {tender.documents.map((document) => {
                const fileName = draft.documents[document];

                return (
                  <div
                    key={document}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 size-5 text-primary" />

                      <div>
                        <p className="text-sm font-medium">{document}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {fileName || "No file selected"}
                        </p>
                      </div>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-2">
                        {fileName && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocument(document)}
                          >
                            Remove
                          </Button>
                        )}

                        <label
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "cursor-pointer",
                          })}
                        >
                          <Upload className="size-4" />
                          Choose File
                          <input
                            type="file"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];

                              if (file) {
                                handleDocument(document, file.name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Submission Checklist
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Technical Bid",
                      complete: technicalComplete,
                    },
                    {
                      label: "Financial Bid",
                      complete: financialComplete,
                    },
                    {
                      label: "Supporting Documents",
                      complete: documentsComplete,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <span className="text-sm font-medium">{item.label}</span>

                      <Badge variant={item.complete ? "secondary" : "outline"}>
                        {item.complete ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Bid Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tender</p>

                  <p className="mt-1 text-sm font-medium">
                    {tender.tender_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Vendor</p>

                  <p className="mt-1 text-sm font-medium">MediSupply Ltd.</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Bid Value
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {formatBdt(grandTotal)}
                  </p>
                </div>

                {draft.status === "Draft" && (
                  <div className="space-y-2 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={biddingClosed}
                      onClick={saveDraft}
                    >
                      <Save className="size-4" />
                      Save Draft
                    </Button>

                    <Button
                      className="w-full"
                      disabled={!canSubmit}
                      onClick={() => setSubmitDialogOpen(true)}
                    >
                      <Send className="size-4" />
                      Submit Final Bid
                    </Button>

                    {!canSubmit && !biddingClosed && (
                      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                        Complete all required sections before final submission.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        title="Submit final bid?"
        description={`Submit your official response for ${tender.tender_number}?`}
        confirmLabel="Submit Bid"
        onConfirm={submitBid}
      />

      <ConfirmationDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        title="Withdraw this bid?"
        description="The bid status will be changed to Withdrawn."
        confirmLabel="Withdraw Bid"
        destructive
        onConfirm={withdrawBid}
      />
    </div>
  );
}
