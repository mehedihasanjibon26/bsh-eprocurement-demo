import type { AdminDashboard } from "@/types/dashboard";
import type {
  ProcurementCategory,
  RequisitionStatus,
  TenderStatus,
  TenderType,
  VendorStatus,
} from "@/types/procurement";
import type {
  ActionEntry,
  RequisitionForm,
  RequisitionRecord,
  TenderForm,
  TenderRecord,
  VendorRecord,
} from "@/types/procurement-records";

const storeKey = "bsh.demo.procurement.store.v1";

type DemoProcurementStore = {
  version: 1;
  requisitions: RequisitionRecord[];
  vendors: VendorRecord[];
  tenders: TenderRecord[];
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function now() {
  return new Date().toISOString();
}

function wait(milliseconds = 120) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function actionEntry(
  action: string,
  status: string,
  actor: string,
  note?: string,
): ActionEntry {
  return {
    action,
    status,
    actor,
    at: now(),
    note: note?.trim() || null,
  };
}

export class DemoDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DemoDataError";
  }
}

const seedRequisitions: RequisitionRecord[] = [
  {
    id: 1,
    requisition_number: "PR-001",
    title: "ICU Equipment Purchase",
    department: "Intensive Care Unit",
    category: "medical_equipment",
    description:
      "Procurement of critical ICU equipment to strengthen respiratory support and bedside monitoring capacity.",
    required_date: "2026-10-15",
    estimated_budget: 5200000,
    requester: "Dr. Farzana Rahman",
    status: "pending_approval",
    tender_id: null,
    items: [
      {
        name: "ICU Ventilator",
        specification:
          "Adult and paediatric ventilator with invasive and non-invasive ventilation modes.",
        quantity: 2,
        unit: "unit",
        unit_cost: 1500000,
      },
      {
        name: "Multiparameter Patient Monitor",
        specification:
          "Bedside monitor supporting ECG, SpO2, NIBP, temperature and respiratory rate.",
        quantity: 4,
        unit: "unit",
        unit_cost: 350000,
      },
      {
        name: "Infusion Pump",
        specification:
          "Programmable volumetric infusion pump suitable for critical-care use.",
        quantity: 5,
        unit: "unit",
        unit_cost: 90000,
      },
    ],
    history: [
      {
        action: "create",
        status: "draft",
        actor: "Dr. Farzana Rahman",
        at: "2026-09-07T03:30:00.000Z",
        note: "Initial ICU equipment requirement recorded.",
      },
      {
        action: "submit",
        status: "pending_approval",
        actor: "Procurement Admin",
        at: "2026-09-08T04:15:00.000Z",
        note: "Submitted for hospital procurement approval.",
      },
    ],
  },
  {
    id: 2,
    requisition_number: "PR-002",
    title: "Annual Diagnostic Reagent Requirement",
    department: "Laboratory Medicine",
    category: "diagnostic_reagents",
    description:
      "Annual requirement for high-volume diagnostic reagents used by the hospital laboratory.",
    required_date: "2026-10-25",
    estimated_budget: 1850000,
    requester: "Dr. Mahmudul Karim",
    status: "approved",
    tender_id: null,
    items: [
      {
        name: "Clinical Chemistry Reagent Set",
        specification:
          "Analyzer-compatible chemistry reagent package for routine hospital diagnostics.",
        quantity: 20,
        unit: "kit",
        unit_cost: 55000,
      },
      {
        name: "Immunoassay Reagent Set",
        specification:
          "Analyzer-compatible immunoassay reagent package with quality controls.",
        quantity: 10,
        unit: "kit",
        unit_cost: 75000,
      },
    ],
    history: [
      {
        action: "create",
        status: "draft",
        actor: "Dr. Mahmudul Karim",
        at: "2026-09-03T05:00:00.000Z",
        note: null,
      },
      {
        action: "submit",
        status: "pending_approval",
        actor: "Procurement Admin",
        at: "2026-09-04T04:00:00.000Z",
        note: null,
      },
      {
        action: "approve",
        status: "approved",
        actor: "Hospital Approver",
        at: "2026-09-05T06:00:00.000Z",
        note: "Approved for sourcing.",
      },
    ],
  },
  {
    id: 3,
    requisition_number: "PR-003",
    title: "Hospital Network Security Upgrade",
    department: "Information Technology",
    category: "it_technology",
    description:
      "Security gateway and network protection upgrade for core hospital IT services.",
    required_date: "2026-11-10",
    estimated_budget: 1250000,
    requester: "IT Operations",
    status: "draft",
    tender_id: null,
    items: [
      {
        name: "Next Generation Firewall",
        specification:
          "Enterprise firewall appliance with threat prevention and centralized administration.",
        quantity: 2,
        unit: "unit",
        unit_cost: 625000,
      },
    ],
    history: [
      {
        action: "create",
        status: "draft",
        actor: "Procurement Admin",
        at: "2026-09-09T03:45:00.000Z",
        note: "Draft requirement prepared with IT department.",
      },
    ],
  },
  {
    id: 4,
    requisition_number: "PR-004",
    title: "HVAC Preventive Maintenance Service",
    department: "Facility Management",
    category: "facility_maintenance",
    description:
      "Preventive maintenance service requirement for critical hospital HVAC systems.",
    required_date: "2026-11-01",
    estimated_budget: 980000,
    requester: "Facility Management",
    status: "revision_required",
    tender_id: null,
    items: [
      {
        name: "HVAC Preventive Maintenance",
        specification:
          "Scheduled preventive maintenance and emergency support for hospital HVAC equipment.",
        quantity: 12,
        unit: "month",
        unit_cost: 81666.67,
      },
    ],
    history: [
      {
        action: "submit",
        status: "pending_approval",
        actor: "Procurement Admin",
        at: "2026-09-06T05:30:00.000Z",
        note: null,
      },
      {
        action: "request_revision",
        status: "revision_required",
        actor: "Hospital Approver",
        at: "2026-09-07T06:20:00.000Z",
        note: "Please clarify emergency response-time requirements.",
      },
    ],
  },
];

