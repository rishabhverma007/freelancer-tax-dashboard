import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, PiggyBank, ShieldCheck } from "lucide-react";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

type Props = {
  totalIncome: number;
  totalTax: number;
  safeToSpend: number;
};

export function MetricCards({ totalIncome, totalTax, safeToSpend }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-border/80 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total income
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatMoney(totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            From paid invoices only
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Estimated taxes
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatMoney(totalTax)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Auto from paid × your rate
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 overflow-hidden ring-1 ring-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-primary">
            Safe to spend
          </CardTitle>
          <PiggyBank className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-primary">
            {formatMoney(safeToSpend)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Income − tax − expenses
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
