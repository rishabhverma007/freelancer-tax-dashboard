import { createClient } from "@/lib/supabase/server";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { IncomeTargetBar } from "@/components/dashboard/income-target-bar";
import { IncomeChart } from "@/components/dashboard/income-chart";
import { ExpensePieChart } from "@/components/dashboard/expense-pie";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { ExpenseForm } from "@/components/expenses/expense-form";
import {
  expensesByCategory,
  expensesTotal,
  incomeByMonth,
  paidInvoiceStats,
} from "@/lib/dashboard-aggregates";
import {
  safeToSpend,
  totalTaxFromPaidInvoices,
} from "@/lib/tax";
import type { ExpenseRow, InvoiceRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: invoicesRaw }, { data: expensesRaw }] =
    await Promise.all([
      supabase
        .from("users")
        .select("estimated_tax_rate, target_monthly_income")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const rate = Number(profile?.estimated_tax_rate ?? 0);
  const target = Number(profile?.target_monthly_income ?? 0);
  const invoices = (invoicesRaw ?? []) as InvoiceRow[];
  const expenses = (expensesRaw ?? []) as ExpenseRow[];

  const { amounts, totalIncome } = paidInvoiceStats(invoices);
  // Tax automation: each paid invoice contributes amount * (rate/100)
  const totalTax = totalTaxFromPaidInvoices(amounts, rate);
  const totalExp = expensesTotal(expenses);
  const safe = safeToSpend(totalIncome, totalTax, totalExp);

  const chartData = incomeByMonth(invoices);
  const pieData = expensesByCategory(expenses);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Paid invoices drive income and estimated tax.{" "}
          <span className="text-primary font-medium">Safe to spend</span> is
          what remains after taxes and expenses.
        </p>
      </div>

      <MetricCards
        totalIncome={totalIncome}
        totalTax={totalTax}
        safeToSpend={safe}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeTargetBar totalIncome={totalIncome} targetMonthly={target} />
        <IncomeChart data={chartData} />
      </div>

      <ExpensePieChart data={pieData} />

      <div className="grid gap-6 xl:grid-cols-2">
        <InvoiceForm />
        <ExpenseForm />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <InvoiceTable invoices={invoices} />
      </section>
    </div>
  );
}
