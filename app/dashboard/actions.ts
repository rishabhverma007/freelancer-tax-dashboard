"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InvoiceStatus } from "@/types/database";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const target = Number(formData.get("target_monthly_income"));
  const rate = Number(formData.get("estimated_tax_rate"));
  if (Number.isNaN(target) || Number.isNaN(rate)) {
    throw new Error("Invalid numbers");
  }

  // Use upsert so onboarding works even if the profile row
  // wasn't created by the auth trigger for some reason.
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      target_monthly_income: target,
      estimated_tax_rate: rate,
    },
    { onConflict: "id" }
  );

  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const client_name = String(formData.get("client_name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const due_date = String(formData.get("due_date") ?? "");

  if (!client_name || Number.isNaN(amount) || amount <= 0 || !due_date) {
    throw new Error("Please fill client, positive amount, and due date.");
  }

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    client_name,
    amount,
    due_date,
    status: "Sent" as InvoiceStatus,
  });

  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function setInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function toggleInvoicePaid(invoiceId: string, currentlyPaid: boolean) {
  const next: InvoiceStatus = currentlyPaid ? "Sent" : "Paid";
  await setInvoiceStatus(invoiceId, next);
}

export async function createExpense(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const is_tax_deductible = formData.get("is_tax_deductible") != null;

  if (!category || Number.isNaN(amount) || amount <= 0) {
    throw new Error("Please enter category and a positive amount.");
  }

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    category,
    amount,
    is_tax_deductible,
  });

  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
