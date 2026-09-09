import { useState } from "react";
import {
  Bell,
  Building2,
  WalletCards,
  CheckCircle2,
  CircleAlert,
  Mail,
  RotateCcw,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetDemoLocalState } from "@/lib/demo-reset";

import {
  adminControlsDemo,
  notificationsDemo,
  type NotificationDemo,
} from "@/features/reports/phase8-demo-data";

type AdminSettings = {
  approvalRequired: boolean;
  vendorVerificationRequired: boolean;
  threeWayMatchRequired: boolean;
};

function getInitialSettings(): AdminSettings {
  const saved = localStorage.getItem("bsh-phase8-admin-settings");

  if (saved) {
    try {
      return JSON.parse(saved) as AdminSettings;
    } catch {
      localStorage.removeItem("bsh-phase8-admin-settings");
    }
  }

  return {
    approvalRequired: adminControlsDemo.approvalRequired,
    vendorVerificationRequired: adminControlsDemo.vendorVerificationRequired,
    threeWayMatchRequired: adminControlsDemo.threeWayMatchRequired,
  };
}

function getInitialNotifications() {
  const saved = localStorage.getItem("bsh-phase8-notifications");

  if (saved) {
    try {
      return JSON.parse(saved) as NotificationDemo[];
    } catch {
      localStorage.removeItem("bsh-phase8-notifications");
    }
  }

  return notificationsDemo;
}