const seedVendors: VendorRecord[] = [
  {
    id: 1,
    name: "MediSupply Ltd.",
    category: "medical_equipment",
    status: "approved",
    performance_score: "4.6",
    document_expiry_alert: "Trade License expires within 30 days.",
    profile: {
      address: "Tejgaon Industrial Area, Dhaka, Bangladesh",
      contact: "Md. Imran Hossain",
      email: "procurement@medisupply.example",
      phone: "+880 1700 000101",
      registration: "TRD-MSL-2026-1045",
      tax: "TIN-785421369",
      bank: "Eastern Bank PLC",
      account: "MSL-0123456789",
      verified: true,
      documents: [
        {
          name: "Trade License",
          status: "Verified",
          expiry: "2026-10-10",
        },
        {
          name: "TIN Certificate",
          status: "Verified",
          expiry: null,
        },
        {
          name: "Bank Solvency Certificate",
          status: "Verified",
          expiry: "2027-03-31",
        },
      ],
    },
    history: [
      {
        action: "verify",
        status: "pending_verification",
        actor: "Procurement Admin",
        at: "2026-08-25T04:30:00.000Z",
        note: "Demo tax and banking checks completed.",
      },
      {
        action: "approve",
        status: "approved",
        actor: "Procurement Admin",
        at: "2026-08-26T06:00:00.000Z",
        note: "Approved for hospital procurement participation.",
      },
    ],
  },
  {
    id: 2,
    name: "HealthTech Traders",
    category: "medical_equipment",
    status: "approved",
    performance_score: "4.3",
    document_expiry_alert: null,
    profile: {
      address: "Banani, Dhaka, Bangladesh",
      contact: "Nafis Rahman",
      email: "sales@healthtech.example",
      phone: "+880 1700 000202",
      registration: "TRD-HTT-2026-2088",
      tax: "TIN-438765219",
      bank: "BRAC Bank PLC",
      account: "HTT-9876543210",
      verified: true,
      documents: [
        {
          name: "Trade License",
          status: "Verified",
          expiry: "2027-05-30",
        },
        {
          name: "TIN Certificate",
          status: "Verified",
          expiry: null,
        },
      ],
    },
    history: [
      {
        action: "approve",
        status: "approved",
        actor: "Procurement Admin",
        at: "2026-08-20T04:00:00.000Z",
        note: "Approved supplier.",
      },
    ],
  },
  {
    id: 3,
    name: "CarePoint Distributors",
    category: "medical_consumables",
    status: "approved",
    performance_score: "4.1",
    document_expiry_alert: null,
    profile: {
      address: "Mohakhali, Dhaka, Bangladesh",
      contact: "Samira Ahmed",
      email: "contact@carepoint.example",
      phone: "+880 1700 000303",
      registration: "TRD-CPD-2026-3031",
      tax: "TIN-246813579",
      bank: "City Bank PLC",
      account: "CPD-1029384756",
      verified: true,
      documents: [
        {
          name: "Trade License",
          status: "Verified",
          expiry: "2027-02-15",
        },
        {
          name: "VAT Registration",
          status: "Verified",
          expiry: null,
        },
      ],
    },
    history: [
      {
        action: "approve",
        status: "approved",
        actor: "Procurement Admin",
        at: "2026-08-21T06:30:00.000Z",
        note: null,
      },
    ],
  },
  {
    id: 4,
    name: "Bangla Diagnostic Solutions",
    category: "diagnostic_reagents",
    status: "pending_verification",
    performance_score: null,
    document_expiry_alert: "Banking and tax verification are pending.",
    profile: {
      address: "Dhanmondi, Dhaka, Bangladesh",
      contact: "Tasnim Chowdhury",
      email: "hello@bangladiagnostic.example",
      phone: "+880 1700 000404",
      registration: "TRD-BDS-2026-4044",
      tax: "TIN-975318642",
      bank: "Dutch-Bangla Bank PLC",
      account: "BDS-5647382910",
      verified: false,
      documents: [
        {
          name: "Trade License",
          status: "Submitted",
          expiry: "2027-01-31",
        },
        {
          name: "TIN Certificate",
          status: "Pending Verification",
          expiry: null,
        },
      ],
    },
    history: [
      {
        action: "register",
        status: "pending_verification",
        actor: "Bangla Diagnostic Solutions",
        at: "2026-09-08T05:20:00.000Z",
        note: "Supplier registration submitted.",
      },
    ],
  },
  {
    id: 5,
    name: "MedEquip Bangladesh",
    category: "medical_equipment",
    status: "suspended",
    performance_score: "3.8",
    document_expiry_alert: "Supplier lifecycle review required.",
    profile: {
      address: "Uttara, Dhaka, Bangladesh",
      contact: "Arif Hasan",
      email: "info@medequip.example",
      phone: "+880 1700 000505",
      registration: "TRD-MEB-2026-5055",
      tax: "TIN-159753486",
      bank: "Prime Bank PLC",
      account: "MEB-6758493021",
      verified: true,
      documents: [
        {
          name: "Trade License",
          status: "Verified",
          expiry: "2027-06-30",
        },
      ],
    },
    history: [
      {
        action: "approve",
        status: "approved",
        actor: "Procurement Admin",
        at: "2026-07-15T03:30:00.000Z",
        note: null,
      },
      {
        action: "suspend",
        status: "suspended",
        actor: "Procurement Admin",
        at: "2026-09-01T06:40:00.000Z",
        note: "Temporary lifecycle control example for the demo.",
      },
    ],
  },
];

