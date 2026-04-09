"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { month: string; income: number };

export function IncomeChart({ data }: { data: Point[] }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Income over time</CardTitle>
          <CardDescription>
            Paid invoice amounts by month (by invoice date).
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
          Mark invoices as paid to see your income trend.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">Income over time</CardTitle>
        <CardDescription>
          Paid invoice amounts by month (by invoice date).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value),
                "Income",
              ]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            />
            <Bar
              dataKey="income"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
