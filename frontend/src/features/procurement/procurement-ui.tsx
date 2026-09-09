import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { procurementError } from "@/services/procurement";
import type { ActionEntry, ItemLine } from "@/types/procurement-records";

import { bdt, categories, date, label } from "./procurement-options";

export function PageHeading({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {back && (
        <Link
          to={back}
          className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 transition hover:text-violet-600"
        >
          <ArrowLeft className="size-3" />
          Back to list
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-indigo-600">
            BSH PROCUREMENT
          </p>

          <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {action}
      </div>
    </div>
  );
}

export function CreateLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Button nativeButton={false} render={<Link to={to} />}>
      <Plus className="size-4" />
      {children}
    </Button>
  );
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function Field({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{title}</span>
      {children}
    </label>
  );
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className="min-h-24 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-normal transition duration-200 hover:border-indigo-300 focus-visible:border-indigo-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100/70 disabled:opacity-50"
    />
  );
}

export function Choice({
  value,
  onChange,
  options,
  title,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  title: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next !== null) {
          onChange(next);
        }
      }}
    >
      <SelectTrigger
        aria-label={title}
        className="h-11 w-full rounded-xl border-slate-200 bg-white px-3 text-[12px] shadow-none transition-all duration-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:via-violet-50/60 hover:to-cyan-50/80 hover:text-indigo-700 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/70 data-[state=open]:border-violet-300 data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-50 data-[state=open]:via-violet-50 data-[state=open]:to-cyan-50"
      >
        <SelectValue>{label(value)}</SelectValue>
      </SelectTrigger>

      <SelectContent className="rounded-xl border-slate-200 bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
        {options.map((item) => (
          <SelectItem
            key={item}
            value={item}
            className="rounded-lg text-[12px] transition-colors focus:bg-gradient-to-r focus:from-indigo-50 focus:via-violet-50 focus:to-cyan-50 focus:text-indigo-700"
          >
            {label(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Filters({
  search,
  onSearch,
  status,
  onStatus,
  statuses,
  category,
  onCategory,
}: {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  statuses: string[];
  category: string;
  onCategory: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
      {/* Search */}
      <div className="group relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-indigo-500 group-focus-within:text-violet-500" />

        <Input
          aria-label="Search records"
          placeholder="Search by name, reference, or department..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-4 text-[12px] shadow-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:via-violet-50/60 hover:to-cyan-50/80 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)] focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100/70"
        />
      </div>

      {/* Status */}
      <div className="group relative">
        <div className="pointer-events-none absolute -top-2 left-3 z-10 hidden rounded-full border border-indigo-100 bg-white px-2 text-[8px] font-semibold tracking-[0.12em] text-indigo-500 shadow-sm group-hover:block">
          STATUS
        </div>

        <Choice
          title="Filter by status"
          value={status}
          onChange={onStatus}
          options={["all_statuses", ...statuses]}
        />
      </div>

      {/* Category */}
      <div className="group relative">
        <div className="pointer-events-none absolute -top-2 left-3 z-10 hidden rounded-full border border-violet-100 bg-white px-2 text-[8px] font-semibold tracking-[0.12em] text-violet-500 shadow-sm group-hover:block">
          CATEGORY
        </div>

        <Choice
          title="Filter by category"
          value={category}
          onChange={onCategory}
          options={["all_categories", ...categories]}
        />
      </div>

      <div className="hidden items-center justify-end gap-1.5 text-[9px] font-medium text-slate-400 sm:col-span-3 sm:flex">
        <SlidersHorizontal className="size-3" />
        Interactive procurement filters
      </div>
    </div>
  );
}

export function QueryState({
  pending,
  error,
  retry,
}: {
  pending: boolean;
  error: unknown;
  retry: () => void;
}) {
  return pending ? (
    <div
      role="status"
      className="rounded-xl border bg-card p-10 text-sm text-muted-foreground"
    >
      Loading procurement records...
    </div>
  ) : (
    <div role="alert">
      <EmptyState
        title="Unable to load this view"
        description={procurementError(error)}
        actionLabel="Retry"
        onAction={retry}
      />
    </div>
  );
}

export function ActionHistory({ entries }: { entries: ActionEntry[] | null }) {
  return !entries?.length ? (
    <EmptyState
      title="No recorded actions yet"
      description="Actions performed in this workspace will appear here."
    />
  ) : (
    <ol className="divide-y">
      {entries.toReversed().map((entry, index) => (
        <li key={`${entry.at}-${index}`} className="py-4">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-medium">{label(entry.action)}</p>

            <p className="text-xs text-muted-foreground">
              {date(entry.at)} - {entry.actor}
            </p>
          </div>

          <p className="mt-1 text-xs text-primary">{label(entry.status)}</p>

          {entry.note && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {entry.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function ItemSummary({ items }: { items: ItemLine[] | null }) {
  return !items?.length ? (
    <EmptyState title="No item lines recorded" />
  ) : (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-medium">
              {index + 1}. {item.name}
            </p>

            <p className="font-semibold text-primary">
              {bdt(item.quantity * item.unit_cost)}
            </p>
          </div>

          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
            {item.specification}
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            {item.quantity} {item.unit} x {bdt(item.unit_cost)}
          </p>
        </div>
      ))}

      <p className="text-right font-semibold">
        Estimated total:{" "}
        {bdt(
          items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0),
        )}
      </p>
    </div>
  );
}

export function ActionDialog({
  title,
  description,
  needsNote = false,
  destructive = false,
  pending,
  onConfirm,
}: {
  title: string;
  description: string;
  needsNote?: boolean;
  destructive?: boolean;
  pending: boolean;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <Button
        variant={destructive ? "destructive" : "outline"}
        disabled={pending}
        onClick={() => {
          setError("");
          setNote("");
          setOpen(true);
        }}
      >
        {title}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!pending) {
            setOpen(value);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");

              try {
                await onConfirm(note);
                setOpen(false);
              } catch (failure) {
                setError(procurementError(failure));
              }
            }}
          >
            <Field
              title={
                needsNote ? "Reason / details (required)" : "Note (optional)"
              }
            >
              <TextArea
                required={needsNote}
                maxLength={2000}
                value={note}
                disabled={pending}
                onChange={(event) => setNote(event.target.value)}
              />
            </Field>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={pending}
                variant={destructive ? "destructive" : "default"}
              >
                {pending ? "Saving..." : title}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
