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
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary">
          GOVERNANCE & TRACEABILITY
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Audit Log
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review the traceable history of procurement actions, approvals, vendor
          activity, receiving, invoice processing, and payment events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <History className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Recorded Events</p>

              <p className="mt-1 text-xl font-semibold">
                {auditEntriesDemo.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <UserRound className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Actors</p>

              <p className="mt-1 text-xl font-semibold">{uniqueActors}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
              <ShieldCheck className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Modules Tracked</p>

              <p className="mt-1 text-xl font-semibold">{uniqueModules}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">
                Procurement Activity History
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Search actions or filter the audit trail by module.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search audit log..."
                  className="pl-9"
                />
              </div>

              <select
                value={moduleFilter}
                onChange={(event) => setModuleFilter(event.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
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
          {filteredEntries.length === 0 ? (
            <div className="py-14 text-center">
              <FileClock className="mx-auto size-9 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">No audit entries found</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another search term or module.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl border p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                        <FileClock className="size-4 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {entry.action}
                          </p>

                          <Badge variant="outline">{entry.module}</Badge>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {entry.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <UserRound className="size-3.5" />
                            {entry.actor}
                          </span>

                          <span>Role: {entry.role}</span>

                          <span>
                            Reference:{" "}
                            <span className="font-medium text-foreground">
                              {entry.reference}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {formatDateTime(entry.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

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
