import { api } from "@/services/api";

import type { Requisition, Tender, Vendor } from "@/types/procurement";

type ApiResponse<T> = {
  data: T;
};

type VendorApiRecord = {
  id: number;
  name: string;
  category: Vendor["category"];
  status: Vendor["status"];
  performance_score: string | null;
  document_expiry_alert: string | null;
};

type RequisitionApiRecord = {
  id: number;
  requisition_number: string;
  department: string;
  title: string;
  category: Requisition["category"];
  requester: string;
  estimated_budget: string;
  required_date: string;
  status: Requisition["status"];
};

type TenderApiRecord = {
  id: number;
  tender_number: string;
  title: string;
  category: Tender["category"];
  type: Tender["type"];
  closing_date: string;
  status: Tender["status"];
  bid_count: number;
};

export async function getVendors(): Promise<Vendor[]> {
  const response = await api.get<ApiResponse<VendorApiRecord[]>>("/vendors");

  return response.data.data.map((vendor) => ({
    id: String(vendor.id),
    name: vendor.name,
    category: vendor.category,
    status: vendor.status,
    performanceScore:
      vendor.performance_score === null
        ? undefined
        : Number(vendor.performance_score),
    documentExpiryAlert: vendor.document_expiry_alert ?? undefined,
  }));
}

export async function getRequisitions(): Promise<Requisition[]> {
  const response =
    await api.get<ApiResponse<RequisitionApiRecord[]>>("/requisitions");

  return response.data.data.map((requisition) => ({
    id: requisition.requisition_number,
    department: requisition.department,
    title: requisition.title,
    category: requisition.category,
    requester: requisition.requester,
    estimatedBudget: Number(requisition.estimated_budget),
    requiredDate: requisition.required_date,
    status: requisition.status,
  }));
}

export async function getTenders(): Promise<Tender[]> {
  const response = await api.get<ApiResponse<TenderApiRecord[]>>("/tenders");

  return response.data.data.map((tender) => ({
    id: String(tender.id),
    tenderNumber: tender.tender_number,
    title: tender.title,
    category: tender.category,
    type: tender.type,
    closingDate: tender.closing_date,
    status: tender.status,
    bidCount: tender.bid_count,
  }));
}