const seedTenders: TenderRecord[] = [
  {
    id: 1,
    tender_number: "TN-MC-2026-001",
    title: "Medical Consumables Procurement 2026",
    category: "medical_consumables",
    type: "public_tender",
    scope:
      "Supply of routine medical consumables required across clinical departments.",
    eligibility:
      "Approved suppliers with valid trade, tax and relevant healthcare supply documentation.",
    closing_date: "2026-09-18T06:00:00.000Z",
    boq: [
      {
        name: "Disposable Examination Gloves",
        specification: "Medical grade, powder-free, assorted sizes.",
        quantity: 500,
        unit: "box",
        unit_cost: 850,
      },
      {
        name: "Surgical Mask",
        specification: "Three-layer medical surgical mask.",
        quantity: 1000,
        unit: "box",
        unit_cost: 450,
      },
    ],
    documents: [
      "Tender Instructions",
      "Technical Specification",
      "Supplier Declaration",
    ],
    invited_vendor_ids: [],
    requisition_id: null,
    status: "published",
    bid_count: 2,
    clarifications: [],
    addenda: [],
    history: [
      {
        action: "publish",
        status: "published",
        actor: "Procurement Admin",
        at: "2026-09-08T04:30:00.000Z",
        note: "Tender published for approved supplier participation.",
      },
    ],
  },
  {
    id: 2,
    tender_number: "TN-DR-2026-002",
    title: "Diagnostic Reagents Supply",
    category: "diagnostic_reagents",
    type: "public_tender",
    scope:
      "Supply of diagnostic laboratory reagents for routine hospital testing.",
    eligibility:
      "Authorized diagnostic suppliers with valid manufacturer authorization and regulatory documents.",
    closing_date: "2026-09-21T06:00:00.000Z",
    boq: [
      {
        name: "Clinical Chemistry Reagent Set",
        specification: "Analyzer-compatible chemistry reagent package.",
        quantity: 20,
        unit: "kit",
        unit_cost: 55000,
      },
    ],
    documents: ["Technical Specification", "Commercial Schedule"],
    invited_vendor_ids: [],
    requisition_id: null,
    status: "published",
    bid_count: 1,
    clarifications: [],
    addenda: [],
    history: [
      {
        action: "publish",
        status: "published",
        actor: "Procurement Admin",
        at: "2026-09-07T05:15:00.000Z",
        note: null,
      },
    ],
  },
  {
    id: 3,
    tender_number: "TN-HF-2026-003",
    title: "Hospital Furniture Procurement",
    category: "general_supplies",
    type: "rfq",
    scope: "Supply of selected patient-room and administrative furniture.",
    eligibility:
      "Suppliers with relevant institutional furniture supply experience.",
    closing_date: "2026-09-28T06:00:00.000Z",
    boq: [
      {
        name: "Bedside Cabinet",
        specification: "Hospital-grade bedside cabinet with lockable storage.",
        quantity: 25,
        unit: "unit",
        unit_cost: 18000,
      },
    ],
    documents: ["RFQ Schedule"],
    invited_vendor_ids: [2, 3],
    requisition_id: null,
    status: "draft",
    bid_count: 0,
    clarifications: [],
    addenda: [],
    history: [
      {
        action: "create",
        status: "draft",
        actor: "Procurement Admin",
        at: "2026-09-09T04:10:00.000Z",
        note: "Draft sourcing event.",
      },
    ],
  },
  {
    id: 4,
    tender_number: "TN-AM-2026-004",
    title: "Ambulance Maintenance Services",
    category: "professional_services",
    type: "invited_tender",
    scope:
      "Preventive and corrective maintenance service for hospital ambulance vehicles.",
    eligibility:
      "Qualified automotive service providers with emergency vehicle maintenance experience.",
    closing_date: "2026-08-31T06:00:00.000Z",
    boq: [
      {
        name: "Ambulance Maintenance Package",
        specification:
          "Annual maintenance package covering scheduled and emergency support.",
        quantity: 1,
        unit: "service",
        unit_cost: 950000,
      },
    ],
    documents: ["Service Scope", "Commercial Terms"],
    invited_vendor_ids: [1, 2],
    requisition_id: null,
    status: "awarded",
    bid_count: 4,
    clarifications: [],
    addenda: [],
    history: [
      {
        action: "award",
        status: "awarded",
        actor: "Procurement Admin",
        at: "2026-09-02T06:00:00.000Z",
        note: "Award lifecycle example.",
      },
    ],
  },
];

