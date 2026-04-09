"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleInvoicePaid } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceRow } from "@/types/database";
import { InvoicePdfButton } from "@/components/invoices/invoice-pdf-button";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function statusBadge(status: InvoiceRow["status"]) {
  if (status === "Paid")
    return <Badge variant="success">Paid</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

export function InvoiceTable({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => {
            const paid = inv.status === "Paid";
            return (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.client_name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(Number(inv.amount))}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {inv.due_date}
                </TableCell>
                <TableCell>{statusBadge(inv.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <InvoicePdfButton
                      clientName={inv.client_name}
                      amount={Number(inv.amount)}
                      dueDate={inv.due_date}
                      status={inv.status}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant={paid ? "secondary" : "default"}
                      disabled={pending}
                      onClick={() => {
                        startTransition(async () => {
                          await toggleInvoicePaid(inv.id, paid);
                          router.refresh();
                        });
                      }}
                    >
                      {paid ? "Mark unpaid" : "Mark paid"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
