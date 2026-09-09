import {
  Boxes,
  Calculator,
  CircleDollarSign,
  Hash,
  PackageOpen,
  Plus,
  Ruler,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ItemLine } from "@/types/procurement-records";

import { bdt, newItem } from "./procurement-options";
import { Field } from "./procurement-ui";

const itemAccents = [
  {
    line: "from-indigo-500 via-violet-500 to-cyan-400",
    glow: "bg-indigo-400/10",
    number: "from-indigo-500 to-violet-500",
    iconBackground: "from-indigo-500/15 to-violet-400/10",
    iconColor: "text-indigo-600",
  },
  {
    line: "from-cyan-500 via-teal-500 to-emerald-400",
    glow: "bg-cyan-400/10",
    number: "from-cyan-500 to-teal-500",
    iconBackground: "from-cyan-500/15 to-emerald-400/10",
    iconColor: "text-cyan-700",
  },
  {
    line: "from-violet-500 via-fuchsia-500 to-pink-400",
    glow: "bg-violet-400/10",
    number: "from-violet-500 to-fuchsia-500",
    iconBackground: "from-violet-500/15 to-fuchsia-400/10",
    iconColor: "text-violet-600",
  },
];

export function ItemEditor({
  items,
  onChange,
}: {
  items: ItemLine[];
  onChange: (items: ItemLine[]) => void;
}) {
  function update(index: number, patch: Partial<ItemLine>) {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  const estimatedTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0) * Number(item.unit_cost ?? 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Item cards */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const accent = itemAccents[index % itemAccents.length];

          const lineTotal =
            Number(item.quantity ?? 0) * Number(item.unit_cost ?? 0);

          return (
            <fieldset
              key={index}
              className="group relative isolate overflow-hidden rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] sm:p-5"
            >
              {/* Accent */}
              <div
                className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent.line}`}
              />

              <div
                className={`pointer-events-none absolute -right-16 -top-16 -z-10 size-48 rounded-full ${accent.glow} blur-3xl`}
              />

              {/* Item heading */}
              <legend className="sr-only">Item {index + 1}</legend>

              <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-[13px] border border-white/80 bg-gradient-to-br shadow-sm ${accent.iconBackground} ${accent.iconColor}`}
                  >
                    <PackageOpen className="size-[18px]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-semibold tracking-[0.15em] text-slate-400">
                        ITEM LINE
                      </p>

                      <span
                        className={`bg-gradient-to-r ${accent.number} bg-clip-text text-[10px] font-bold text-transparent`}
                      >
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mt-1 text-[13px] font-semibold text-slate-900">
                      {item.name || `Procurement item ${index + 1}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50/60 px-3 py-2 text-right">
                    <p className="text-[8px] font-semibold tracking-[0.12em] text-emerald-600">
                      LINE TOTAL
                    </p>

                    <p className="mt-0.5 text-[12px] font-semibold text-emerald-700">
                      {bdt(lineTotal)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove item ${index + 1}`}
                    disabled={items.length === 1}
                    onClick={() =>
                      onChange(
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="size-9 rounded-xl border border-transparent text-slate-400 transition hover:border-rose-100 hover:bg-gradient-to-br hover:from-rose-50 hover:to-orange-50 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Main item information */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[15px] border border-slate-100 bg-gradient-to-br from-white to-indigo-50/25 p-3.5 transition hover:border-indigo-200">
                  <div className="mb-2.5 flex items-center gap-2 text-indigo-600">
                    <Boxes className="size-3.5" />

                    <span className="text-[8px] font-semibold tracking-[0.13em]">
                      ITEM / SERVICE
                    </span>
                  </div>

                  <Field title="Item / service">
                    <Input
                      required
                      maxLength={200}
                      value={item.name}
                      onChange={(event) =>
                        update(index, {
                          name: event.target.value,
                        })
                      }
                      placeholder="e.g. ICU patient monitor"
                      className="h-11 rounded-xl border-slate-200 bg-white text-[12px] transition-all duration-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-white focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100/70"
                    />
                  </Field>
                </div>

                <div className="rounded-[15px] border border-slate-100 bg-gradient-to-br from-white to-violet-50/25 p-3.5 transition hover:border-violet-200">
                  <div className="mb-2.5 flex items-center gap-2 text-violet-600">
                    <Sparkles className="size-3.5" />

                    <span className="text-[8px] font-semibold tracking-[0.13em]">
                      TECHNICAL SPECIFICATION
                    </span>
                  </div>

                  <Field title="Specification">
                    <Input
                      required
                      maxLength={2000}
                      value={item.specification}
                      onChange={(event) =>
                        update(index, {
                          specification: event.target.value,
                        })
                      }
                      placeholder="Enter required specification"
                      className="h-11 rounded-xl border-slate-200 bg-white text-[12px] transition-all duration-200 hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-white focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-100/70"
                    />
                  </Field>
                </div>
              </div>

              {/* Quantity / unit / cost */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[15px] border border-blue-100/70 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30 p-3.5">
                  <div className="mb-2.5 flex items-center gap-2 text-blue-600">
                    <Hash className="size-3.5" />

                    <span className="text-[8px] font-semibold tracking-[0.13em]">
                      QUANTITY
                    </span>
                  </div>

                  <Field title="Quantity">
                    <Input
                      required
                      type="number"
                      min="0.01"
                      max="100000"
                      step="0.01"
                      value={item.quantity}
                      onChange={(event) =>
                        update(index, {
                          quantity: event.target.valueAsNumber || 0,
                        })
                      }
                      className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-100/70"
                    />
                  </Field>
                </div>

                <div className="rounded-[15px] border border-cyan-100/70 bg-gradient-to-br from-cyan-50/60 via-white to-teal-50/30 p-3.5">
                  <div className="mb-2.5 flex items-center gap-2 text-cyan-700">
                    <Ruler className="size-3.5" />

                    <span className="text-[8px] font-semibold tracking-[0.13em]">
                      UNIT
                    </span>
                  </div>

                  <Field title="Unit">
                    <Input
                      required
                      maxLength={30}
                      value={item.unit}
                      onChange={(event) =>
                        update(index, {
                          unit: event.target.value,
                        })
                      }
                      placeholder="pcs, box, set..."
                      className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50/30 focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-100/70"
                    />
                  </Field>
                </div>

                <div className="rounded-[15px] border border-emerald-100/70 bg-gradient-to-br from-emerald-50/60 via-white to-cyan-50/30 p-3.5">
                  <div className="mb-2.5 flex items-center gap-2 text-emerald-700">
                    <CircleDollarSign className="size-3.5" />

                    <span className="text-[8px] font-semibold tracking-[0.13em]">
                      UNIT COST
                    </span>
                  </div>

                  <Field title="Unit cost (BDT)">
                    <Input
                      required
                      type="number"
                      min="0"
                      max="100000000"
                      step="0.01"
                      value={item.unit_cost}
                      onChange={(event) =>
                        update(index, {
                          unit_cost: event.target.valueAsNumber || 0,
                        })
                      }
                      className="h-11 rounded-xl border-slate-200 bg-white transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/30 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100/70"
                    />
                  </Field>
                </div>
              </div>

              {/* Calculation strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-cyan-50/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Calculator className="size-4 text-indigo-500" />

                  <p className="text-[10px] text-slate-500">
                    {item.quantity || 0} {item.unit || "unit"} ×{" "}
                    {bdt(Number(item.unit_cost ?? 0))}
                  </p>
                </div>

                <p className="text-[11px] font-semibold text-slate-800">
                  Total{" "}
                  <span className="ml-1 text-emerald-700">
                    {bdt(lineTotal)}
                  </span>
                </p>
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex flex-col gap-4 rounded-[18px] border border-slate-100 bg-gradient-to-r from-white via-indigo-50/30 to-cyan-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={items.length >= 50}
          onClick={() => onChange([...items, newItem()])}
          className="h-10 w-fit rounded-xl border-indigo-200 bg-white px-4 text-indigo-600 shadow-sm transition hover:border-violet-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-violet-50 hover:to-cyan-50 hover:text-violet-700"
        >
          <Plus className="size-4" />
          Add item
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-50 text-emerald-700">
            <Calculator className="size-4" />
          </div>

          <div className="text-right">
            <p className="text-[8px] font-semibold tracking-[0.13em] text-slate-400">
              ESTIMATED ITEM TOTAL
            </p>

            <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-emerald-700">
              {bdt(estimatedTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
