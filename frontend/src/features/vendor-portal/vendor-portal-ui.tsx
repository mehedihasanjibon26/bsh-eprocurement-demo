import type { ComponentProps, ReactNode } from "react";
import {
  BellRing, Building2, ClipboardCheck, FileCheck2, FileText,
  Gavel, Layers3, ListChecks, ReceiptText, ShieldCheck, ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import {
  Card as SharedCard,
  CardTitle as SharedCardTitle,
} from "@/components/ui/card";
import { Badge as SharedBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "./vendor-portal.css";

export { CardContent, CardHeader } from "@/components/ui/card";

const sectionIcons: Record<string, LucideIcon> = {
  "Open Tenders": Gavel,
  "Attention Required": BellRing,
  "Recent Bid Activity": FileText,
  "Updates & Notifications": BellRing,
  "Contracts & Purchase Orders": ShoppingCart,
  "Company Documents": FileCheck2,
  "Document Status": ShieldCheck,
  "Company Information": Building2,
  "Compliance Overview": ShieldCheck,
  "Supplier Standing": ClipboardCheck,
  "Supplier Acceptance": ClipboardCheck,
  "Contract": FileCheck2,
  "New Supplier Invoice": ReceiptText,
  "Invoice Details": ReceiptText,
  "Current Status": ShieldCheck,
  "Processing Timeline": ListChecks,
  "Payment Details": ReceiptText,
  "Scope of Supply": Layers3,
  "BOQ / Required Items": ListChecks,
  "Vendor Eligibility": ShieldCheck,
  "Required Documents": FileCheck2,
  "Supplier Checklist": ClipboardCheck,
  "Bid Tracking": FileText,
};

export function VendorHero({ children, icon: Icon }: { children: ReactNode; icon: LucideIcon; }) {
  return (
    <section className="vendor-hero">
      <div className="vendor-hero-glow" aria-hidden="true" />
      <span className="vendor-hero-icon" aria-hidden="true"><Icon className="size-6" /></span>
      <div className="relative min-w-0">{children}</div>
    </section>
  );
}

export function Card({ className, ...props }: ComponentProps<typeof SharedCard>) {
  return <SharedCard {...props} className={cn("vendor-card", className)} />;
}

export function CardTitle({ children, className, ...props }: ComponentProps<typeof SharedCardTitle>) {
  const Icon = sectionIcons[typeof children === "string" ? children.trim() : ""] ?? Layers3;
  return (
    <SharedCardTitle {...props} className={cn("vendor-card-title", className)}>
      <span className="vendor-section-icon" aria-hidden="true"><Icon className="size-4" /></span>
      <span>{children}</span>
    </SharedCardTitle>
  );
}

export function Badge({ children, className, ...props }: ComponentProps<typeof SharedBadge>) {
  const status = typeof children === "string" ? children.toLowerCase().replaceAll("_", " ") : "";
  const tone = /expired|withdrawn|rejected|suspended/.test(status) ? "danger"
    : /pending|expiring|awaiting|not issued|unavailable/.test(status) ? "warning"
      : /approved|verified|accepted|active|awarded|paid|published|bidding open|complete/.test(status) ? "success" : "info";
  return <SharedBadge {...props} data-vendor-tone={tone} className={cn("vendor-badge", className)}>{children}</SharedBadge>;
}

export function KpiCard({ title, value, description, icon }: { title: string; value: string; description?: string; icon?: ReactNode; }) {
  const tone = /pending|attention/i.test(title) ? "warning" : /verified|awarded/i.test(title) ? "success" : undefined;
  return (
    <div className="vendor-metric" data-metric-tone={tone}>
      <div className="flex items-start justify-between gap-3">
        <p className="vendor-metric-label">{title}</p>
        {icon && <span className="vendor-metric-icon" aria-hidden="true">{icon}</span>}
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
      {description && <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>}
    </div>
  );
}
