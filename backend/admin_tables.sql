-- Bảng tracking visitors
create table if not exists public.visitors (
  id uuid not null default extensions.uuid_generate_v4(),
  ip_address text null,
  user_agent text null,
  visited_at timestamp with time zone not null default now(),
  page_path text null,
  constraint visitors_pkey primary key (id)
) TABLESPACE pg_default;

-- Bảng tracking tour views
create table if not exists public.tour_views (
  id uuid not null default extensions.uuid_generate_v4(),
  tour_id text not null,
  user_id uuid null,
  ip_address text null,
  viewed_at timestamp with time zone not null default now(),
  constraint tour_views_pkey primary key (id),
  constraint tour_views_tour_id_fkey foreign key (tour_id) references tours (id) on delete cascade,
  constraint tour_views_user_id_fkey foreign key (user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

-- Tạo index để query nhanh hơn
create index if not exists idx_visitors_visited_at on public.visitors(visited_at desc);
create index if not exists idx_tour_views_tour_id on public.tour_views(tour_id);
create index if not exists idx_tour_views_viewed_at on public.tour_views(viewed_at desc);

-- RLS policies (cho phép mọi người insert, chỉ admin đọc)
alter table public.visitors enable row level security;
alter table public.tour_views enable row level security;

-- Policy cho visitors: ai cũng có thể insert
create policy "Allow public insert on visitors" on public.visitors
  for insert with check (true);

-- Policy cho tour_views: ai cũng có thể insert
create policy "Allow public insert on tour_views" on public.tour_views
  for insert with check (true);

-- Policy cho admin đọc visitors
create policy "Allow admin read visitors" on public.visitors
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policy cho admin đọc tour_views
create policy "Allow admin read tour_views" on public.tour_views
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
