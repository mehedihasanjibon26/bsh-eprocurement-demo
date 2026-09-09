import axios from "axios";
import { api } from "./api";
import type { RequisitionForm, RequisitionRecord, TenderForm, TenderRecord, VendorRecord } from "@/types/procurement-records";

export const requisitionApi = {
  list: async (signal?: AbortSignal) => (await api.get<{ data: RequisitionRecord[] }>("/requisitions", { signal })).data.data,
  get: async (id: string, signal?: AbortSignal) => (await api.get<{ data: RequisitionRecord }>(`/requisitions/${id}`, { signal })).data.data,
  save: async (data: RequisitionForm, id?: number) => (await api.request<{ data: RequisitionRecord }>({ url: id ? `/requisitions/${id}` : "/requisitions", method: id ? "PUT" : "POST", data })).data.data,
  action: async (id: number, action: string, note?: string) => (await api.post<{ data: RequisitionRecord }>(`/requisitions/${id}/actions`, { action, note })).data.data,
  convert: async (id: number, data: { title: string; type: string; closing_date: string }) => (await api.post<{ data: TenderRecord }>(`/requisitions/${id}/convert`, data)).data.data,
};

export const vendorApi = {
  list: async (signal?: AbortSignal) => (await api.get<{ data: VendorRecord[] }>("/vendors", { signal })).data.data,
  get: async (id: string, signal?: AbortSignal) => (await api.get<{ data: VendorRecord }>(`/vendors/${id}`, { signal })).data.data,
  action: async (id: number, action: string, note?: string) => (await api.post<{ data: VendorRecord }>(`/vendors/${id}/actions`, { action, note })).data.data,
};

export const tenderApi = {
  list: async (signal?: AbortSignal) => (await api.get<{ data: TenderRecord[] }>("/tenders", { signal })).data.data,
  get: async (id: string, signal?: AbortSignal) => (await api.get<{ data: TenderRecord }>(`/tenders/${id}`, { signal })).data.data,
  save: async (data: TenderForm, id?: number) => (await api.request<{ data: TenderRecord }>({ url: id ? `/tenders/${id}` : "/tenders", method: id ? "PUT" : "POST", data })).data.data,
  action: async (id: number, action: string, note?: string, closing_date?: string) => (await api.post<{ data: TenderRecord }>(`/tenders/${id}/actions`, { action, note, closing_date })).data.data,
};

export function procurementError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) return "This record could not be found.";
    const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
    if (errors) return Object.values(errors).flat().join(" ");
    if (error.response?.status && error.response.status < 500) return String(error.response.data?.message || "This action is unavailable for your account.");
  }
  return "We couldn't connect to the procurement service. Please try again.";
}
