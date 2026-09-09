import { useMemo, useState } from "react";
import {
  Clock3,
  FileClock,
  History,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { auditEntriesDemo } from "@/features/reports/phase8-demo-data";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const modules = useMemo(
    () => Array.from(new Set(auditEntriesDemo.map((entry) => entry.module))),
    [],
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...auditEntriesDemo]
      .filter((entry) => {
        const matchesModule =
          moduleFilter === "all" || entry.module === moduleFilter;

        const matchesSearch =
          query.length === 0 ||
          entry.actor.toLowerCase().includes(query) ||
          entry.action.toLowerCase().includes(query) ||
          entry.reference.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.module.toLowerCase().includes(query);

        return matchesModule && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  }, [moduleFilter, search]);

  const uniqueActors = new Set(auditEntriesDemo.map((entry) => entry.actor))
    .size;

  const uniqueModules = new Set(auditEntriesDemo.map((entry) => entry.module))
    .size;

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111827] via-[#312e81] to-[#0e7490] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-indigo-100">
              <ShieldCheck className="size-3.5 text-cyan-200" />
              GOVERNANCE & TRACEABILITY
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Audit Log</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Review the traceable history of procurement actions, approvals, vendor
              activity, receiving, invoice processing, and payment events.
            </p>
            <p className="mt-5 text-xs font-medium text-cyan-100">Bangladesh Specialized Hospital PLC</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white/10 text-cyan-200"><FileClock className="size-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100">Activity record</p>
              <p className="mt-1 text-sm font-semibold">Read-only demo trail</p>
              <p className="mt-1 text-xs text-slate-200">Actions, actors & references</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative min-w-0 rounded-[22px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:to-cyan-400">
          <CardContent className="flex items-center gap-4 p-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-indigo-100 bg-indigo-100/70 text-indigo-700">
              <History className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Recorded Events</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {auditEntriesDemo.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[22px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-slate-50 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-violet-500 before:to-cyan-400">
          <CardContent className="flex items-center gap-4 p-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-violet-100 bg-violet-100/70 text-violet-700">
              <UserRound className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Actors</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{uniqueActors}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 rounded-[22px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-slate-50 py-0 shadow-[0_12px_35px_rgba(15,23,42,0.05)] ring-0 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-cyan-500 before:to-cyan-400">
          <CardContent className="flex items-center gap-4 p-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-cyan-100 bg-cyan-100/70 text-cyan-700">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Modules Tracked</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{uniqueModules}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
        <CardHeader>
          <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">Audit trail</p>
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">
                Procurement Activity History
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Search actions or filter the audit trail by module.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 rounded-[16px] border border-slate-100 bg-slate-50/80 p-3 sm:flex-row">
              <div className="relative min-w-0 sm:flex-1 2xl:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search audit log..."
                  aria-label="Search audit log"
                  className="h-10 rounded-xl border-slate-200 bg-white pl-9 focus-visible:border-indigo-400 focus-visible:ring-indigo-100"
                />
              </div>

              <select
                aria-label="Filter audit log by module"
                value={moduleFilter}
                onChange={(event) => setModuleFilter(event.target.value)}
                className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none hover:border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All Modules</option>

                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <p role="status" className="text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{filteredEntries.length}</span> of {auditEntriesDemo.length} events
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {moduleFilter !== "all" && <Badge variant="outline" className="rounded-lg border-indigo-100 bg-indigo-50 text-indigo-700">{moduleFilter}</Badge>}
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 className="size-3.5" />Newest first</span>
            </div>
          </div>
          {filteredEntries.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50/50 px-5 py-14 text-center">
              <FileClock className="mx-auto size-12 rounded-[16px] bg-indigo-50 p-2.5 text-indigo-500" />

              <p className="mt-3 text-sm font-medium">No audit entries found</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another search term or module.
              </p>
            </div>
          ) : (
            <ol className="space-y-4" aria-label="Procurement audit events">
              {filteredEntries.map((entry) => (
                <li key={entry.id} className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-4 hover:border-indigo-200 hover:bg-indigo-50/20 sm:p-5">
                  <div className="absolute inset-y-5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-400 to-cyan-400" aria-hidden="true" />
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-600">
                        <FileClock className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                          <Badge variant="outline" className="rounded-lg border-violet-100 bg-violet-50 text-violet-700">{entry.module}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{entry.description}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] text-slate-500 tabular-nums">
                      <Clock3 className="size-3.5" />
                      <time dateTime={entry.timestamp}>{formatDateTime(entry.timestamp)}</time>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {entry.actor.split(" ").slice(0, 2).map((name) => name[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-800"><UserRound className="size-3.5 shrink-0 text-slate-400" />{entry.actor}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Role: {entry.role}</p>
                      </div>
                    </div>
                    <div className="min-w-0 sm:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Reference:{" "}</p>
                      <span className="mt-1 inline-block break-all rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-indigo-700">{entry.reference}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card className="relative min-w-0 rounded-[24px] border border-slate-200/80 bg-white py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-0 [--card-spacing:--spacing(6)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:via-violet-400 before:to-cyan-400">
        <CardContent className="flex items-start gap-3 px-6">
          <ShieldCheck className="size-10 shrink-0 rounded-xl bg-cyan-50 p-2.5 text-cyan-700" />

          <div>
            <p className="text-sm font-medium">Traceable procurement record</p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              This demo audit trail provides a clear chronological view of key
              procurement activities and responsible actors throughout the
              end-to-end workflow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
