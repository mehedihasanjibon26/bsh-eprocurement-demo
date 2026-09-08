import { Badge } from "@/components/ui/badge";

import type {
  AwardStatus,
  BidStatus,
  ContractStatus,
  InvoiceStatus,
  PaymentStatus,
  PurchaseOrderStatus,
  ReceiptStatus,
  RequisitionStatus,
  TenderStatus,
  VendorStatus,
} from "@/types/procurement";

type ProcurementStatus =
  | RequisitionStatus
  | VendorStatus
  | TenderStatus
  | BidStatus
  | AwardStatus
  | PurchaseOrderStatus
  | ContractStatus
  | ReceiptStatus
  | InvoiceStatus
  | PaymentStatus;

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",

  info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",

  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",

  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",

  danger:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

function getStatusTone(status: ProcurementStatus): StatusTone {
  switch (status) {
    case "approved":
    case "accepted":
    case "active":
    case "confirmed":
    case "verified":
    case "paid":
    case "awarded":
    case "published":
      return "success";

    case "pending_approval":
    case "pending_verification":
    case "revision_required":
    case "under_verification":
    case "outstanding":
    case "awaiting_vendor_acceptance":
      return "warning";

    case "rejected":
    case "suspended":
    case "blacklisted":
    case "cancelled":
    case "mismatch":
    case "expired":
      return "danger";

    case "submitted":
    case "evaluation":
    case "bidding_open":
    case "issued":
    case "recommended":
      return "info";

    default:
      return "neutral";
  }
}

function formatStatusLabel(status: ProcurementStatus): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type StatusBadgeProps = {
  status: ProcurementStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={toneClasses[getStatusTone(status)]}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
