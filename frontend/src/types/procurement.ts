export type UserRole =
  | "admin"
  | "approver"
  | "evaluator"
  | "management_viewer"
  | "vendor";

export type RequisitionStatus =
  | "draft"
  | "pending_approval"
  | "revision_required"
  | "approved"
  | "rejected"
  | "converted";

export type VendorStatus =
  | "pending_verification"
  | "approved"
  | "suspended"
  | "blacklisted";

export type TenderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "published"
  | "bidding_open"
  | "closed"
  | "evaluation"
  | "awarded"
  | "cancelled";

export type BidStatus = "draft" | "submitted" | "withdrawn" | "locked";

export type AwardStatus = "recommended" | "pending_approval" | "approved";

export type PurchaseOrderStatus =
  | "issued"
  | "awaiting_vendor_acceptance"
  | "accepted";

export type ContractStatus = "draft" | "active" | "completed" | "expired";

export type ReceiptStatus = "pending" | "confirmed";

export type InvoiceStatus =
  | "submitted"
  | "under_verification"
  | "verified"
  | "mismatch"
  | "approved";

export type PaymentStatus =
  | "pending_approval"
  | "approved"
  | "outstanding"
  | "paid";

export type TenderType = "public_tender" | "invited_tender" | "rfq";

export type ProcurementCategory =
  | "medical_equipment"
  | "pharmaceuticals"
  | "medical_consumables"
  | "diagnostic_reagents"
  | "laboratory_supplies"
  | "it_technology"
  | "facility_maintenance"
  | "general_supplies"
  | "professional_services";

export type Requisition = {
  id: string;
  department: string;
  title: string;
  category: ProcurementCategory;
  requester: string;
  estimatedBudget: number;
  requiredDate: string;
  status: RequisitionStatus;
};

export type Vendor = {
  id: string;
  name: string;
  category: ProcurementCategory;
  status: VendorStatus;
  performanceScore?: number;
  documentExpiryAlert?: string;
};

export type Tender = {
  id: string;
  tenderNumber: string;
  title: string;
  category: ProcurementCategory;
  type: TenderType;
  closingDate: string;
  status: TenderStatus;
  bidCount: number;
};

export type Bid = {
  id: string;
  tenderId: string;
  vendorId: string;
  status: BidStatus;
  totalAmount: number;
};

export type EvaluationResult = {
  vendorId: string;
  technicalScore: number;
  financialScore: number;
  totalScore: number;
  rank: number;
};

export type Award = {
  id: string;
  tenderId: string;
  vendorId: string;
  awardValue: number;
  status: AwardStatus;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  tenderId: string;
  vendorId: string;
  totalAmount: number;
  deliveryDate: string;
  status: PurchaseOrderStatus;
};

export type Contract = {
  id: string;
  contractNumber: string;
  vendorId: string;
  tenderId: string;
  purchaseOrderId: string;
  startDate: string;
  endDate: string;
  value: number;
  status: ContractStatus;
};

export type DeliveryReceipt = {
  id: string;
  purchaseOrderId: string;
  vendorId: string;
  deliveryDate: string;
  status: ReceiptStatus;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  purchaseOrderId: string;
  vendorId: string;
  amount: number;
  status: InvoiceStatus;
};

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
};
