import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, LoaderCircle, LogOut, Menu, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { BshBrand } from "@/components/bsh-brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/use-auth";
import { roleLabels } from "@/features/auth/roles";
import { workspaces, type Workspace } from "@/app/navigation";
import { cn } from "@/lib/utils";

function WorkspaceNavigation({ workspace, onNavigate }: { workspace: Workspace; onNavigate?: () => void }) {
  const config = workspaces[workspace];
  return <nav aria-label={config.title} className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
    <p className="mb-4 px-3 text-[10px] font-medium tracking-[0.15em] text-sidebar-foreground/50">{config.subtitle}</p>
    <ul className="space-y-1">{config.navigation.map(({ path, label, icon: Icon }) => <li key={path}>
      <NavLink to={`/${workspace}/${path}`} onClick={onNavigate} className={({ isActive }) => cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-accent-foreground", isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}><Icon className="size-[18px]" aria-hidden="true" />{label}</NavLink>
    </li>)}</ul>
  </nav>;
}

function SidebarFooter() {
  return <div className="mx-5 mb-5 shrink-0 rounded-lg border border-sidebar-border p-3 text-sidebar-foreground/65"><p className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground"><ShieldCheck className="size-4 text-sidebar-accent-foreground" />Client demonstration</p><p className="mt-1 text-[11px] leading-relaxed">BSH E-Procurement Portal<br />Sample accounts and data</p></div>;
}

function ApplicationShell({ workspace }: { workspace: Workspace }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { pathname } = useLocation();
  const config = workspaces[workspace];
  const current = config.navigation.find((item) => pathname === `/${workspace}/${item.path}` || pathname.startsWith(`/${workspace}/${item.path}/`));
  if (!user) return null;

  async function signOut() {
    setLoggingOut(true);
    try { await logout(); }
    catch { toast.error("We couldn’t sign you out. Please check your connection and try again."); }
    finally { setLoggingOut(false); }
  }

  return <div className="min-h-dvh bg-background">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:p-3">Skip to content</a>
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="border-b border-sidebar-border px-7 py-7"><BshBrand inverse compact /></div>
      <WorkspaceNavigation workspace={workspace} /><SidebarFooter />
    </aside>
    <div className="flex min-h-dvh flex-col lg:pl-64">
      <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon-lg" className="lg:hidden" aria-label="Open navigation" />}><Menu /></SheetTrigger>
            <SheetContent side="left" className="gap-0 border-sidebar-border bg-sidebar text-sidebar-foreground data-[side=left]:w-[min(20rem,88vw)]">
              <div className="border-b border-sidebar-border p-6"><BshBrand inverse compact /><SheetTitle className="sr-only">{config.title} navigation</SheetTitle><SheetDescription className="sr-only">Choose a section of your procurement workspace.</SheetDescription></div>
              <WorkspaceNavigation workspace={workspace} onNavigate={() => setMobileOpen(false)} /><SidebarFooter />
            </SheetContent>
          </Sheet>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{config.title}</p><p className="hidden text-xs text-muted-foreground xl:block">Bangladesh Specialized Hospital PLC</p></div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <span className="hidden rounded-full border border-accent-foreground/15 bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent-foreground md:inline-flex">DEMO</span>
          <div className="flex items-center gap-2.5 sm:border-l sm:pl-5"><span className="hidden size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold sm:flex" aria-hidden="true">{user.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div className="max-w-28 sm:max-w-48"><p className="truncate text-xs font-semibold sm:text-sm">{user.name}</p><p className="text-[10px] text-muted-foreground sm:text-xs">{roleLabels[user.role]}</p></div></div>
          <Button variant="ghost" className="h-10 px-2 text-muted-foreground" aria-label="Sign out" disabled={loggingOut} onClick={signOut}>{loggingOut ? <LoaderCircle className="animate-spin" /> : <LogOut />}<span className="hidden text-xs sm:inline">Sign out</span></Button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1500px] flex-1 p-5 outline-none sm:p-8 lg:p-10">
        <div className="mb-7 flex items-center gap-2 text-xs text-muted-foreground"><span>{workspace === "vendor" ? "Supplier portal" : "Procurement"}</span><ChevronRight className="size-3" /><span className="text-foreground">{current?.label || "Page not found"}</span></div>
        <Outlet />
      </main>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-4 text-[10px] text-muted-foreground sm:px-8"><span>Bangladesh Specialized Hospital PLC</span><span>E-Procurement Portal · Client demo</span></footer>
    </div>
  </div>;
}

export function InternalShell() { return <ApplicationShell workspace="admin" />; }
export function VendorShell() { return <ApplicationShell workspace="vendor" />; }
