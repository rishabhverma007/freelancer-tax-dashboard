/**
 * Seed demo invoices & expenses for the logged-in user.
 *
 * Usage:
 *   1) Copy your user id from Supabase → Authentication → Users, or from the app (temporary log).
 *   2) Set env in .env.local or export:
 *        SUPABASE_URL
 *        SUPABASE_SERVICE_ROLE_KEY  (never expose to the browser)
 *        SEED_USER_ID=<uuid>
 *   3) npm run seed
 *
 * Also updates profile with target income & tax rate so onboarding is satisfied.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const root = resolve(__dirname, "..");
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.SEED_USER_ID;

if (!url || !serviceKey || !userId) {
  console.error(
    "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SEED_USER_ID"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const invoices = [
  { client_name: "Northwind Media", amount: 4200, status: "Paid", daysAgo: 95 },
  { client_name: "Acme Design", amount: 2800, status: "Paid", daysAgo: 72 },
  { client_name: "Globex LLC", amount: 5100, status: "Sent", daysAgo: 60 },
  { client_name: "Umbrella Labs", amount: 1900, status: "Paid", daysAgo: 45 },
  { client_name: "Stark Industries", amount: 7600, status: "Paid", daysAgo: 35 },
  { client_name: "Wayne Enterprises", amount: 3300, status: "Draft", daysAgo: 28 },
  { client_name: "Daily Planet", amount: 1500, status: "Sent", daysAgo: 21 },
  { client_name: "Hooli XYZ", amount: 4100, status: "Paid", daysAgo: 14 },
  { client_name: "Pied Piper", amount: 2200, status: "Paid", daysAgo: 7 },
  { client_name: "Soylent Corp", amount: 1800, status: "Sent", daysAgo: 3 },
];

const expenses = [
  { category: "Software", amount: 129, is_tax_deductible: true },
  { category: "Coworking", amount: 350, is_tax_deductible: true },
  { category: "Travel", amount: 420, is_tax_deductible: true },
  { category: "Meals", amount: 180, is_tax_deductible: false },
  { category: "Equipment", amount: 890, is_tax_deductible: true },
];

function isoDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const { error: profileError } = await supabase.from("users").upsert(
    {
      id: userId,
      target_monthly_income: 10000,
      estimated_tax_rate: 28,
    },
    { onConflict: "id" }
  );
  if (profileError) throw profileError;

  const { error: delInv } = await supabase
    .from("invoices")
    .delete()
    .eq("user_id", userId);
  if (delInv) throw delInv;

  const { error: delExp } = await supabase
    .from("expenses")
    .delete()
    .eq("user_id", userId);
  if (delExp) throw delExp;

  for (const r of invoices) {
    const due = isoDateDaysAgo(r.daysAgo - 5);
    const created = new Date();
    created.setDate(created.getDate() - r.daysAgo);
    const { error } = await supabase.from("invoices").insert({
      user_id: userId,
      client_name: r.client_name,
      amount: r.amount,
      status: r.status,
      due_date: due,
      created_at: created.toISOString(),
    });
    if (error) throw error;
  }

  for (const e of expenses) {
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      category: e.category,
      amount: e.amount,
      is_tax_deductible: e.is_tax_deductible,
    });
    if (error) throw error;
  }

  console.log("Seed complete: 10 invoices, 5 expenses, profile updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
