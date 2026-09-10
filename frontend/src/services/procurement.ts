import axios from "axios";

import {
  DemoDataError,
  demoRequisitionService,
  demoTenderService,
  demoVendorService,
} from "@/demo/demo-store";
import { isDemoMode } from "@/demo/demo-mode";
import { api } from "@/services/api";
import type {
  RequisitionForm,
  RequisitionRecord,
  TenderForm,
  TenderRecord,
  VendorRecord,
} from "@/types/procurement-records";

export const requisitionApi = {
  async list(signal?: AbortSignal) {
    if (isDemoMode) {
      return demoRequisitionService.list();
    }

    return (
      await api.get<{
        data: RequisitionRecord[];
      }>("/requisitions", {
        signal,
      })
    ).data.data;
  },

  async get(id: string, signal?: AbortSignal) {
    if (isDemoMode) {
      return demoRequisitionService.get(id);
    }

    return (
      await api.get<{
        data: RequisitionRecord;
      }>(`/requisitions/${id}`, {
        signal,
      })
    ).data.data;
  },

  async save(data: RequisitionForm, id?: number) {
    if (isDemoMode) {
      return demoRequisitionService.save(data, id);
    }

    return (
      await api.request<{
        data: RequisitionRecord;
      }>({
        url: id ? `/requisitions/${id}` : "/requisitions",
        method: id ? "PUT" : "POST",
        data,
      })
    ).data.data;
  },

  async action(id: number, action: string, note?: string) {
    if (isDemoMode) {
      return demoRequisitionService.action(id, action, note);
    }

    return (
      await api.post<{
        data: RequisitionRecord;
      }>(`/requisitions/${id}/actions`, {
        action,
        note,
      })
    ).data.data;
  },

  async convert(
    id: number,
    data: {
      title: string;
      type: string;
      closing_date: string;
    },
  ) {
    if (isDemoMode) {
      return demoRequisitionService.convert(id, data);
    }

    return (
      await api.post<{
        data: TenderRecord;
      }>(`/requisitions/${id}/convert`, data)
    ).data.data;
  },
};

export const vendorApi = {
  async list(signal?: AbortSignal) {
    if (isDemoMode) {
      return demoVendorService.list();
    }

    return (
      await api.get<{
        data: VendorRecord[];
      }>("/vendors", {
        signal,
      })
    ).data.data;
  },

  async get(id: string, signal?: AbortSignal) {
    if (isDemoMode) {
      return demoVendorService.get(id);
    }

    return (
      await api.get<{
        data: VendorRecord;
      }>(`/vendors/${id}`, {
        signal,
      })
    ).data.data;
  },

  async action(id: number, action: string, note?: string) {
    if (isDemoMode) {
      return demoVendorService.action(id, action, note);
    }

    return (
      await api.post<{
        data: VendorRecord;
      }>(`/vendors/${id}/actions`, {
        action,
        note,
      })
    ).data.data;
  },
};

export const tenderApi = {
  async list(signal?: AbortSignal) {
    if (isDemoMode) {
      return demoTenderService.list();
    }

    return (
      await api.get<{
        data: TenderRecord[];
      }>("/tenders", {
        signal,
      })
    ).data.data;
  },

  async get(id: string, signal?: AbortSignal) {
    if (isDemoMode) {
      return demoTenderService.get(id);
    }

    return (
      await api.get<{
        data: TenderRecord;
      }>(`/tenders/${id}`, {
        signal,
      })
    ).data.data;
  },

  async save(data: TenderForm, id?: number) {
    if (isDemoMode) {
      return demoTenderService.save(data, id);
    }

    return (
      await api.request<{
        data: TenderRecord;
      }>({
        url: id ? `/tenders/${id}` : "/tenders",
        method: id ? "PUT" : "POST",
        data,
      })
    ).data.data;
  },

  async action(
    id: number,
    action: string,
    note?: string,
    closingDate?: string,
  ) {
    if (isDemoMode) {
      return demoTenderService.action(id, action, note, closingDate);
    }

    return (
      await api.post<{
        data: TenderRecord;
      }>(`/tenders/${id}/actions`, {
        action,
        note,
        closing_date: closingDate,
      })
    ).data.data;
  },
};

export function procurementError(error: unknown) {
  if (error instanceof DemoDataError) {
    return error.message;
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return "This record could not be found.";
    }

    const errors = error.response?.data?.errors as
      | Record<string, string[]>
      | undefined;

    if (errors) {
      return Object.values(errors).flat().join(" ");
    }

    if (error.response?.status && error.response.status < 500) {
      return String(
        error.response.data?.message ||
          "This action is unavailable for your account.",
      );
    }
  }

  return "We couldn't connect to the procurement service. Please try again.";
}
