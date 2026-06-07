do $$
begin
  if not exists (select 1 from pg_type where typname = 'balance_transaction_type') then
    create type public.balance_transaction_type as enum (
      'ton_deposit',
      'payment_spend',
      'refund',
      'admin_adjustment'
    );
  end if;
end $$;

alter table public.profiles
  add column if not exists ton_balance numeric(36, 9) not null default 0 check (ton_balance >= 0);

alter table public.jobs
  add column if not exists deliverables jsonb not null default '[]'::jsonb,
  add column if not exists acceptance_criteria jsonb not null default '[]'::jsonb;

create table if not exists public.balance_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(36, 9) not null,
  asset text not null default 'TON',
  type public.balance_transaction_type not null,
  reason text not null,
  tx_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tx_hash)
);

create index if not exists balance_transactions_profile_id_created_at_idx
  on public.balance_transactions(profile_id, created_at desc);

alter table public.balance_transactions enable row level security;

grant select on public.balance_transactions to authenticated;
grant all on public.balance_transactions to service_role;

drop policy if exists "balance transactions are readable" on public.balance_transactions;
create policy "balance transactions are readable"
on public.balance_transactions for select to authenticated
using (true);
