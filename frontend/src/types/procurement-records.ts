import type { ProcurementCategory, RequisitionStatus, TenderStatus, TenderType, VendorStatus } from "./procurement";

export type ItemLine = { name: string; specification: string; quantity: number; unit: string; unit_cost: number };
export type ActionEntry = { action: string; status: string; actor: string; at: string; note: string | null };
export type RequisitionForm = { title: string; department: string; category: ProcurementCategory; description: string; required_date: string; estimated_budget: number; items: ItemLine[] };
export type RequisitionRecord = RequisitionForm & { id: number; requisition_number: string; requester: string; status: RequisitionStatus; history: ActionEntry[] | null; tender_id?: number | null };
export type TenderForm = { title: string; category: ProcurementCategory; type: TenderType; scope: string; eligibility: string; closing_date: string; boq: ItemLine[]; documents: string[]; invited_vendor_ids: number[]; requisition_id: number | null };
export type TenderRecord = TenderForm & { id: number; tender_number: string; status: TenderStatus; bid_count: number; requisition_id: number | null; history: ActionEntry[] | null; clarifications: ActionEntry[] | null; addenda: ActionEntry[] | null };
export type VendorRecord = { id: number; name: string; category: ProcurementCategory; status: VendorStatus; performance_score: string | null; document_expiry_alert: string | null; history: ActionEntry[] | null; profile: {
  address: string; contact: string; email: string; phone: string; registration: string; tax: string; bank: string; account: string; verified: boolean; documents: { name: string; status: string; expiry: string | null }[];
} | null };