const seedStore: DemoProcurementStore = {
  version: 1,
  requisitions: seedRequisitions,
  vendors: seedVendors,
  tenders: seedTenders,
};

function writeStore(store: DemoProcurementStore) {
  localStorage.setItem(storeKey, JSON.stringify(store));
}

function readStore(): DemoProcurementStore {
  const raw = localStorage.getItem(storeKey);

  if (!raw) {
    const initial = clone(seedStore);
    writeStore(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoProcurementStore>;

    if (
      parsed.version === 1 &&
      Array.isArray(parsed.requisitions) &&
      Array.isArray(parsed.vendors) &&
      Array.isArray(parsed.tenders)
    ) {
      return parsed as DemoProcurementStore;
    }
  } catch {
    // Invalid demo storage falls through to a clean seed.
  }

  const initial = clone(seedStore);
  writeStore(initial);

  return initial;
}

function nextId(records: { id: number }[]) {
  return Math.max(0, ...records.map((record) => record.id)) + 1;
}

function requireRequisition(
  store: DemoProcurementStore,
  id: number,
): RequisitionRecord {
  const record = store.requisitions.find(
    (requisition) => requisition.id === id,
  );

  if (!record) {
    throw new DemoDataError("This requisition could not be found.");
  }

  return record;
}

function requireVendor(store: DemoProcurementStore, id: number): VendorRecord {
  const record = store.vendors.find((vendor) => vendor.id === id);

  if (!record) {
    throw new DemoDataError("This vendor could not be found.");
  }

  return record;
}

function requireTender(store: DemoProcurementStore, id: number): TenderRecord {
  const record = store.tenders.find((tender) => tender.id === id);

  if (!record) {
    throw new DemoDataError("This tender could not be found.");
  }

  return record;
}

function ensureStatus(actual: string, allowed: string[], message: string) {
  if (!allowed.includes(actual)) {
    throw new DemoDataError(message);
  }
}

export function resetDemoProcurementStore() {
  const initial = clone(seedStore);
  writeStore(initial);
  return clone(initial);
}

export const demoRequisitionService = {
  async list(): Promise<RequisitionRecord[]> {
    await wait();
    return clone(readStore().requisitions);
  },

  async get(id: string): Promise<RequisitionRecord> {
    await wait();

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new DemoDataError("This requisition could not be found.");
    }

    return clone(requireRequisition(readStore(), numericId));
  },

  async save(data: RequisitionForm, id?: number): Promise<RequisitionRecord> {
    await wait();

    const store = readStore();

    if (id) {
      const record = requireRequisition(store, id);

      ensureStatus(
        record.status,
        ["draft", "revision_required"],
        "Only draft or revision-required requisitions can be edited.",
      );

      Object.assign(record, clone(data));

      record.history = [
        ...(record.history ?? []),
        actionEntry(
          "update",
          record.status,
          "Procurement Admin",
          "Requisition details updated.",
        ),
      ];

      writeStore(store);

      return clone(record);
    }

    const newId = nextId(store.requisitions);

    const record: RequisitionRecord = {
      ...clone(data),
      id: newId,
      requisition_number: `PR-${String(newId).padStart(3, "0")}`,
      requester: "Procurement Admin",
      status: "draft",
      history: [
        actionEntry(
          "create",
          "draft",
          "Procurement Admin",
          "New procurement requisition created.",
        ),
      ],
      tender_id: null,
    };

    store.requisitions.unshift(record);
    writeStore(store);

    return clone(record);
  },

  async action(
    id: number,
    action: string,
    note?: string,
  ): Promise<RequisitionRecord> {
    await wait();

    const store = readStore();
    const record = requireRequisition(store, id);

    let nextStatus: RequisitionStatus;
    let actor = "Procurement Admin";

    switch (action) {
      case "submit":
        ensureStatus(
          record.status,
          ["draft", "revision_required"],
          "Only draft or revision-required requisitions can be submitted.",
        );
        nextStatus = "pending_approval";
        break;

      case "approve":
        ensureStatus(
          record.status,
          ["pending_approval"],
          "Only pending requisitions can be approved.",
        );
        nextStatus = "approved";
        actor = "Hospital Approver";
        break;

      case "request_revision":
        ensureStatus(
          record.status,
          ["pending_approval"],
          "Only pending requisitions can be returned for revision.",
        );
        nextStatus = "revision_required";
        actor = "Hospital Approver";
        break;

      case "reject":
        ensureStatus(
          record.status,
          ["pending_approval"],
          "Only pending requisitions can be rejected.",
        );
        nextStatus = "rejected";
        actor = "Hospital Approver";
        break;

      default:
        throw new DemoDataError("This requisition action is unavailable.");
    }

    record.status = nextStatus;

    record.history = [
      ...(record.history ?? []),
      actionEntry(action, nextStatus, actor, note),
    ];

    writeStore(store);

    return clone(record);
  },

  async convert(
    id: number,
    data: {
      title: string;
      type: string;
      closing_date: string;
    },
  ): Promise<TenderRecord> {
    await wait();

    const store = readStore();
    const requisition = requireRequisition(store, id);

    ensureStatus(
      requisition.status,
      ["approved"],
      "Only approved requisitions can be converted to a tender.",
    );

    const allowedTypes: TenderType[] = [
      "public_tender",
      "invited_tender",
      "rfq",
    ];

    if (!allowedTypes.includes(data.type as TenderType)) {
      throw new DemoDataError("Please select a valid tender type.");
    }

    const tenderId = nextId(store.tenders);

    const tender: TenderRecord = {
      id: tenderId,
      tender_number: `TN-2026-${String(tenderId).padStart(3, "0")}`,
      title: data.title,
      category: requisition.category,
      type: data.type as TenderType,
      scope: requisition.description,
      eligibility:
        "Supplier must hold valid registration, tax, banking and category-specific procurement documents.",
      closing_date: data.closing_date,
      boq: clone(requisition.items),
      documents: [
        "Tender Instructions",
        "Technical Specification",
        "Commercial Schedule",
      ],
      invited_vendor_ids: [],
      requisition_id: requisition.id,
      status: "draft",
      bid_count: 0,
      history: [
        actionEntry(
          "create_from_requisition",
          "draft",
          "Procurement Admin",
          `Created from ${requisition.requisition_number}.`,
        ),
      ],
      clarifications: [],
      addenda: [],
    };

    store.tenders.unshift(tender);

    requisition.status = "converted";
    requisition.tender_id = tender.id;
    requisition.history = [
      ...(requisition.history ?? []),
      actionEntry(
        "convert",
        "converted",
        "Procurement Admin",
        `Converted to ${tender.tender_number}.`,
      ),
    ];

    writeStore(store);

    return clone(tender);
  },
};

