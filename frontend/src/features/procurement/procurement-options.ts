import type { ProcurementCategory } from "@/types/procurement";

export const categories: ProcurementCategory[] = ["medical_equipment", "pharmaceuticals", "medical_consumables", "diagnostic_reagents", "laboratory_supplies", "it_technology", "facility_maintenance", "general_supplies", "professional_services"];
export const requisitionStatuses = ["draft", "pending_approval", "revision_required", "approved", "rejected", "converted"];
export const vendorStatuses = ["pending_verification", "approved", "suspended", "blacklisted"];
export const tenderStatuses = ["draft", "pending_approval", "approved", "published", "bidding_open", "closed", "evaluation", "awarded", "cancelled"];
export const tenderTypes = ["public_tender", "invited_tender", "rfq"];
export const newItem = () => ({ name: "", specification: "", quantity: 1, unit: "unit", unit_cost: 0 });
export function label(value: string) { return value === "rfq" ? "RFQ" : value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
export function bdt(value: number | string) { return `BDT ${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`; }
export function date(value: string | null | undefined) { return value ? new Date(value).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "short", year: "numeric" }) : "Not recorded"; }
export function dhakaInput(value: string) { return new Date(new Date(value).getTime() + 6 * 3600000).toISOString().slice(0, 16); }
export function closingIso(value: string) { return new Date(`${value}:00+06:00`).toISOString(); }
