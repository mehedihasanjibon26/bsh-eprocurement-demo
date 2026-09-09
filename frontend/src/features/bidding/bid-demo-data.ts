export type TechnicalBidItem = {
  id: string;
  item: string;
  requirement: string;
  offeredSpecification: string;
  compliance: "Comply" | "Partially Comply" | "Not Comply";
  remarks: string;
};

export type FinancialBidItem = {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

export const bidTenderDemo = {
  id: "1",
  tenderNumber: "TN-ICU-2026-001",
  title: "ICU Equipment Supply 2026",
  closingDate: "2026-09-16",
  status: "Bidding Open",
  vendor: "MediSupply Ltd.",
};

export const technicalBidInitial: TechnicalBidItem[] = [
  {
    id: "TECH-001",
    item: "ICU Ventilator",
    requirement: "Advanced ICU ventilator with adult and pediatric modes",
    offeredSpecification:
      "Multi-mode ICU ventilator with adult and pediatric support",
    compliance: "Comply",
    remarks: "",
  },
  {
    id: "TECH-002",
    item: "Patient Monitor",
    requirement: "Multiparameter bedside patient monitor",
    offeredSpecification:
      "12-inch multiparameter monitor with ECG, SpO2, NIBP, temperature",
    compliance: "Comply",
    remarks: "",
  },
  {
    id: "TECH-003",
    item: "Infusion Pump",
    requirement: "Programmable infusion pump with alarm system",
    offeredSpecification:
      "Programmable infusion pump with configurable alarm settings",
    compliance: "Comply",
    remarks: "",
  },
];

export const financialBidInitial: FinancialBidItem[] = [
  {
    id: "FIN-001",
    item: "ICU Ventilator",
    quantity: 2,
    unit: "Unit",
    unitPrice: 1500000,
  },
  {
    id: "FIN-002",
    item: "Patient Monitor",
    quantity: 4,
    unit: "Unit",
    unitPrice: 350000,
  },
  {
    id: "FIN-003",
    item: "Infusion Pump",
    quantity: 5,
    unit: "Unit",
    unitPrice: 90000,
  },
];

export const supportingDocumentsDemo = [
  "Technical Proposal",
  "Financial Proposal",
  "Product Datasheet",
  "Manufacturer Authorization",
];

export const bidCommercialTermsDemo = {
  vatPercentage: 0,
  deliveryCharge: 0,
  bidValidityDays: 90,
  deliveryPeriod: "30 days from Purchase Order",
  paymentTerms: "As per Bangladesh Specialized Hospital PLC procurement terms",
};