export const demoVendorService = {
  async list(): Promise<VendorRecord[]> {
    await wait();
    return clone(readStore().vendors);
  },

  async get(id: string): Promise<VendorRecord> {
    await wait();

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new DemoDataError("This vendor could not be found.");
    }

    return clone(requireVendor(readStore(), numericId));
  },

  async action(
    id: number,
    action: string,
    note?: string,
  ): Promise<VendorRecord> {
    await wait();

    const store = readStore();
    const vendor = requireVendor(store, id);

    let nextStatus: VendorStatus = vendor.status;

    switch (action) {
      case "verify":
        if (vendor.status === "blacklisted") {
          throw new DemoDataError("A blacklisted vendor cannot be verified.");
        }

        if (!vendor.profile) {
          throw new DemoDataError(
            "Supplier profile information is unavailable.",
          );
        }

        vendor.profile.verified = true;

        if (
          vendor.document_expiry_alert ===
          "Banking and tax verification are pending."
        ) {
          vendor.document_expiry_alert = null;
        }
        break;

      case "approve":
        if (vendor.status === "blacklisted") {
          throw new DemoDataError("A blacklisted vendor cannot be approved.");
        }

        if (!vendor.profile?.verified) {
          throw new DemoDataError(
            "Complete the simulated compliance verification before approving this vendor.",
          );
        }

        nextStatus = "approved";
        vendor.status = nextStatus;
        break;

      case "suspend":
        ensureStatus(
          vendor.status,
          ["approved"],
          "Only an approved vendor can be suspended.",
        );

        nextStatus = "suspended";
        vendor.status = nextStatus;
        break;

      case "blacklist":
        if (vendor.status === "blacklisted") {
          throw new DemoDataError("This vendor is already blacklisted.");
        }

        nextStatus = "blacklisted";
        vendor.status = nextStatus;
        break;

      default:
        throw new DemoDataError("This vendor action is unavailable.");
    }

    vendor.history = [
      ...(vendor.history ?? []),
      actionEntry(action, vendor.status, "Procurement Admin", note),
    ];

    writeStore(store);

    return clone(vendor);
  },
};

