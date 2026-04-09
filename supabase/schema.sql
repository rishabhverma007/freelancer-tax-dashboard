-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Adjust if extensions already exist.

-- 1) public.users (profile; id matches auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  estimated_tax_rate numeric,
  target_monthly_income numeric
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  client_name text not null,
  amount numeric not null check (amount >= 0),
  status text not null check (status in ('Draft', 'Sent', 'Paid')),
  due_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  category text not null,
  amount numeric not null check (amount >= 0),
  is_tax_deductible boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists expenses_user_id_idx on public.expenses (user_id);

-- 2) New auth user → profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) RLS
alter table public.users enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

drop policy if exists "invoices_all_own" on public.invoices;
create policy "invoices_all_own" on public.invoices
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "expenses_all_own" on public.expenses;
create policy "expenses_all_own" on public.expenses
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