export function AdminCenterPage() {
  const [settings, setSettings] = useState<AdminSettings>(getInitialSettings);

  const [notifications, setNotifications] = useState<NotificationDemo[]>(
    getInitialNotifications,
  );

  const [resetOpen, setResetOpen] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  function updateSetting(key: keyof AdminSettings, value: boolean) {
    const next = {
      ...settings,
      [key]: value,
    };

    setSettings(next);

    localStorage.setItem("bsh-phase8-admin-settings", JSON.stringify(next));

    toast.success("Admin setting updated");
  }

  function markAllRead() {
    const next = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(next);

    localStorage.setItem("bsh-phase8-notifications", JSON.stringify(next));

    toast.success("All notifications marked as read");
  }

  function markNotificationRead(id: string) {
    const next = notifications.map((notification) =>
      notification.id === id
        ? {
          ...notification,
          read: true,
        }
        : notification,
    );

    setNotifications(next);

    localStorage.setItem("bsh-phase8-notifications", JSON.stringify(next));
  }

  function resetDemo() {
    resetDemoLocalState();

    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 150);
  }

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-indigo-100">
              <Settings2 className="size-3.5 text-cyan-200" />
              ADMINISTRATION
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin Center</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Review procurement notifications and manage essential workflow
              controls for Bangladesh Specialized Hospital PLC.
            </p>
            <p className="mt-5 text-xs font-medium text-cyan-100">Notifications &middot; Organization &middot; Procurement controls</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white/10 text-cyan-200"><ShieldCheck className="size-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100">Control center</p>
              <p className="mt-1 text-sm font-semibold">Demo configuration</p>
              <p className="mt-1 text-xs text-slate-200">BSH procurement administration</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative min-w-0 rounded-[22px] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-amber-400 before:to-orange-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col lg:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-amber-100/70 text-amber-700"><Bell className="size-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Unread notifications</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{unreadCount}</p>
              <p className="mt-1 text-[11px] text-slate-500">{notifications.length} total notifications</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative min-w-0 rounded-[22px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:to-violet-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col lg:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-indigo-100/70 text-indigo-700"><ShieldCheck className="size-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Enabled demo controls</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{[settings.approvalRequired, settings.vendorVerificationRequired, settings.threeWayMatchRequired].filter(Boolean).length}<span className="ml-1 text-base font-medium text-slate-400">/ 3</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Procurement policy settings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative min-w-0 rounded-[22px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50/40 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-cyan-500 before:to-teal-400">
          <CardContent className="flex items-start gap-4 p-5 sm:flex-col lg:flex-row">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-cyan-100/70 text-cyan-700"><WalletCards className="size-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Procurement currency</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{adminControlsDemo.currency}</p>
              <p className="mt-1 text-[11px] text-slate-500">Organization default</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="mr-1 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Bell className="size-5" /></div>
                  <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Notifications</CardTitle>

                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="rounded-lg border border-amber-100 bg-amber-50 text-amber-800">{unreadCount} unread</Badge>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Procurement alerts requiring attention.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 rounded-xl border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                disabled={unreadCount === 0}
                onClick={markAllRead}
              >
                <CheckCircle2 className="size-4" />
                Mark All Read
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {notifications.length === 0 && (
              <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center">
                <Bell className="mx-auto size-8 text-indigo-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">No notifications</p>
                <p className="mt-1 text-xs text-slate-500">Procurement alerts will appear here.</p>
              </div>
            )}
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markNotificationRead(notification.id)}
                className={`w-full rounded-[18px] border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${notification.read ? "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50" : notification.type === "warning" ? "border-amber-200/70 bg-amber-50/50 hover:bg-amber-50" : "border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[14px] border ${notification.type === "warning" ? "border-amber-100 bg-amber-100/60" : notification.type === "success" ? "border-emerald-100 bg-emerald-50" : "border-indigo-100 bg-white"}`}>
                    {notification.type === "warning" ? (
                      <CircleAlert className="size-4 text-amber-600" />
                    ) : notification.type === "success" ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <Bell className="size-4 text-indigo-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <Badge variant="outline" className="rounded-md border-indigo-100 bg-white text-indigo-700">New</Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-[11px] font-medium text-slate-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><Building2 className="size-5" /></div>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Organization Settings</CardTitle>

            <p className="text-xs text-muted-foreground">
              Key procurement configuration for the demo.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="rounded-xl border border-cyan-100 bg-cyan-50/50 px-3 py-2 text-[11px] font-medium text-cyan-800">Organization defaults &middot; Read only in this demo</p>
            <div>
              <label htmlFor="admin-organization" className="text-xs font-medium text-slate-600">Organization</label>

              <Input
                className="mt-2 h-11 rounded-xl border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100"
                id="admin-organization"
                value={adminControlsDemo.organization}
                disabled
              />
            </div>

            <div>
              <label htmlFor="admin-email" className="text-xs font-medium text-slate-600">Procurement Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  className="h-11 rounded-xl border-slate-200 pl-9 text-sm disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100"
                  id="admin-email"
                  value={adminControlsDemo.procurementEmail}
                  disabled
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-currency" className="text-xs font-medium text-slate-600">Default Currency</label>

              <Input
                className="mt-2 h-11 rounded-xl border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100"
                id="admin-currency"
                value={adminControlsDemo.currency}
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck className="size-5" /></div>

            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Procurement Controls</CardTitle>
          </div>

          <p className="text-xs text-muted-foreground">
            Essential controls demonstrated for procurement governance.
          </p>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div className={`rounded-[18px] border p-5 ${settings.approvalRequired ? "border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-cyan-50/30" : "border-slate-200 bg-slate-50/70"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="admin-approvalRequired" className="cursor-pointer text-sm font-semibold text-slate-800">Approval Required</label>
                <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${settings.approvalRequired ? "text-emerald-700" : "text-slate-500"}`}>{settings.approvalRequired ? "Enabled" : "Disabled"}</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Procurement actions require designated approval before
                  progressing.
                </p>
              </div>

              <input
                type="checkbox"
                id="admin-approvalRequired"
                checked={settings.approvalRequired}
                onChange={(event) =>
                  updateSetting("approvalRequired", event.target.checked)
                }
                className="mt-1 size-5 shrink-0 cursor-pointer rounded accent-indigo-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className={`rounded-[18px] border p-5 ${settings.vendorVerificationRequired ? "border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-cyan-50/30" : "border-slate-200 bg-slate-50/70"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="admin-vendorVerificationRequired" className="cursor-pointer text-sm font-semibold text-slate-800">Vendor Verification</label>
                <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${settings.vendorVerificationRequired ? "text-emerald-700" : "text-slate-500"}`}>{settings.vendorVerificationRequired ? "Enabled" : "Disabled"}</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Vendors must be verified before participating in eligible
                  procurement activities.
                </p>
              </div>

              <input
                type="checkbox"
                id="admin-vendorVerificationRequired"
                checked={settings.vendorVerificationRequired}
                onChange={(event) =>
                  updateSetting(
                    "vendorVerificationRequired",
                    event.target.checked,
                  )
                }
                className="mt-1 size-5 shrink-0 cursor-pointer rounded accent-indigo-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className={`rounded-[18px] border p-5 ${settings.threeWayMatchRequired ? "border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-cyan-50/30" : "border-slate-200 bg-slate-50/70"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="admin-threeWayMatchRequired" className="cursor-pointer text-sm font-semibold text-slate-800">3-Way Match Required</label>
                <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${settings.threeWayMatchRequired ? "text-emerald-700" : "text-slate-500"}`}>{settings.threeWayMatchRequired ? "Enabled" : "Disabled"}</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  PO, goods receipt, and supplier invoice must align before
                  payment approval.
                </p>
              </div>

              <input
                type="checkbox"
                id="admin-threeWayMatchRequired"
                checked={settings.threeWayMatchRequired}
                onChange={(event) =>
                  updateSetting("threeWayMatchRequired", event.target.checked)
                }
                className="mt-1 size-5 shrink-0 cursor-pointer rounded accent-indigo-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative min-w-0 rounded-[24px] border border-rose-200/70 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-rose-400 before:via-red-400 before:to-orange-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><RotateCcw className="size-5" /></div>

            <CardTitle className="text-base font-semibold tracking-tight text-slate-900">Demo Reset</CardTitle>
          </div>

          <p className="text-xs text-muted-foreground">
            Return the interactive procurement demo to a clean
            presentation-ready starting state.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5 rounded-[18px] border border-rose-100 bg-gradient-to-r from-rose-50/70 to-orange-50/30 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-medium">Reset Demo Progress</p>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                Clears saved bid progress, award and PO states, contract
                progress, delivery and receipt status, invoice and payment
                progress, notifications, and demo settings. Your current login
                session will remain available.
              </p>
            </div>

            <Button
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-800"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="size-4" />
              Reset Demo Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
        <CardContent className="flex items-start gap-3 px-6">
          <Settings2 className="size-10 shrink-0 rounded-xl bg-cyan-50 p-2.5 text-cyan-700" />

          <div>
            <p className="text-sm font-medium">Demo administration coverage</p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              These controls demonstrate the intended administration experience.
              Production implementation can later connect organization settings,
              notification channels, approval policy, and permission management
              to backend services.
            </p>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset demo progress?"
        description="This will clear the interactive demo progress created in the browser and return the workflow to its initial presentation state. Your login session will not be removed."
        confirmLabel="Reset Demo"
        destructive
        onConfirm={resetDemo}
      />
    </div>
  );
}
