export type EvaluationVendor = {
  id: string;
  vendorName: string;
  technicalScore: number;
  financialScore: number;
  totalScore: number;
  rank: number;
  bidAmount: number;
  technicalStatus: "Responsive" | "Partially Responsive";
};

export const evaluationTenderDemo = {
  id: "1",
  tenderNumber: "TN-ICU-2026-001",
  title: "ICU Equipment Supply 2026",
  category: "Medical Equipment",
  status: "Evaluation",
  bidsReceived: 3,
};

export const evaluationVendorsDemo: EvaluationVendor[] = [
  {
    id: "VEN-001",
    vendorName: "MediSupply Ltd.",
    technicalScore: 56,
    financialScore: 36,
    totalScore: 92,
    rank: 1,
    bidAmount: 4850000,
    technicalStatus: "Responsive",
  },
  {
    id: "VEN-002",
    vendorName: "HealthTech Traders",
    technicalScore: 52,
    financialScore: 33,
    totalScore: 85,
    rank: 2,
    bidAmount: 4975000,
    technicalStatus: "Responsive",
  },
  {
    id: "VEN-003",
    vendorName: "CarePoint Distributors",
    technicalScore: 46,
    financialScore: 30,
    totalScore: 76,
    rank: 3,
    bidAmount: 5120000,
    technicalStatus: "Partially Responsive",
  },
];

export const awardDemo = {
  recommendedVendor: "MediSupply Ltd.",
  tenderNumber: "TN-ICU-2026-001",
  awardValue: 4850000,
  status: "Recommended",
  reason:
    "Highest combined technical and financial score with a responsive technical submission.",
};

export const purchaseOrderDemo = {
  poNumber: "PO-2026-001",
  vendor: "MediSupply Ltd.",
  tenderNumber: "TN-ICU-2026-001",
  value: 4850000,
  deliveryDate: "2026-10-15",
  status: "Issued",
};

export const contractDemo = {
  contractNumber: "CON-2026-001",
  vendor: "MediSupply Ltd.",
  tenderNumber: "TN-ICU-2026-001",
  poNumber: "PO-2026-001",
  value: 4850000,
  startDate: "2026-09-20",
  endDate: "2027-09-19",
  status: "Active",
};
