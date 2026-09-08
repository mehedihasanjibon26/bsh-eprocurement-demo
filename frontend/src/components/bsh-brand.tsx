import { Hospital } from "lucide-react";
import { cn } from "@/lib/utils";

export function BshBrand({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground", inverse && "bg-white/10 text-white ring-1 ring-white/20")}>
        <Hospital className="size-6" aria-hidden="true" />
      </span>
      <div className={cn("min-w-0", inverse && "text-white")}>
        <p className={cn("font-semibold tracking-tight", compact ? "text-xl" : "max-w-64 text-base leading-snug")}>{compact ? "BSH" : "Bangladesh Specialized Hospital PLC"}</p>
        <p className={cn("mt-0.5 text-xs", inverse ? "text-white/65" : "text-muted-foreground")}>{compact ? "E-Procurement Portal" : "E-PROCUREMENT PORTAL"}</p>
      </div>
    </div>
  );
}
