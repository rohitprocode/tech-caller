-- Tech Caller Resource Hub schema
-- Run this in the Supabase SQL editor, then create an Auth user for the first admin.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null check (char_length(description) >= 20),
  instructions text,
  category_id uuid references public.categories(id) on delete restrict,
  file_path text not null,
  original_filename text not null,
  file_type text not null,
  file_size bigint not null check (file_size > 0),
  thumbnail_path text,
  youtube_url text check (youtube_url is null or youtube_url ~ '^https://www\.youtube\.com/watch\?v=[A-Za-z0-9_-]+'),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  download_count integer not null default 0 check (download_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_events (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists resources_slug_idx on public.resources(slug);
create index if not exists resources_category_id_idx on public.resources(category_id);
create index if not exists resources_created_at_idx on public.resources(created_at desc);
create index if not exists resources_is_published_idx on public.resources(is_published);
create index if not exists resources_featured_idx on public.resources(is_featured) where is_featured = true;
create index if not exists download_events_resource_id_idx on public.download_events(resource_id);
create index if not exists download_events_created_at_idx on public.download_events(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists resources_updated_at on public.resources;
create trigger resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.increment_resource_download_count(target_resource_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.resources
  set download_count = download_count + 1
  where id = target_resource_id and is_published = true;
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.download_events enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published resources" on public.resources;
create policy "Public can read published resources"
on public.resources for select
to anon, authenticated
using (is_published = true or public.is_admin());

drop policy if exists "Admins can manage resources" on public.resources;
create policy "Admins can manage resources"
on public.resources for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read download events" on public.download_events;
create policy "Admins can read download events"
on public.download_events for select
to authenticated
using (public.is_admin());

drop policy if exists "Service role can insert download events" on public.download_events;
create policy "Service role can insert download events"
on public.download_events for insert
to service_role
with check (true);

insert into public.categories (name, slug, description)
values
  ('OBS', 'obs', 'Overlays, scenes and settings for OBS tutorials.'),
  ('Gaming', 'gaming', 'Files and tools for gaming setups.'),
  ('Windows', 'windows', 'Windows utilities, setup files and guides.'),
  ('Android', 'android', 'Android tools and tutorial downloads.'),
  ('PC', 'pc', 'PC setup and optimization resources.'),
  ('Tools', 'tools', 'Helpful apps, scripts and utility files.'),
  ('Templates', 'templates', 'Creator templates and reusable layouts.'),
  ('Files', 'files', 'General files shared from videos.'),
  ('Other', 'other', 'Resources that do not fit another category.')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  false,
  104857600,
  array[
    'application/zip',
    'application/x-zip-compressed',
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'text/plain',
    'application/json',
    'application/xml',
    'text/xml',
    'application/vnd.android.package-archive',
    'application/x-msdownload'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can manage resource files" on storage.objects;
create policy "Admins can manage resource files"
on storage.objects for all
to authenticated
using (bucket_id = 'resources' and public.is_admin())
with check (bucket_id = 'resources' and public.is_admin());

-- Optional development-only sample records. They point at placeholder paths, so upload
-- real files or delete these before production.
-- insert into public.resources (...) values (...);
