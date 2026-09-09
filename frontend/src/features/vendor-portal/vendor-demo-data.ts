export type VendorBidDemo = {
  id: string;
  tenderNumber: string;
  title: string;
  amount: number;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Under Evaluation" | "Awarded";
};

export type VendorDocumentDemo = {
  id: string;
  name: string;
  type: string;
  expiryDate?: string;
  status: "Verified" | "Expiring Soon" | "Pending";
};

export type VendorContractDemo = {
  id: string;
  reference: string;
  title: string;
  value: number;
  status: "Active" | "Awaiting Acceptance" | "Completed";
};

export type VendorInvoiceDemo = {
  id: string;
  invoiceNumber: string;
  reference: string;
  amount: number;
  submittedAt: string;
  status: "Submitted" | "Under Verification" | "Approved" | "Paid";
};

export const vendorProfileDemo = {
  name: "MediSupply Ltd.",
  vendorId: "VEN-001",
  category: "Medical Equipment",
  status: "Approved",
  performanceScore: 4.6,
  contactPerson: "Rahman Ahmed",
  email: "vendor@bsh-demo.com",
  phone: "+880 1712-345678",
  address: "Dhaka, Bangladesh",
};

export const vendorDashboardDemo = {
  eligibleTenders: 3,
  activeBids: 2,
  awardedContracts: 1,
  pendingDocuments: 1,
};

export const vendorBidsDemo: VendorBidDemo[] = [
  {
    id: "BID-001",
    tenderNumber: "TN-ICU-2026-001",
    title: "ICU Equipment Supply 2026",
    amount: 4850000,
    submittedAt: "2026-09-07",
    status: "Under Evaluation",
  },
  {
    id: "BID-002",
    tenderNumber: "TN-MC-2026-002",
    title: "Medical Consumables Procurement 2026",
    amount: 1275000,
    submittedAt: "2026-09-08",
    status: "Submitted",
  },
];

export const vendorDocumentsDemo: VendorDocumentDemo[] = [
  {
    id: "DOC-001",
    name: "Trade License",
    type: "Business Document",
    expiryDate: "2026-10-09",
    status: "Expiring Soon",
  },
  {
    id: "DOC-002",
    name: "TIN Certificate",
    type: "Tax Document",
    status: "Verified",
  },
  {
    id: "DOC-003",
    name: "VAT Registration Certificate",
    type: "Tax Document",
    status: "Verified",
  },
];

export const vendorContractsDemo: VendorContractDemo[] = [
  {
    id: "CON-001",
    reference: "PO-2026-001",
    title: "ICU Equipment Supply 2026",
    value: 4850000,
    status: "Awaiting Acceptance",
  },
];

export const vendorInvoicesDemo: VendorInvoiceDemo[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-001",
    reference: "PO-2026-001",
    amount: 4850000,
    submittedAt: "2026-09-08",
    status: "Under Verification",
  },
];

export const vendorNotificationsDemo = [
  {
    id: "NOT-001",
    title: "Tender evaluation started",
    message: "ICU Equipment Supply 2026 is now under evaluation.",
  },
  {
    id: "NOT-002",
    title: "Document expiry reminder",
    message: "Your Trade License will expire in 30 days.",
  },
  {
    id: "NOT-003",
    title: "New tender available",
    message: "Diagnostic Reagents Supply is open for eligible vendors.",
  },
];
