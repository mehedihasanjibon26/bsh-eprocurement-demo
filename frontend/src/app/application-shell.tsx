import { useState } from "react";
import {
  ChevronRight,
  LoaderCircle,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

import bshLogoHorizontal from "@/assets/branding/bsh-logo-horizontal.png";
import bshLogoSquare from "@/assets/branding/bsh-logo-square.png";
import { workspaces, type Workspace } from "@/app/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  canAccessInternalPath,
  roleLabels,
  workspacePath,
} from "@/features/auth/roles";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/procurement";

const internalRoleNavigation: Partial<Record<UserRole, string[]>> = {
  admin: [
    "dashboard",
    "requisitions",
    "vendors",
    "tenders",
    "evaluation",
    "purchase-orders",
    "contracts",
    "delivery-receipts",
    "invoices-payments",
    "reports",
    "audit-log",
    "admin-center",
  ],

  approver: ["dashboard", "requisitions", "tenders", "evaluation", "audit-log"],

  evaluator: ["dashboard", "tenders", "evaluation", "audit-log"],

  management_viewer: ["dashboard", "reports", "audit-log"],
};

function getNavigation(workspace: Workspace, role: UserRole) {
  const navigation = workspaces[workspace].navigation;

  if (workspace === "vendor") {
    return navigation;
  }

  const allowedPaths = internalRoleNavigation[role] ?? [];

  return navigation.filter((item) => allowedPaths.includes(item.path));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function handleNavPointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();

  const x = event.clientX - rect.left;

  const y = event.clientY - rect.top;

  event.currentTarget.style.setProperty("--mouse-x", `${x}px`);

  event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
}

function WorkspaceBrand({ workspace }: { workspace: Workspace }) {
  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.09] blur-3xl" />

        <div className="relative flex h-[88px] items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.018] px-2 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <img
            src={bshLogoHorizontal}
            alt="Bangladesh Specialized Hospital PLC"
            className="h-full w-full scale-[2.25] object-contain object-center drop-shadow-[0_6px_20px_rgba(255,255,255,0.12)]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.19em] text-cyan-200/70">
            E-PROCUREMENT PORTAL
          </p>

          <p className="mt-1 text-[10px] text-white/38">
            {workspace === "vendor"
              ? "Supplier workspace"
              : "Internal procurement"}
          </p>
        </div>

        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200/80">
          <Sparkles className="size-3.5" />
        </div>
      </div>
    </div>
  );
}

