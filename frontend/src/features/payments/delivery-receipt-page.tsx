import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  PackageCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  deliveryDemo,
  deliveryItemsDemo,
  goodsReceiptDemo,
} from "./payment-demo-data";

type DeliveryStage = "pending" | "delivered" | "receipt_confirmed";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function DeliveryReceiptPage() {
  const [stage, setStage] = useState<DeliveryStage>(() => {
    const saved = localStorage.getItem("bsh-phase7-delivery-stage");

    if (saved === "delivered" || saved === "receipt_confirmed") {
      return saved;
    }

    return "pending";
  });

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const contractActive =
    localStorage.getItem("bsh-phase6-contract-stage") === "active";

  function recordDelivery() {
    setStage("delivered");

    localStorage.setItem("bsh-phase7-delivery-stage", "delivered");

    toast.success("Delivery recorded successfully");
  }

  function confirmReceipt() {
    setStage("receipt_confirmed");

    localStorage.setItem("bsh-phase7-delivery-stage", "receipt_confirmed");

    toast.success("Goods receipt confirmed");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          DELIVERY & RECEIVING
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Delivery & Goods Receipt
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Record supplier delivery and confirm receipt of goods against the
          approved purchase order.
        </p>
      </div>

      {!contractActive && (
        <Card>
          <CardContent className="p-5">
            <p className="font-medium">Active contract required</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Activate the supplier contract before recording delivery.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">
                  {deliveryDemo.deliveryNumber}
                </p>

                <Badge
                  variant={
                    stage === "receipt_confirmed" ? "secondary" : "outline"
                  }
                >
                  {stage === "pending"
                    ? "Pending Delivery"
                    : stage === "delivered"
                      ? "Delivered"
                      : "Receipt Confirmed"}
                </Badge>
              </div>

              <h2 className="mt-2 text-lg font-semibold">
                {deliveryDemo.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Supplier: {deliveryDemo.vendor}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/20 px-5 py-4 lg:min-w-56 lg:text-right">
              <p className="text-xs text-muted-foreground">Expected Delivery</p>

              <p className="mt-1 text-base font-semibold">
                {formatDate(deliveryDemo.deliveryDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Delivered Items</CardTitle>

            <p className="text-xs text-muted-foreground">
              Items received against {deliveryDemo.poNumber}.
            </p>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">Item</th>

                    <th className="pb-3 text-right font-medium">Ordered</th>

                    <th className="pb-3 text-right font-medium">Delivered</th>

                    <th className="pb-3 text-right font-medium">Condition</th>
                  </tr>
                </thead>

                <tbody>
                  {deliveryItemsDemo.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-4 font-medium">{item.item}</td>

                      <td className="py-4 text-right">
                        {item.orderedQuantity} {item.unit}
                      </td>

                      <td className="py-4 text-right">
                        {stage === "pending"
                          ? "—"
                          : `${item.deliveredQuantity} ${item.unit}`}
                      </td>

                      <td className="py-4 text-right">
                        {stage === "pending" ? (
                          <Badge variant="outline">Pending</Badge>
                        ) : (
                          <Badge variant="secondary">{item.condition}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receiving Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">Purchase Order</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {deliveryDemo.poNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-teal-700" />

              <div>
                <p className="text-sm font-medium">Contract Active</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {deliveryDemo.contractNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck
                className={`mt-0.5 size-4 ${
                  stage !== "pending"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Supplier Delivery</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stage === "pending"
                    ? "Awaiting delivery"
                    : deliveryDemo.deliveryNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClipboardCheck
                className={`mt-0.5 size-4 ${
                  stage === "receipt_confirmed"
                    ? "text-teal-700"
                    : "text-muted-foreground"
                }`}
              />

              <div>
                <p className="text-sm font-medium">Goods Receipt</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stage === "receipt_confirmed"
                    ? goodsReceiptDemo.receiptNumber
                    : "Pending confirmation"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {stage !== "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goods Receipt Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">GRN Number</p>

              <p className="mt-1 text-sm font-medium">
                {stage === "receipt_confirmed"
                  ? goodsReceiptDemo.receiptNumber
                  : "Pending"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Received By</p>

              <p className="mt-1 text-sm font-medium">
                {goodsReceiptDemo.receivedBy}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Checked By</p>

              <p className="mt-1 text-sm font-medium">
                {goodsReceiptDemo.checkedBy}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Received Date</p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(goodsReceiptDemo.receivedDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receiving Action</CardTitle>
        </CardHeader>

        <CardContent>
          {stage === "pending" && (
            <Button
              disabled={!contractActive}
              onClick={() => setDeliveryOpen(true)}
            >
              <Truck className="size-4" />
              Record Delivery
            </Button>
          )}

          {stage === "delivered" && (
            <Button onClick={() => setReceiptOpen(true)}>
              <PackageCheck className="size-4" />
              Confirm Goods Receipt
            </Button>
          )}

          {stage === "receipt_confirmed" && (
            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
              <CheckCircle2 className="size-4" />
              Goods Receipt Confirmed — {goodsReceiptDemo.receiptNumber}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deliveryOpen}
        onOpenChange={setDeliveryOpen}
        title="Record supplier delivery?"
        description={`Record ${deliveryDemo.deliveryNumber} against ${deliveryDemo.poNumber}?`}
        confirmLabel="Record Delivery"
        onConfirm={recordDelivery}
      />

      <ConfirmationDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        title="Confirm goods receipt?"
        description={`Confirm that all items under ${deliveryDemo.deliveryNumber} were received and checked by Bangladesh Specialized Hospital PLC?`}
        confirmLabel="Confirm Receipt"
        onConfirm={confirmReceipt}
      />
    </div>
  );
}
