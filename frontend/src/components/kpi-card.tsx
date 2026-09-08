import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
};

export function KpiCard({ title, value, description, icon }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>

      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
