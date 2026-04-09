import { createInvoice } from "@/app/dashboard/actions";
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
import { FilePlus2 } from "lucide-react";

export function InvoiceForm() {
  return (
    <Card className="border-border/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FilePlus2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">New invoice</CardTitle>
            <CardDescription>Client, amount, due date — saved as Sent.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={createInvoice} className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="client_name">Client name</Label>
            <Input
              id="client_name"
              name="client_name"
              required
              placeholder="Acme Co."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="2500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due date</Label>
            <Input id="due_date" name="due_date" type="date" required />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit">Create invoice</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
