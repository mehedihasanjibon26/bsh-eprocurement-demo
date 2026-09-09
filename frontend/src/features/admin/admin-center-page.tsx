import { useState } from "react";
import {
  Bell,
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
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          ADMINISTRATION
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Admin Center
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review procurement notifications and manage essential workflow
          controls for Bangladesh Specialized Hospital PLC.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Notifications</CardTitle>

                  {unreadCount > 0 && (
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Procurement alerts requiring attention.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={unreadCount === 0}
                onClick={markAllRead}
              >
                <CheckCircle2 className="size-4" />
                Mark All Read
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markNotificationRead(notification.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  notification.read ? "bg-background" : "bg-muted/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                    {notification.type === "warning" ? (
                      <CircleAlert className="size-4 text-amber-600" />
                    ) : notification.type === "success" ? (
                      <CheckCircle2 className="size-4 text-teal-700" />
                    ) : (
                      <Bell className="size-4 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <Badge variant="outline">New</Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Settings</CardTitle>

            <p className="text-xs text-muted-foreground">
              Key procurement configuration for the demo.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <label className="text-xs font-medium">Organization</label>

              <Input
                className="mt-2"
                value={adminControlsDemo.organization}
                disabled
              />
            </div>

            <div>
              <label className="text-xs font-medium">Procurement Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  className="pl-9"
                  value={adminControlsDemo.procurementEmail}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Default Currency</label>

              <Input
                className="mt-2"
                value={adminControlsDemo.currency}
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />

            <CardTitle className="text-base">Procurement Controls</CardTitle>
          </div>

          <p className="text-xs text-muted-foreground">
            Essential controls demonstrated for procurement governance.
          </p>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Approval Required</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Procurement actions require designated approval before
                  progressing.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.approvalRequired}
                onChange={(event) =>
                  updateSetting("approvalRequired", event.target.checked)
                }
                className="mt-1 size-4"
              />
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Vendor Verification</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Vendors must be verified before participating in eligible
                  procurement activities.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.vendorVerificationRequired}
                onChange={(event) =>
                  updateSetting(
                    "vendorVerificationRequired",
                    event.target.checked,
                  )
                }
                className="mt-1 size-4"
              />
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">3-Way Match Required</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  PO, goods receipt, and supplier invoice must align before
                  payment approval.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.threeWayMatchRequired}
                onChange={(event) =>
                  updateSetting("threeWayMatchRequired", event.target.checked)
                }
                className="mt-1 size-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RotateCcw className="size-5 text-primary" />

            <CardTitle className="text-base">Demo Reset</CardTitle>
          </div>

          <p className="text-xs text-muted-foreground">
            Return the interactive procurement demo to a clean
            presentation-ready starting state.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
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
              className="shrink-0"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="size-4" />
              Reset Demo Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <Settings2 className="mt-0.5 size-5 shrink-0 text-primary" />

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