function WorkspaceNavigation({
  workspace,
  role,
  onNavigate,
}: {
  workspace: Workspace;
  role: UserRole;
  onNavigate?: () => void;
}) {
  const config = workspaces[workspace];

  const navigation = getNavigation(workspace, role);

  return (
    <nav
      aria-label={config.title}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
    >
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[9px] font-semibold tracking-[0.17em] text-white/35">
          {config.subtitle}
        </p>

        <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-300/30" />
      </div>

      <ul className="space-y-1.5">
        {navigation.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={`/${workspace}/${path}`}
              onClick={onNavigate}
              onPointerMove={handleNavPointerMove}
              className={({ isActive }) =>
                cn(
                  "group relative flex min-h-[48px] items-center gap-3 overflow-hidden rounded-[14px] border px-2.5 py-2 text-[12px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
                  isActive
                    ? "border-white/10 bg-gradient-to-r from-indigo-500/30 via-violet-500/25 to-cyan-500/20 text-white shadow-[0_10px_30px_rgba(15,23,42,0.22)]"
                    : "border-transparent text-white/58 hover:border-white/[0.08] hover:bg-white/[0.045] hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Mouse-follow color glow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(130px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34,211,238,0.20) 0%, rgba(99,102,241,0.12) 35%, rgba(139,92,246,0.06) 55%, transparent 75%)",
                    }}
                  />

                  {/* Active left accent */}
                  {isActive && (
                    <>
                      <span className="absolute inset-y-2 left-0 z-[1] w-[3px] rounded-full bg-gradient-to-b from-violet-400 via-indigo-400 to-cyan-300" />

                      <span className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-cyan-300/10 blur-xl" />
                    </>
                  )}

                  {/* Icon */}
                  <span
                    className={cn(
                      "relative z-[2] flex size-9 shrink-0 items-center justify-center rounded-[11px] border transition-all duration-200",
                      isActive
                        ? "border-white/10 bg-white/10 text-cyan-100 shadow-inner"
                        : "border-white/[0.05] bg-white/[0.035] text-white/45 group-hover:border-cyan-300/15 group-hover:bg-white/[0.09] group-hover:text-cyan-100",
                    )}
                  >
                    <Icon
                      className="size-[17px] transition-transform duration-200 group-hover:scale-[1.06]"
                      aria-hidden="true"
                    />
                  </span>

                  {/* Label */}
                  <span className="relative z-[2] min-w-0 flex-1 truncate transition-colors duration-200">
                    {label}
                  </span>

                  {/* Arrow */}
                  <ChevronRight
                    className={cn(
                      "relative z-[2] size-3.5 shrink-0 transition-all duration-200",
                      isActive
                        ? "translate-x-0 text-cyan-200/80 opacity-100"
                        : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:text-cyan-200/70 group-hover:opacity-100",
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SidebarFooter({ role }: { role: UserRole }) {
  return (
    <div className="mx-4 mb-4 shrink-0">
      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.045] to-cyan-300/[0.04] p-4">
        <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-200">
            <ShieldCheck className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/85">
              Client demonstration
            </p>

            <p className="mt-1 text-[9px] leading-4 text-white/38">
              Sample procurement data and controlled workflows
            </p>

            <span className="mt-2 inline-flex rounded-full border border-white/[0.07] bg-white/[0.05] px-2 py-1 text-[8px] font-semibold tracking-wide text-cyan-100/65">
              {roleLabels[role]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationShell({ workspace }: { workspace: Workspace }) {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const { pathname } = useLocation();

  if (!user) {
    return null;
  }

  if (workspace === "admin" && !canAccessInternalPath(user.role, pathname)) {
    return <Navigate to={workspacePath(user.role)} replace />;
  }

  const config = workspaces[workspace];

  const navigation = getNavigation(workspace, user.role);

  const current = navigation.find(
    (item) =>
      pathname === `/${workspace}/${item.path}` ||
      pathname.startsWith(`/${workspace}/${item.path}/`),
  );

  async function signOut() {
    setLoggingOut(true);

    try {
      await logout();
    } catch {
      toast.error(
        "We couldn't sign you out. Please check your connection and try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const initials = getInitials(user.name);

  return (
    <div className="min-h-dvh bg-[#f6f8fc]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-xl"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col overflow-hidden bg-[#080d1a] text-white shadow-[18px_0_50px_rgba(15,23,42,0.08)] lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 size-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-cyan-400/[0.07] blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:26px_26px] opacity-30" />
        </div>

        <div className="relative shrink-0 border-b border-white/[0.07] px-4 py-4">
          <WorkspaceBrand workspace={workspace} />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <WorkspaceNavigation workspace={workspace} role={user.role} />

          <SidebarFooter role={user.role} />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex min-h-[78px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-lg"
                      className="rounded-xl border-slate-200 bg-white shadow-sm lg:hidden"
                      aria-label="Open navigation"
                    />
                  }
                >
                  <Menu className="size-5" />
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="gap-0 border-white/10 bg-[#080d1a] p-0 text-white data-[side=left]:w-[min(19rem,88vw)]"
                >
                  <div className="relative border-b border-white/[0.07] p-4">
                    <WorkspaceBrand workspace={workspace} />

                    <SheetTitle className="sr-only">
                      {config.title} navigation
                    </SheetTitle>

                    <SheetDescription className="sr-only">
                      Choose a section of your procurement workspace.
                    </SheetDescription>
                  </div>

                  <WorkspaceNavigation
                    workspace={workspace}
                    role={user.role}
                    onNavigate={() => setMobileOpen(false)}
                  />

                  <SidebarFooter role={user.role} />
                </SheetContent>
              </Sheet>

              <div className="hidden size-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] border border-slate-200 bg-white p-1.5 shadow-[0_6px_20px_rgba(15,23,42,0.06)] sm:flex lg:hidden xl:flex">
                <img
                  src={bshLogoSquare}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-semibold tracking-[-0.015em] text-slate-900 sm:text-base">
                    {current?.label ?? config.title}
                  </p>

                  <span className="hidden size-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 sm:block" />
                </div>

                <p className="mt-0.5 hidden max-w-xl truncate text-[10px] text-slate-400 sm:block">
                  {current?.description ??
                    "Bangladesh Specialized Hospital PLC"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50 to-cyan-50 px-3 py-1.5 md:flex">
                <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]" />

                <span className="text-[8px] font-semibold tracking-[0.13em] text-indigo-600">
                  DEMO ENVIRONMENT
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-[14px] border border-slate-100 bg-white px-2 py-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] sm:px-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 text-[10px] font-semibold text-white shadow-[0_6px_18px_rgba(99,102,241,0.2)]"
                  aria-hidden="true"
                >
                  {initials}
                </div>

                <div className="hidden max-w-40 sm:block">
                  <p className="truncate text-[11px] font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <p className="mt-0.5 truncate text-[9px] text-slate-400">
                    {roleLabels[user.role]}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Sign out"
                title="Sign out"
                disabled={loggingOut}
                onClick={signOut}
              >
                {loggingOut ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1600px] flex-1 p-4 outline-none sm:p-6 lg:p-8 xl:p-9"
        >
          <div className="mb-6 flex min-w-0 items-center gap-2 px-1 text-[10px] font-medium text-slate-400">
            <span className="truncate">
              {workspace === "vendor" ? "Supplier Portal" : "Procurement"}
            </span>

            <ChevronRight className="size-3 shrink-0 text-slate-300" />

            <span className="truncate font-semibold text-slate-700">
              {current?.label ?? "Workspace"}
            </span>
          </div>

          <Outlet />
        </main>

        <footer className="border-t border-slate-200/70 bg-white/60 px-5 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 text-[9px] text-slate-400">
            <span>Bangladesh Specialized Hospital PLC</span>

            <div className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-emerald-500" />

              <span>E-Procurement Portal · Client Demo</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function InternalShell() {
  return <ApplicationShell workspace="admin" />;
}

export function VendorShell() {
  return <ApplicationShell workspace="vendor" />;
}
