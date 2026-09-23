create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'DIGITAL PLATFORM',
  description text not null default '',
  cover_image text,
  status text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project_type text not null,
  timeline text not null,
  details text not null,
  status text not null default 'NEW' check (status in ('NEW','REVIEWING','CONTACTED','COMPLETED','ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('page_view','project_view','contact_started','inquiry_submitted')),
  path text,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select to authenticated using (true);

drop policy if exists "admins manage settings" on public.site_settings;
drop policy if exists "authenticated manage settings" on public.site_settings;
create policy "authenticated manage settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "public read content settings" on public.site_settings;
create policy "public read content settings" on public.site_settings for select to anon, authenticated using (key in ('hero', 'ai_approach', 'contact', 'work'));

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select to anon, authenticated using (status = 'PUBLISHED');
drop policy if exists "admins manage projects" on public.projects;
drop policy if exists "authenticated manage projects" on public.projects;
create policy "authenticated manage projects" on public.projects for all to authenticated using (true) with check (true);

drop policy if exists "public create inquiries" on public.inquiries;
create policy "public create inquiries" on public.inquiries for insert to anon, authenticated with check (char_length(name) between 1 and 120 and char_length(email) between 3 and 254 and char_length(details) between 1 and 5000);
drop policy if exists "admins read inquiries" on public.inquiries;
drop policy if exists "authenticated read inquiries" on public.inquiries;
create policy "authenticated read inquiries" on public.inquiries for select to authenticated using (true);
drop policy if exists "admins update inquiries" on public.inquiries;
drop policy if exists "authenticated update inquiries" on public.inquiries;
create policy "authenticated update inquiries" on public.inquiries for update to authenticated using (true) with check (true);

drop policy if exists "public create analytics" on public.analytics_events;
create policy "public create analytics" on public.analytics_events for insert to anon, authenticated with check (char_length(event_name) > 0);
drop policy if exists "admins read analytics" on public.analytics_events;
drop policy if exists "authenticated read analytics" on public.analytics_events;
create policy "authenticated read analytics" on public.analytics_events for select to authenticated using (true);

drop policy if exists "admins read audit" on public.audit_logs;
drop policy if exists "authenticated read audit" on public.audit_logs;
create policy "authenticated read audit" on public.audit_logs for select to authenticated using (true);
drop policy if exists "admins create audit" on public.audit_logs;
drop policy if exists "authenticated create audit" on public.audit_logs;
create policy "authenticated create audit" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

insert into public.site_settings(key, value)
values ('hero', '{"label":"Digital studio","titleA":"Ideas, engineered","titleB":"for what’s next.","sub":"AER × VÆLOR is a digital studio combining strategy, design and engineering to build intelligent products for ambitious brands."}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings(key, value)
values ('ai_approach', '{"eyebrow":"AI Approach","headlineA":"AI generates the","strike":"slop","headlineB":"We curate the","accent":"masterpiece","body":"We do not reject AI; we subjugate it to taste. It is a precision instrument for executing complex visions, rectified entirely by profound human intent.","cards":[{"title":"Explore","body":"Expand possibilities quickly. Generate directions, prototypes, and variants at speed."},{"title":"Direct","body":"Choose the direction with intent. Human judgment decides what deserves attention."},{"title":"Refine","body":"Edit, test, and sharpen the result into a connected system built to last."}]}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings(key, value)
values ('contact', '{"eyebrow":"Start a project","titleA":"Let''s build","titleB":"what comes next.","sub":"Have a product, brand or experience in mind? Tell us what you are trying to make. We will take it from there.","studioEmail":"yunusfawzan9@gmail.com"}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings(key, value)
values ('work', '{"items":[{"id":"velora","name":"Velora","category":"Commerce","meta":"01 / Commerce / System","outcome":"A commerce system exploring speed, hierarchy and confident decision-making.","tags":["Direction","UX / UI","Engineering"],"url":"velora.studio","domain":"velora.studio","logoText":"V","fonts":["Cormorant Garamond","Inter"],"colors":["#40E0D0","#FAF8F5","#0A0B0B"],"images":[],"note":"Full case study ships with the system documentation."},{"id":"nimble","name":"Nimble","category":"Brand","meta":"02 / Brand / Experience","outcome":"A brand experience turning a complex offer into a clearer, more confident journey.","tags":["Positioning","Identity","Experience"],"url":"nimble.studio","domain":"nimble.studio","logoText":"N","fonts":["Cormorant Garamond","Inter"],"colors":["#FAF8F5","#40E0D0","#0D1010"],"images":[],"note":"Full case study ships with the identity guidelines."},{"id":"flux","name":"Flux","category":"Product","meta":"03 / Product / Interface","outcome":"A product direction focused on reducing noise and making the next action obvious.","tags":["Product","UX","Interface"],"url":"flux.studio","domain":"flux.studio","logoText":"F","fonts":["Cormorant Garamond","Inter"],"colors":["#0A0B0B","#40E0D0","#FFFFFF"],"images":[],"note":"Full case study ships with the interface system."}]}'::jsonb)
on conflict (key) do nothing;

alter table public.inquiries add column if not exists stage text not null default '';
alter table public.inquiries add column if not exists support text[] not null default '{}';
alter table public.inquiries add column if not exists company text not null default '';
alter table public.inquiries add column if not exists link text not null default '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
