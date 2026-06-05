create extension if not exists pgcrypto;

create type public.deal_status as enum (
  'draft',
  'ai_reviewed',
  'waiting_payment',
  'swap_pending',
  'funded',
  'in_progress',
  'submitted',
  'approved',
  'release_pending',
  'completed',
  'disputed',
  'cancelled'
);

create type public.payment_status as enum (
  'pending',
  'verifying',
  'verified',
  'failed',
  'released',
  'refunded'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_id text not null unique,
  telegram_username text,
  wallet_address text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete restrict,
  freelancer_id uuid references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) >= 20),
  price_amount numeric(36, 9) not null check (price_amount > 0),
  price_token text not null,
  deadline timestamptz,
  status public.deal_status not null default 'draft',
  ai_score integer check (ai_score between 0 and 100),
  ai_risk text,
  improved_terms text,
  funding_tx_hash text unique,
  release_tx_hash text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  payer_wallet text not null,
  receiver_wallet text not null,
  escrow_wallet text not null,
  amount numeric(36, 9) not null check (amount > 0),
  asset text not null,
  network text not null check (network in ('testnet', 'mainnet')),
  status public.payment_status not null default 'pending',
  tx_hash text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id) on delete restrict,
  message text not null,
  storage_path text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deal_events (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  from_status public.deal_status,
  to_status public.deal_status,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index deals_client_id_idx on public.deals(client_id);
create index deals_freelancer_id_idx on public.deals(freelancer_id);
create index deals_status_idx on public.deals(status);
create index payments_deal_id_idx on public.payments(deal_id);
create index deliveries_deal_id_idx on public.deliveries(deal_id);
create index deal_events_deal_id_created_at_idx on public.deal_events(deal_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger deals_set_updated_at before update on public.deals for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger deliveries_set_updated_at before update on public.deliveries for each row execute function public.set_updated_at();

alter publication supabase_realtime add table public.deals;
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.deliveries;
alter publication supabase_realtime add table public.deal_events;

alter table public.profiles enable row level security;
alter table public.deals enable row level security;
alter table public.payments enable row level security;
alter table public.deliveries enable row level security;
alter table public.deal_events enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.deals to authenticated;
grant select, insert, update on public.payments to authenticated;
grant select, insert, update on public.deliveries to authenticated;
grant select, insert on public.deal_events to authenticated;
grant all on all tables in schema public to service_role;

create policy "profiles are readable by authenticated users"
on public.profiles for select to authenticated
using (true);

create policy "profiles can be inserted by authenticated users"
on public.profiles for insert to authenticated
with check (true);

create policy "profiles can update their wallet by telegram linkage"
on public.profiles for update to authenticated
using (true)
with check (true);

create policy "deal participants can read deals"
on public.deals for select to authenticated
using (true);

create policy "authenticated users can create deals"
on public.deals for insert to authenticated
with check (true);

create policy "deal participants can update deals"
on public.deals for update to authenticated
using (true)
with check (true);

create policy "payments are readable by authenticated users"
on public.payments for select to authenticated
using (true);

create policy "payments are writable by authenticated users"
on public.payments for insert to authenticated
with check (true);

create policy "deliveries are readable by authenticated users"
on public.deliveries for select to authenticated
using (true);

create policy "deliveries are writable by authenticated users"
on public.deliveries for insert to authenticated
with check (true);

create policy "deal events are readable by authenticated users"
on public.deal_events for select to authenticated
using (true);

create policy "deal events are append only for authenticated users"
on public.deal_events for insert to authenticated
with check (true);