export const demoTenderService = {
  async list(): Promise<TenderRecord[]> {
    await wait();
    return clone(readStore().tenders);
  },

  async get(id: string): Promise<TenderRecord> {
    await wait();

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      throw new DemoDataError("This tender could not be found.");
    }

    return clone(requireTender(readStore(), numericId));
  },

  async save(data: TenderForm, id?: number): Promise<TenderRecord> {
    await wait();

    const store = readStore();

    if (id) {
      const record = requireTender(store, id);

      ensureStatus(
        record.status,
        ["draft"],
        "Only draft tenders can be edited.",
      );

      Object.assign(record, clone(data));

      record.history = [
        ...(record.history ?? []),
        actionEntry(
          "update",
          "draft",
          "Procurement Admin",
          "Tender details updated.",
        ),
      ];

      writeStore(store);

      return clone(record);
    }

    const newId = nextId(store.tenders);

    const record: TenderRecord = {
      ...clone(data),
      id: newId,
      tender_number: `TN-2026-${String(newId).padStart(3, "0")}`,
      status: "draft",
      bid_count: 0,
      history: [
        actionEntry(
          "create",
          "draft",
          "Procurement Admin",
          "New sourcing event created.",
        ),
      ],
      clarifications: [],
      addenda: [],
    };

    store.tenders.unshift(record);

    writeStore(store);

    return clone(record);
  },

  async action(
    id: number,
    action: string,
    note?: string,
    closingDate?: string,
  ): Promise<TenderRecord> {
    await wait();

    const store = readStore();
    const tender = requireTender(store, id);

    const active = ["published", "bidding_open"].includes(tender.status);

    switch (action) {
      case "submit":
        ensureStatus(
          tender.status,
          ["draft"],
          "Only a draft tender can be submitted for approval.",
        );

        tender.status = "pending_approval";
        break;

      case "approve":
        ensureStatus(
          tender.status,
          ["pending_approval"],
          "Only a pending tender can be approved.",
        );

        tender.status = "approved";
        break;

      case "publish":
        ensureStatus(
          tender.status,
          ["approved"],
          "Only an approved tender can be published.",
        );

        tender.status = "published";
        break;

      case "clarification":
        if (!active) {
          throw new DemoDataError(
            "Clarifications can only be added to an active tender.",
          );
        }

        tender.clarifications = [
          ...(tender.clarifications ?? []),
          actionEntry(
            "clarification",
            tender.status,
            "Procurement Admin",
            note,
          ),
        ];
        break;

      case "addendum":
        if (!active) {
          throw new DemoDataError(
            "Addenda can only be published for an active tender.",
          );
        }

        tender.addenda = [
          ...(tender.addenda ?? []),
          actionEntry("addendum", tender.status, "Procurement Admin", note),
        ];
        break;

      case "extend_deadline":
        if (!active) {
          throw new DemoDataError(
            "Only an active tender deadline can be extended.",
          );
        }

        if (!closingDate) {
          throw new DemoDataError("A new closing date is required.");
        }

        tender.closing_date = closingDate;
        break;

      case "cancel":
        if (["awarded", "cancelled"].includes(tender.status)) {
          throw new DemoDataError("This tender can no longer be cancelled.");
        }

        tender.status = "cancelled";
        break;

      default:
        throw new DemoDataError("This tender action is unavailable.");
    }

    tender.history = [
      ...(tender.history ?? []),
      actionEntry(
        action,
        tender.status,
        action === "approve" ? "Hospital Approver" : "Procurement Admin",
        note,
      ),
    ];

    writeStore(store);

    return clone(tender);
  },
};

