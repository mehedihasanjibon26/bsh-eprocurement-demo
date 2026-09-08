import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}

      <h3 className="text-base font-medium">{title}</h3>

      {description && (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
