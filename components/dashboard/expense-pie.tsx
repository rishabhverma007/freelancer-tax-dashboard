"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#22c55e",
  "#94a3b8",
];

type Row = { name: string; value: number };

export function ExpensePieChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Expenses by category</CardTitle>
          <CardDescription>Add expenses to see the breakdown.</CardDescription>
        </CardHeader>
        <CardContent className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
          No expense data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">Expenses by category</CardTitle>
        <CardDescription>Optional view of where money goes.</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