function statusCounts(
  tenders: TenderRecord[],
): AdminDashboard["tender_status"] {
  const statuses: TenderStatus[] = [
    "draft",
    "pending_approval",
    "approved",
    "published",
    "bidding_open",
    "closed",
    "evaluation",
    "awarded",
    "cancelled",
  ];

  return statuses.map((status) => ({
    status,
    count: tenders.filter((tender) => tender.status === status).length,
  }));
}

export async function getDemoAdminDashboard(): Promise<AdminDashboard> {
  await wait();

  const store = readStore();

  const activeTenders = store.tenders.filter((tender) =>
    ["published", "bidding_open"].includes(tender.status),
  );

  const recentActivity: AdminDashboard["recent_activity"] = [
    ...store.requisitions.map((record) => {
      const last = record.history?.at(-1);

      return {
        id: `requisition-${record.id}`,
        kind: "requisition" as const,
        title: record.title,
        reference: record.requisition_number,
        status: record.status,
        updated_at: last?.at ?? null,
      };
    }),

    ...store.tenders.map((record) => {
      const last = record.history?.at(-1);

      return {
        id: `tender-${record.id}`,
        kind: "tender" as const,
        title: record.title,
        reference: record.tender_number,
        status: record.status,
        updated_at: last?.at ?? null,
      };
    }),

    ...store.vendors.map((record) => {
      const last = record.history?.at(-1);

      return {
        id: `vendor-${record.id}`,
        kind: "vendor" as const,
        title: record.name,
        reference: `VEN-${String(record.id).padStart(3, "0")}`,
        status: record.status,
        updated_at: last?.at ?? null,
      };
    }),
  ]
    .sort(
      (a, b) =>
        new Date(b.updated_at ?? 0).getTime() -
        new Date(a.updated_at ?? 0).getTime(),
    )
    .slice(0, 8);

  const alerts: AdminDashboard["alerts"] = [];

  const pendingRequisitions = store.requisitions.filter(
    (record) => record.status === "pending_approval",
  );

  if (pendingRequisitions.length > 0) {
    alerts.push({
      id: "requisition-1",
      title: `${pendingRequisitions.length} requisition${
        pendingRequisitions.length === 1 ? "" : "s"
      } awaiting approval`,
      description:
        "Review pending hospital procurement requests before sourcing can proceed.",
      kind: "approval",
      source: "database",
    });
  }

  store.vendors
    .filter((vendor) => Boolean(vendor.document_expiry_alert))
    .slice(0, 2)
    .forEach((vendor) => {
      alerts.push({
        id: `vendor-${vendor.id}`,
        title: `${vendor.name} requires document attention`,
        description:
          vendor.document_expiry_alert ??
          "Supplier documentation requires review.",
        kind: "document",
        source: "database",
      });
    });

  activeTenders.slice(0, 2).forEach((tender) => {
    alerts.push({
      id: `tender-${tender.id}`,
      title: `${tender.tender_number} is open`,
      description: `Closing deadline: ${new Date(
        tender.closing_date,
      ).toLocaleString("en-BD", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      })}.`,
      kind: "deadline",
      source: "database",
    });
  });

  const demoAlerts: AdminDashboard["alerts"] = [
    {
      id: "demo-contract-renewal",
      title: "Supplier contract milestone approaching",
      description:
        "Illustrative contract milestone alert for the ICU equipment procurement lifecycle.",
      kind: "contract",
      source: "demo",
    },
    {
      id: "demo-payment",
      title: "Invoice payment follow-up",
      description:
        "Illustrative payment monitoring alert after invoice approval and 3-way matching.",
      kind: "payment",
      source: "demo",
    },
  ];

  return {
    generated_at: now(),

    kpis: {
      pending_requisitions: pendingRequisitions.length,
      active_tenders: activeTenders.length,
      approved_vendors: store.vendors.filter(
        (vendor) => vendor.status === "approved",
      ).length,
      under_evaluation: store.tenders.filter(
        (tender) => tender.status === "evaluation",
      ).length,
    },

    tender_status: statusCounts(store.tenders),

    recent_activity: recentActivity,

    alerts,

    tenders: store.tenders.slice(0, 6).map((tender) => ({
      id: tender.id,
      tender_number: tender.tender_number,
      title: tender.title,
      category: tender.category,
      closing_date: tender.closing_date,
      status: tender.status,
      bid_count: tender.bid_count,
    })),

    demo: {
      period: "Mar – Aug 2026",

      activity_trend: [
        {
          month: "Mar",
          requisitions: 8,
          tenders: 4,
        },
        {
          month: "Apr",
          requisitions: 11,
          tenders: 5,
        },
        {
          month: "May",
          requisitions: 9,
          tenders: 6,
        },
        {
          month: "Jun",
          requisitions: 14,
          tenders: 7,
        },
        {
          month: "Jul",
          requisitions: 13,
          tenders: 8,
        },
        {
          month: "Aug",
          requisitions: 16,
          tenders: 9,
        },
      ],

      spend_by_category: [
        {
          category: "Medical Equipment",
          amount: 4850000,
        },
        {
          category: "Medical Consumables",
          amount: 2200000,
        },
        {
          category: "Diagnostic Reagents",
          amount: 1850000,
        },
        {
          category: "IT & Technology",
          amount: 1250000,
        },
        {
          category: "Facility & Maintenance",
          amount: 980000,
        },
      ],

      alerts: demoAlerts,
    },
  };
}

export type {
  ProcurementCategory,
  RequisitionStatus,
  TenderStatus,
  VendorStatus,
};
