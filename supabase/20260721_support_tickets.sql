-- Member bug reports / support tickets with staff inbox access.

create table if not exists public.support_tickets (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('bug', 'feature', 'account', 'other')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  subject text not null check (char_length(subject) between 3 and 120),
  description text not null check (char_length(description) between 10 and 2000),
  page_url text check (page_url is null or char_length(page_url) <= 500),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 1000),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_user_created_idx
  on public.support_tickets (user_id, created_at desc);

create index if not exists support_tickets_status_created_idx
  on public.support_tickets (status, created_at desc);

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at
  before update on public.support_tickets
  for each row execute function private.set_updated_at();

alter table public.support_tickets enable row level security;

drop policy if exists "Members insert their tickets" on public.support_tickets;
create policy "Members insert their tickets"
  on public.support_tickets for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Members read their tickets" on public.support_tickets;
create policy "Members read their tickets"
  on public.support_tickets for select to authenticated
  using ((select auth.uid()) = user_id or private.is_staff());

drop policy if exists "Staff update tickets" on public.support_tickets;
create policy "Staff update tickets"
  on public.support_tickets for update to authenticated
  using (private.is_staff())
  with check (private.is_staff());
