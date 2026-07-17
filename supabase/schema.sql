-- VIVA baseline schema for the linked Supabase project.
-- All user-owned tables use row-level security.

create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'VIVA member',
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  timezone text not null default 'Asia/Manila',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_goals (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  category text not null check (category in ('nutrition', 'movement', 'sleep', 'mindfulness', 'spending', 'other')),
  target_value numeric,
  current_value numeric not null default 0,
  unit text,
  target_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists health_goals_user_status_idx
  on public.health_goals (user_id, status);

create table if not exists public.daily_checkins (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  energy smallint check (energy between 1 and 100),
  mood smallint check (mood between 1 and 5),
  sleep_minutes integer check (sleep_minutes between 0 and 1440),
  steps integer check (steps >= 0),
  water_ml integer check (water_ml >= 0),
  note text check (char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index if not exists daily_checkins_user_date_idx
  on public.daily_checkins (user_id, checkin_date desc);

create table if not exists public.device_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'web' check (platform in ('web', 'android', 'ios')),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists device_tokens_user_idx
  on public.device_tokens (user_id);

alter table public.profiles enable row level security;
alter table public.health_goals enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.device_tokens enable row level security;

create policy "Members can read their profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Members can update their profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Members manage their health goals"
  on public.health_goals for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Members manage their checkins"
  on public.daily_checkins for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Members manage their device tokens"
  on public.device_tokens for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

drop trigger if exists health_goals_set_updated_at on public.health_goals;
create trigger health_goals_set_updated_at
  before update on public.health_goals
  for each row execute function private.set_updated_at();

drop trigger if exists daily_checkins_set_updated_at on public.daily_checkins;
create trigger daily_checkins_set_updated_at
  before update on public.daily_checkins
  for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(split_part(new.email, '@', 1), ''),
      'VIVA member'
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
