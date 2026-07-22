-- Notification deep links + stop public avatar bucket listing.

alter table public.notifications
  add column if not exists href text;

alter table public.notifications
  drop constraint if exists notifications_href_len;
alter table public.notifications
  add constraint notifications_href_len
  check (href is null or char_length(href) <= 500);

comment on column public.notifications.href is
  'Optional in-app path opened when the notification is tapped.';

-- Public buckets already serve objects by URL; a broad SELECT policy enables
-- listing every avatar via the Storage API.
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
