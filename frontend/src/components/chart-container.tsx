import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function ChartContainer({
  title,
  description,
  children,
}: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">{children}</div>
      </CardContent>
    </Card>
  );
}
