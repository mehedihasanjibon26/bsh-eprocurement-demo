import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/features/auth/use-auth";
import { roleLabels } from "@/features/auth/roles";
import { workspaces, type NavigationItem, type Workspace } from "@/app/navigation";

export function WorkspacePage({ item, workspace }: { item: NavigationItem; workspace: Workspace }) {
  const { user } = useAuth();
  const Icon = item.icon;
  const dashboard = item.path === "dashboard";
  return <div className="space-y-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.label}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{dashboard ? `Welcome, ${user?.name}. This is your ${workspace === "vendor" ? "supplier" : "hospital procurement"} workspace.` : item.description}</p></div><span className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">Module preview</span></div>
    <Card className="py-0 shadow-none"><CardContent className="p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3 border-b pb-6"><span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="size-5" /></span><div><h2 className="text-sm font-semibold">{dashboard ? "Your workspace is ready" : `${item.label} workspace`}</h2><p className="mt-1 text-xs text-muted-foreground">{user ? roleLabels[user.role] : ""} access · {workspaces[workspace].title}</p></div></div>
      <EmptyState title={`${item.label} preview`} description={`${item.description} Module content will be available in a later demo release.`} icon={<Icon className="size-8" />} />
      {dashboard && <div className="mt-7"><p className="mb-3 text-xs font-medium text-muted-foreground">Explore your workspace</p><div className="grid gap-2 sm:grid-cols-3">{workspaces[workspace].navigation.slice(1, 4).map(({ path, label, icon: LinkIcon }) => <Link key={path} to={`/${workspace}/${path}`} className="flex items-center gap-3 rounded-lg border px-4 py-3 text-xs font-medium hover:border-primary/40 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary"><LinkIcon className="size-4 text-primary" />{label}<ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" /></Link>)}</div></div>}
    </CardContent></Card>
  </div>;
}
