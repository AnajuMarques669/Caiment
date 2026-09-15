-- CAIMENT / Lovable Cloud + Supabase
-- Run this migration after connecting the project to Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  model_url text,
  preview_url text,
  source_task_id text,
  status text not null default 'processing' check (status in ('processing','completed','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  height numeric,
  bust numeric,
  waist numeric,
  hip numeric,
  shoulders numeric,
  arm numeric,
  leg numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fitting_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  clothing_id text not null,
  recommended_size text,
  compatibility text,
  created_at timestamptz not null default now()
);

alter table public.avatars enable row level security;
alter table public.measurements enable row level security;
alter table public.fitting_sessions enable row level security;

create policy "users can read own avatars" on public.avatars
  for select using (auth.uid() = user_id);
create policy "users can insert own avatars" on public.avatars
  for insert with check (auth.uid() = user_id);
create policy "users can update own avatars" on public.avatars
  for update using (auth.uid() = user_id);

create policy "users can read own measurements" on public.measurements
  for select using (auth.uid() = user_id);
create policy "users can insert own measurements" on public.measurements
  for insert with check (auth.uid() = user_id);
create policy "users can update own measurements" on public.measurements
  for update using (auth.uid() = user_id);

create policy "users can read own fitting sessions" on public.fitting_sessions
  for select using (auth.uid() = user_id);
create policy "users can insert own fitting sessions" on public.fitting_sessions
  for insert with check (auth.uid() = user_id);
