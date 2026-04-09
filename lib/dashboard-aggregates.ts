import type { ExpenseRow, InvoiceRow } from "@/types/database";

/** Paid invoice total income and list of paid amounts for tax. */
export function paidInvoiceStats(invoices: InvoiceRow[]) {
  const paid = invoices.filter((i) => i.status === "Paid");
  const amounts = paid.map((i) => Number(i.amount));
  const totalIncome = amounts.reduce((a, b) => a + b, 0);
  return { paid, amounts, totalIncome };
}

export function expensesTotal(expenses: ExpenseRow[]) {
  return expenses.reduce((s, e) => s + Number(e.amount), 0);
}

export function incomeByMonth(invoices: InvoiceRow[]): {
  month: string;
  income: number;
}[] {
  const paid = invoices.filter((i) => i.status === "Paid");
  const map = new Map<string, number>();
  for (const inv of paid) {
    const d = new Date(inv.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + Number(inv.amount));
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, income]) => ({
      month: formatMonthLabel(key),
      income,
    }));
}

function formatMonthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function expensesByCategory(expenses: ExpenseRow[]): {
  name: string;
  value: number;
}[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount));
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
