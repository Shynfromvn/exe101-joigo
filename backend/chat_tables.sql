-- Bảng chat_sessions: Lưu thông tin các phiên chat
create table public.chat_sessions (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid null,
  title text null,
  language text null default 'VI'::text,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  updated_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint chat_sessions_pkey primary key (id),
  constraint chat_sessions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
) TABLESPACE pg_default;

-- Bảng chat_messages: Lưu từng tin nhắn trong chat
create table public.chat_messages (
  id uuid not null default extensions.uuid_generate_v4(),
  session_id uuid not null,
  role text not null,
  content text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint chat_messages_pkey primary key (id),
  constraint chat_messages_session_id_fkey foreign key (session_id) references public.chat_sessions (id) on delete cascade
) TABLESPACE pg_default;

-- Tạo index để query nhanh hơn
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_chat_sessions_updated_at on public.chat_sessions(updated_at desc);
create index idx_chat_messages_session_id on public.chat_messages(session_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);

-- RLS policies
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Policy cho chat_sessions: User chỉ có thể xem và tạo session của chính mình
-- Nếu user_id là null (chưa đăng nhập), chỉ có thể xem session đó qua session_id
create policy "Users can view their own chat sessions" on public.chat_sessions
  for select using (
    user_id = auth.uid() or user_id is null
  );

create policy "Users can create their own chat sessions" on public.chat_sessions
  for insert with check (
    user_id = auth.uid() or (user_id is null and auth.uid() is null)
  );

create policy "Users can update their own chat sessions" on public.chat_sessions
  for update using (
    user_id = auth.uid() or user_id is null
  );

create policy "Users can delete their own chat sessions" on public.chat_sessions
  for delete using (
    user_id = auth.uid() or user_id is null
  );

-- Policy cho chat_messages: User chỉ có thể xem và tạo messages trong session của mình
create policy "Users can view messages in their sessions" on public.chat_messages
  for select using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and (chat_sessions.user_id = auth.uid() or chat_sessions.user_id is null)
    )
  );

create policy "Users can create messages in their sessions" on public.chat_messages
  for insert with check (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and (chat_sessions.user_id = auth.uid() or chat_sessions.user_id is null)
    )
  );

-- Function để tự động cập nhật updated_at khi có message mới
create or replace function update_chat_session_updated_at()
returns trigger as $$
begin
  update public.chat_sessions
  set updated_at = timezone('utc'::text, now())
  where id = new.session_id;
  return new;
end;
$$ language plpgsql;

-- Trigger để tự động cập nhật updated_at
create trigger update_chat_session_timestamp
  after insert on public.chat_messages
  for each row
  execute function update_chat_session_updated_at();
