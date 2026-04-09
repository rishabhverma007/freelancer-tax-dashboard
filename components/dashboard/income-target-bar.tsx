import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  totalIncome: number;
  targetMonthly: number;
};

export function IncomeTargetBar({ totalIncome, targetMonthly }: Props) {
  const pct =
    targetMonthly > 0
      ? Math.min(100, Math.round((totalIncome / targetMonthly) * 100))
      : 0;

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">Income vs monthly target</CardTitle>
        <CardDescription>
          Paid invoice total this period vs your goal (rolling view for demo).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium tabular-nums">{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Target ${targetMonthly.toLocaleString()} / month · earned $
          {totalIncome.toLocaleString()} (paid)
        </p>
      </CardContent>
    </Card>
  );
}
