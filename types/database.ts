export type InvoiceStatus = "Draft" | "Sent" | "Paid";

export type UserProfile = {
  id: string;
  email: string | null;
  name: string | null;
  estimated_tax_rate: number | null;
  target_monthly_income: number | null;
};

export type InvoiceRow = {
  id: string;
  user_id: string;
  client_name: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  created_at: string;
};

export type ExpenseRow = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  is_tax_deductible: boolean;
  created_at: string;
};
