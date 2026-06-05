do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_role') then
    create type public.profile_role as enum ('client', 'freelancer', 'both');
  end if;
  if not exists (select 1 from pg_type where typname = 'profile_language') then
    create type public.profile_language as enum ('en', 'ru', 'kk');
  end if;
  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('draft', 'ai_reviewed', 'published', 'in_review', 'matched', 'closed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum ('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
  end if;
  if not exists (select 1 from pg_type where typname = 'energy_transaction_type') then
    create type public.energy_transaction_type as enum (
      'monthly_free_grant',
      'application_spend',
      'ton_purchase',
      'stars_purchase',
      'admin_adjustment',
      'refund'
    );
  end if;
end $$;

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists avatar_url text,
  add column if not exists language public.profile_language not null default 'en',
  add column if not exists role public.profile_role not null default 'both',
  add column if not exists bio text,
  add column if not exists skills jsonb not null default '[]'::jsonb,
  add column if not exists hourly_rate numeric(12, 2),
  add column if not exists portfolio_channel text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists rating numeric(3, 2) not null default 0,
  add column if not exists completed_deals_count integer not null default 0,
  add column if not exists success_rate numeric(5, 2) not null default 0,
  add column if not exists energy_balance integer not null default 20 check (energy_balance >= 0),
  add column if not exists monthly_free_energy_used integer not null default 0 check (monthly_free_energy_used >= 0),
  add column if not exists last_energy_reset_at timestamptz not null default now();

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 160),
  description text not null check (char_length(description) >= 20),
  category text not null,
  budget_amount numeric(36, 9) not null check (budget_amount > 0),
  budget_token text not null,
  deadline timestamptz,
  status public.job_status not null default 'draft',
  ai_score integer check (ai_score between 0 and 100),
  ai_risk text,
  ai_missing_items jsonb not null default '[]'::jsonb,
  ai_suggested_terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id) on delete restrict,
  proposal_text text not null check (char_length(proposal_text) >= 20),
  energy_cost integer not null check (energy_cost > 0),
  status public.application_status not null default 'submitted',
  ai_score integer check (ai_score between 0 and 100),
  ai_risk text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, freelancer_id)
);

create table if not exists public.energy_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  type public.energy_transaction_type not null,
  reason text not null,
  related_job_id uuid references public.jobs(id) on delete set null,
  related_application_id uuid references public.job_applications(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null,
  status text not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  payment_id uuid references public.payments(id) on delete set null
);

create table if not exists public.portfolio_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  url text not null,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.deals
  add column if not exists job_id uuid references public.jobs(id) on delete set null,
  add column if not exists application_id uuid references public.job_applications(id) on delete set null,
  add column if not exists platform_fee_amount numeric(36, 9),
  add column if not exists platform_fee_token text,
  add column if not exists escrow_mode text not null default 'prepared',
  add column if not exists settlement_asset text;

create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_category_idx on public.jobs(category);
create index if not exists job_applications_job_id_idx on public.job_applications(job_id);
create index if not exists job_applications_freelancer_id_idx on public.job_applications(freelancer_id);
create index if not exists profiles_telegram_id_idx on public.profiles(telegram_id);
create index if not exists profiles_wallet_address_idx on public.profiles(wallet_address);
create index if not exists energy_transactions_profile_id_created_at_idx on public.energy_transactions(profile_id, created_at desc);
create index if not exists notifications_profile_id_created_at_idx on public.notifications(profile_id, created_at desc);

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at before update on public.jobs for each row execute function public.set_updated_at();
drop trigger if exists job_applications_set_updated_at on public.job_applications;
create trigger job_applications_set_updated_at before update on public.job_applications for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.energy_transactions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.portfolio_links enable row level security;
alter table public.notifications enable row level security;

grant select, insert, update on public.jobs to authenticated;
grant select, insert, update on public.job_applications to authenticated;
grant select on public.energy_transactions to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert, update, delete on public.portfolio_links to authenticated;
grant select, update on public.notifications to authenticated;
grant all on all tables in schema public to service_role;

create policy "published jobs are readable"
on public.jobs for select to authenticated
using (true);

create policy "authenticated users can create jobs"
on public.jobs for insert to authenticated
with check (true);

create policy "job owners can update jobs"
on public.jobs for update to authenticated
using (true)
with check (true);

create policy "applications are readable"
on public.job_applications for select to authenticated
using (true);

create policy "authenticated users can apply"
on public.job_applications for insert to authenticated
with check (true);

create policy "application participants can update"
on public.job_applications for update to authenticated
using (true)
with check (true);

create policy "energy transactions are readable"
on public.energy_transactions for select to authenticated
using (true);

create policy "portfolio links are readable"
on public.portfolio_links for select to authenticated
using (true);

create policy "portfolio links are writable"
on public.portfolio_links for all to authenticated
using (true)
with check (true);

create policy "notifications are readable"
on public.notifications for select to authenticated
using (true);

create policy "notifications can be marked read"
on public.notifications for update to authenticated
using (true)
with check (true);
