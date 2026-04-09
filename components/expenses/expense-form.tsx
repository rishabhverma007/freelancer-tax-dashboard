import { createExpense } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Receipt } from "lucide-react";

export function ExpenseForm() {
  return (
    <Card className="border-border/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">Add expense</CardTitle>
            <CardDescription>
              Deductible flag is for your records; totals still subtract full
              amount from safe-to-spend.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          action={createExpense}
          className="grid gap-4 sm:grid-cols-2 sm:items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              required
              placeholder="Software, travel…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense_amount">Amount ($)</Label>
            <Input
              id="expense_amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="120"
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="deduct"
              name="is_tax_deductible"
              value="on"
              className="h-4 w-4 rounded border border-input"
            />
            <Label htmlFor="deduct" className="font-normal cursor-pointer">
              Tax deductible
            </Label>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add expense</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
