import { Badge, Card, CardContent, CardHeader, CardTitle, KpiCard, VendorHero } from "./vendor-portal-ui";
import { AlertTriangle, CheckCircle2, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { vendorDocumentsDemo } from "./vendor-demo-data";

function statusIcon(status: string) {
  if (status === "Verified") {
    return <CheckCircle2 className="size-4 text-teal-700" />;
  }

  return <AlertTriangle className="size-4 text-amber-600" />;
}

export function VendorDocumentsPage() {
  return (
    <div className="vendor-portal space-y-6">
      <VendorHero icon={FileText}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
              SUPPLIER DOCUMENTS
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Documents
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review your supplier registration and compliance documents for
              Bangladesh Specialized Hospital PLC.
            </p>
          </div>

          <Button>
            <Upload className="size-4" />
            Upload Document
          </Button>
        </div>
      </VendorHero>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Document register" value={String(vendorDocumentsDemo.length)} description="Company and tax documents on record" icon={<FileText />} />
        <KpiCard title="Verified documents" value={String(vendorDocumentsDemo.filter((document) => document.status === "Verified").length)} description="Current demo verification status" icon={<CheckCircle2 />} />
        <KpiCard title="Attention required" value={String(vendorDocumentsDemo.filter((document) => document.status !== "Verified").length)} description="Review renewals and pending checks" icon={<AlertTriangle />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Documents</CardTitle>

          <p className="text-xs text-muted-foreground">
            Keep required business and tax documents current for tender
            participation.
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {vendorDocumentsDemo.map((document) => (
            <div
              key={document.id}
              data-document-status={document.status}
              className="vendor-row flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="vendor-document-icon flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
                  <FileText className="size-5 text-primary" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{document.name}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.type}
                  </p>

                  {document.expiryDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Expiry: {document.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {statusIcon(document.status)}

                <Badge
                  variant={
                    document.status === "Verified" ? "secondary" : "outline"
                  }
                >
                  {document.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Status</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-start gap-3 vendor-notice rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />

            <div>
              <p className="text-sm font-medium">
                Trade License requires attention
              </p>

              <p className="mt-1 text-xs leading-relaxed">
                Your Trade License is approaching expiry. Update the document to
                keep your supplier profile current.
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Document upload and verification actions are simulated in this demo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
