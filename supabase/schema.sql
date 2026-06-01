-- ============================================================
-- Wandile Car Wash — Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  -- Give 0 loyalty points on signup
  insert into public.loyalty_points (user_id, points) values (new.id, 0);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Vehicles ──────────────────────────────────────────────
create table if not exists public.vehicles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  make          text not null,
  model         text not null,
  year          integer,
  license_plate text,
  color         text,
  created_at    timestamptz default now()
);

-- ── Appointments ──────────────────────────────────────────
create table if not exists public.appointments (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  vehicle_id    uuid references public.vehicles(id) on delete set null,
  package_id    text not null,   -- 'basic' | 'works' | 'ultimate' | 'ceramic'
  scheduled_at  timestamptz not null,
  add_ons       text[] default '{}',
  notes         text,
  status        text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at    timestamptz default now()
);

-- Award loyalty points on appointment completion
create or replace function public.award_loyalty_points()
returns trigger language plpgsql as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    insert into public.loyalty_points (user_id, points)
    values (new.user_id, 10)
    on conflict (user_id)
    do update set points = loyalty_points.points + 10, last_updated = now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_appointment_completed on public.appointments;
create trigger on_appointment_completed
  after update on public.appointments
  for each row execute function public.award_loyalty_points();

-- ── Subscriptions ─────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.profiles(id) on delete cascade,
  package_id              text not null,
  status                  text not null default 'active' check (status in ('active','cancelled','past_due')),
  stripe_subscription_id  text unique,
  stripe_customer_id      text,
  current_period_end      timestamptz,
  created_at              timestamptz default now()
);

-- ── Payments ──────────────────────────────────────────────
create table if not exists public.payments (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid not null references public.profiles(id) on delete cascade,
  amount                   numeric(10,2) not null,
  currency                 text default 'usd',
  stripe_payment_intent_id text unique,
  receipt_url              text,
  description              text,
  created_at               timestamptz default now()
);

-- ── Loyalty Points ────────────────────────────────────────
create table if not exists public.loyalty_points (
  user_id      uuid primary key references public.profiles(id) on delete cascade,
  points       integer not null default 0,
  last_updated timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.vehicles      enable row level security;
alter table public.appointments  enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments      enable row level security;
alter table public.loyalty_points enable row level security;

-- Profiles: users can read/update their own
create policy "profiles: own data" on public.profiles for all using (auth.uid() = id);

-- Vehicles
create policy "vehicles: own data" on public.vehicles for all using (auth.uid() = user_id);

-- Appointments
create policy "appointments: own data" on public.appointments for all using (auth.uid() = user_id);

-- Subscriptions
create policy "subscriptions: own data" on public.subscriptions for all using (auth.uid() = user_id);

-- Payments
create policy "payments: own read" on public.payments for select using (auth.uid() = user_id);

-- Loyalty Points
create policy "loyalty: own data" on public.loyalty_points for all using (auth.uid() = user_id);

-- ── Admin Policies ────────────────────────────────────────
-- Run these in the Supabase SQL Editor to enable the admin portal.
-- Replace 'YOUR_ADMIN_EMAIL' with your actual admin email.

create policy "admin: read all appointments" on public.appointments
  for select using (
    (select email from auth.users where id = auth.uid()) = 'YOUR_ADMIN_EMAIL'
  );

create policy "admin: update all appointments" on public.appointments
  for update using (
    (select email from auth.users where id = auth.uid()) = 'YOUR_ADMIN_EMAIL'
  );

create policy "admin: read all profiles" on public.profiles
  for select using (
    (select email from auth.users where id = auth.uid()) = 'YOUR_ADMIN_EMAIL'
  );

create policy "admin: read all vehicles" on public.vehicles
  for select using (
    (select email from auth.users where id = auth.uid()) = 'YOUR_ADMIN_EMAIL'
  );
