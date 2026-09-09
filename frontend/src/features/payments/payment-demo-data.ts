export type DeliveryItem = {
  id: string;
  item: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  unit: string;
  condition: "Accepted" | "Accepted with Note";
};

export type MatchRow = {
  id: string;
  label: string;
  poValue: number;
  receiptValue: number;
  invoiceValue: number;
  status: "Matched" | "Mismatch";
};

export const deliveryDemo = {
  deliveryNumber: "DEL-2026-001",
  poNumber: "PO-2026-001",
  contractNumber: "CON-2026-001",
  vendor: "MediSupply Ltd.",
  tenderNumber: "TN-ICU-2026-001",
  title: "ICU Equipment Supply 2026",
  deliveryDate: "2026-10-15",
  receivedBy: "Central Store",
};

export const deliveryItemsDemo: DeliveryItem[] = [
  {
    id: "DEL-ITEM-001",
    item: "ICU Ventilator",
    orderedQuantity: 2,
    deliveredQuantity: 2,
    unit: "Unit",
    condition: "Accepted",
  },
  {
    id: "DEL-ITEM-002",
    item: "Patient Monitor",
    orderedQuantity: 4,
    deliveredQuantity: 4,
    unit: "Unit",
    condition: "Accepted",
  },
  {
    id: "DEL-ITEM-003",
    item: "Infusion Pump",
    orderedQuantity: 5,
    deliveredQuantity: 5,
    unit: "Unit",
    condition: "Accepted",
  },
];

export const goodsReceiptDemo = {
  receiptNumber: "GRN-2026-001",
  deliveryNumber: "DEL-2026-001",
  poNumber: "PO-2026-001",
  vendor: "MediSupply Ltd.",
  receivedDate: "2026-10-15",
  receivedBy: "Central Store",
  checkedBy: "Procurement Department",
  status: "Confirmed",
};

export const invoiceDemo = {
  invoiceId: "INV-001",
  invoiceNumber: "INV-2026-001",
  vendor: "MediSupply Ltd.",
  poNumber: "PO-2026-001",
  receiptNumber: "GRN-2026-001",
  amount: 4850000,
  submittedDate: "2026-10-16",
  dueDate: "2026-11-15",
  status: "Submitted",
};

export const threeWayMatchDemo = {
  matchNumber: "MATCH-2026-001",
  poNumber: "PO-2026-001",
  receiptNumber: "GRN-2026-001",
  invoiceNumber: "INV-2026-001",
  totalAmount: 4850000,
};

export const matchRowsDemo: MatchRow[] = [
  {
    id: "MATCH-001",
    label: "Purchase Order",
    poValue: 4850000,
    receiptValue: 4850000,
    invoiceValue: 4850000,
    status: "Matched",
  },
  {
    id: "MATCH-002",
    label: "Delivered Quantity",
    poValue: 11,
    receiptValue: 11,
    invoiceValue: 11,
    status: "Matched",
  },
  {
    id: "MATCH-003",
    label: "Supplier",
    poValue: 1,
    receiptValue: 1,
    invoiceValue: 1,
    status: "Matched",
  },
];

export const paymentDemo = {
  paymentNumber: "PAY-2026-001",
  invoiceNumber: "INV-2026-001",
  poNumber: "PO-2026-001",
  vendor: "MediSupply Ltd.",
  amount: 4850000,
  method: "Bank Transfer",
  reference: "BSH-PAY-2026-001",
  paidDate: "2026-10-25",
};
