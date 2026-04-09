/**
 * Tax owed for a single paid invoice.
 * tax_owed = amount * (estimated_tax_rate / 100)
 */
export function taxOwedForInvoice(
  amount: number,
  estimatedTaxRatePercent: number
): number {
  if (amount <= 0 || estimatedTaxRatePercent <= 0) return 0;
  return Math.round(amount * (estimatedTaxRatePercent / 100) * 100) / 100;
}

/** Sum of amounts for paid invoices (total income). */
export function sumPaidIncome(paidAmounts: number[]): number {
  return paidAmounts.reduce((a, b) => a + b, 0);
}

/** Total estimated tax across paid invoices at the user's rate. */
export function totalTaxFromPaidInvoices(
  paidAmounts: number[],
  estimatedTaxRatePercent: number
): number {
  return paidAmounts.reduce(
    (sum, amt) => sum + taxOwedForInvoice(amt, estimatedTaxRatePercent),
    0
  );
}

/**
 * Safe to spend = total income from paid invoices
 * minus estimated taxes on that income minus all expenses.
 */
export function safeToSpend(
  totalIncome: number,
  totalTax: number,
  totalExpenses: number
): number {
  return Math.round((totalIncome - totalTax - totalExpenses) * 100) / 100;
}
