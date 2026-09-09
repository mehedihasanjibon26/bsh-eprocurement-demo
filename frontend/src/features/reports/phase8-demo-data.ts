export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  module: string;
  action: string;
  reference: string;
  description: string;
};

export type NotificationDemo = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  time: string;
  read: boolean;
};

export const procurementReportSummary = {
  totalProcurementValue: 14250000,
  activeTenders: 3,
  approvedVendors: 3,
  completedPayments: 1,
};

export const monthlySpendDemo = [
  {
    month: "Apr",
    amount: 1450000,
  },
  {
    month: "May",
    amount: 2100000,
  },
  {
    month: "Jun",
    amount: 1750000,
  },
  {
    month: "Jul",
    amount: 2650000,
  },
  {
    month: "Aug",
    amount: 1450000,
  },
  {
    month: "Sep",
    amount: 4850000,
  },
];

export const categorySpendDemo = [
  {
    category: "Medical Equipment",
    amount: 6850000,
  },
  {
    category: "Medical Consumables",
    amount: 3100000,
  },
  {
    category: "Diagnostic Supplies",
    amount: 2450000,
  },
  {
    category: "Services",
    amount: 1850000,
  },
];

export const tenderStatusDemo = [
  {
    status: "Draft",
    count: 1,
  },
  {
    status: "Published",
    count: 2,
  },
  {
    status: "Evaluation",
    count: 1,
  },
  {
    status: "Awarded",
    count: 1,
  },
];

export const vendorPerformanceDemo = [
  {
    vendor: "MediSupply Ltd.",
    score: 4.6,
    status: "Approved",
  },
  {
    vendor: "HealthTech Traders",
    score: 4.3,
    status: "Approved",
  },
  {
    vendor: "CarePoint Distributors",
    score: 4.1,
    status: "Approved",
  },
];

export const auditEntriesDemo: AuditEntry[] = [
  {
    id: "AUD-001",
    timestamp: "2026-09-09T10:05:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Requisition",
    action: "Approved Requisition",
    reference: "REQ-2026-001",
    description:
      "Approved ICU Equipment procurement requisition for tender preparation.",
  },
  {
    id: "AUD-002",
    timestamp: "2026-09-09T10:12:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Tender",
    action: "Published Tender",
    reference: "TN-ICU-2026-001",
    description:
      "Published ICU Equipment Supply 2026 tender for eligible vendors.",
  },
  {
    id: "AUD-003",
    timestamp: "2026-09-09T10:28:00",
    actor: "MediSupply Ltd.",
    role: "Vendor",
    module: "Bid",
    action: "Submitted Bid",
    reference: "BID-001-MSL",
    description:
      "Submitted technical and financial bid for ICU Equipment Supply 2026.",
  },
  {
    id: "AUD-004",
    timestamp: "2026-09-09T10:46:00",
    actor: "Evaluation Committee",
    role: "Evaluator",
    module: "Evaluation",
    action: "Completed Evaluation",
    reference: "TN-ICU-2026-001",
    description:
      "Completed comparative evaluation and ranked MediSupply Ltd. first with a score of 92.",
  },
  {
    id: "AUD-005",
    timestamp: "2026-09-09T10:51:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Award",
    action: "Approved Award",
    reference: "TN-ICU-2026-001",
    description:
      "Approved award recommendation for MediSupply Ltd. at BDT 4,850,000.",
  },
  {
    id: "AUD-006",
    timestamp: "2026-09-09T10:56:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Purchase Order",
    action: "Issued Purchase Order",
    reference: "PO-2026-001",
    description:
      "Issued purchase order to MediSupply Ltd. following approved tender award.",
  },
  {
    id: "AUD-007",
    timestamp: "2026-09-09T11:01:00",
    actor: "MediSupply Ltd.",
    role: "Vendor",
    module: "Purchase Order",
    action: "Accepted Purchase Order",
    reference: "PO-2026-001",
    description: "Supplier accepted the issued purchase order.",
  },
  {
    id: "AUD-008",
    timestamp: "2026-09-09T11:05:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Contract",
    action: "Activated Contract",
    reference: "CON-2026-001",
    description: "Activated supplier contract linked to PO-2026-001.",
  },
  {
    id: "AUD-009",
    timestamp: "2026-10-15T10:20:00",
    actor: "Central Store",
    role: "Receiver",
    module: "Delivery",
    action: "Recorded Delivery",
    reference: "DEL-2026-001",
    description:
      "Recorded complete delivery of ICU equipment against PO-2026-001.",
  },
  {
    id: "AUD-010",
    timestamp: "2026-10-15T10:35:00",
    actor: "Central Store",
    role: "Receiver",
    module: "Goods Receipt",
    action: "Confirmed Goods Receipt",
    reference: "GRN-2026-001",
    description:
      "Confirmed received quantities and condition for all delivered items.",
  },
  {
    id: "AUD-011",
    timestamp: "2026-10-16T09:15:00",
    actor: "MediSupply Ltd.",
    role: "Vendor",
    module: "Invoice",
    action: "Submitted Invoice",
    reference: "INV-2026-001",
    description: "Submitted supplier invoice for BDT 4,850,000.",
  },
  {
    id: "AUD-012",
    timestamp: "2026-10-16T11:00:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "Invoice",
    action: "Verified Invoice",
    reference: "INV-2026-001",
    description:
      "Verified supplier invoice against purchase order and goods receipt.",
  },
  {
    id: "AUD-013",
    timestamp: "2026-10-16T11:08:00",
    actor: "BSH Administrator",
    role: "Administrator",
    module: "3-Way Match",
    action: "Completed Match",
    reference: "MATCH-2026-001",
    description:
      "Purchase order, goods receipt, and invoice matched successfully.",
  },
  {
    id: "AUD-014",
    timestamp: "2026-10-25T14:30:00",
    actor: "BSH Finance",
    role: "Administrator",
    module: "Payment",
    action: "Marked Payment Paid",
    reference: "PAY-2026-001",
    description:
      "Recorded payment of BDT 4,850,000 to MediSupply Ltd. by bank transfer.",
  },
];

export const notificationsDemo: NotificationDemo[] = [
  {
    id: "NOT-001",
    title: "Invoice ready for review",
    message:
      "INV-2026-001 from MediSupply Ltd. is ready for procurement verification.",
    type: "info",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "NOT-002",
    title: "Document expiry reminder",
    message: "MediSupply Ltd. Trade License will expire within 30 days.",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "NOT-003",
    title: "Purchase order accepted",
    message: "MediSupply Ltd. accepted PO-2026-001.",
    type: "success",
    time: "Yesterday",
    read: true,
  },
];

export const adminControlsDemo = {
  organization: "Bangladesh Specialized Hospital PLC",
  procurementEmail: "procurement@bsh-demo.com",
  currency: "BDT",
  approvalRequired: true,
  vendorVerificationRequired: true,
  threeWayMatchRequired: true,
};
