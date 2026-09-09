import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Star,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { vendorDocumentsDemo, vendorProfileDemo } from "./vendor-demo-data";

export function VendorProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          SUPPLIER PROFILE
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Vendor Profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review your company information and supplier standing with Bangladesh
          Specialized Hospital PLC.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-8" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {vendorProfileDemo.name}
                </h2>

                <Badge variant="secondary">{vendorProfileDemo.status}</Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {vendorProfileDemo.vendorId} · {vendorProfileDemo.category}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                  <Star className="size-4 text-amber-500" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Performance
                    </p>

                    <p className="text-sm font-semibold">
                      {vendorProfileDemo.performanceScore} / 5
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                  <CheckCircle2 className="size-4 text-teal-700" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Supplier Status
                    </p>

                    <p className="text-sm font-semibold">Approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Contact Person</p>

                <p className="mt-1 text-sm font-medium">
                  {vendorProfileDemo.contactPerson}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>

                <p className="mt-1 text-sm font-medium">
                  {vendorProfileDemo.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Phone</p>

                <p className="mt-1 text-sm font-medium">
                  {vendorProfileDemo.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Business Address
                </p>

                <p className="mt-1 text-sm font-medium">
                  {vendorProfileDemo.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Overview</CardTitle>

            <p className="text-xs text-muted-foreground">
              Current supplier document status.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {vendorDocumentsDemo.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{document.name}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.expiryDate
                      ? `Expiry: ${document.expiryDate}`
                      : document.type}
                  </p>
                </div>

                <Badge
                  variant={
                    document.status === "Verified" ? "secondary" : "outline"
                  }
                >
                  {document.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Standing</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm font-medium">Approved hospital supplier</p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Your company is currently eligible to participate in applicable
              procurement opportunities. Keep required supplier documents
              current to maintain eligibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
