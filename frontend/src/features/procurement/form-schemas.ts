import { z } from "zod";
import { categories } from "./procurement-options";

const item = z.object({ name: z.string().trim().min(1).max(200), specification: z.string().trim().min(1).max(2000), quantity: z.number().min(0.01).max(100000), unit: z.string().trim().min(1).max(30), unit_cost: z.number().min(0).max(100000000) });
export const requisitionSchema = z.object({ title: z.string().trim().min(1).max(200), department: z.string().trim().min(1).max(150), category: z.enum(categories), description: z.string().trim().min(1).max(5000), required_date: z.string().min(1), estimated_budget: z.number().min(1).max(9999999999999), items: z.array(item).min(1).max(50) });
export const tenderSchema = z.object({ title: z.string().trim().min(1).max(200), category: z.enum(categories), type: z.enum(["public_tender", "invited_tender", "rfq"]), scope: z.string().trim().min(1).max(5000), eligibility: z.string().trim().min(1).max(5000), closing_date: z.string().min(1), boq: z.array(item).min(1).max(50), documents: z.array(z.string().trim().min(1).max(200)).max(20), invited_vendor_ids: z.array(z.number()), requisition_id: z.number().nullable() });
