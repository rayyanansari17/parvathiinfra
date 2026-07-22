-- Parvathi Infra Developers · Supabase schema
-- Run this once in the Supabase SQL editor for your project
-- (or I can apply it via the Supabase MCP tool if the project is one I can reach).
--
-- Mirrors the original FastAPI/MongoDB backend's three record types:
-- leads, brochure_requests, chat_messages.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    phone text not null,
    email text,
    project_interested text default 'THE VIEW',
    message text,
    source text default 'website',
    created_at timestamptz not null default now()
);

create table if not exists public.brochure_requests (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    phone text not null,
    email text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
    id uuid primary key default gen_random_uuid(),
    session_id text not null,
    role text not null,
    content text not null,
    created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_id_idx on public.chat_messages (session_id, created_at);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS: enabled on all three. The site's Next.js API routes are the only
-- callers (using the anon key server-side, never exposed to the browser),
-- so policies grant the anon role exactly the operations those routes need.
alter table public.leads enable row level security;
alter table public.brochure_requests enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "leads_insert_anon" on public.leads;
create policy "leads_insert_anon" on public.leads
    for insert to anon with check (true);

drop policy if exists "leads_select_anon" on public.leads;
create policy "leads_select_anon" on public.leads
    for select to anon using (true);

drop policy if exists "brochure_requests_insert_anon" on public.brochure_requests;
create policy "brochure_requests_insert_anon" on public.brochure_requests
    for insert to anon with check (true);

drop policy if exists "chat_messages_insert_anon" on public.chat_messages;
create policy "chat_messages_insert_anon" on public.chat_messages
    for insert to anon with check (true);

drop policy if exists "chat_messages_select_anon" on public.chat_messages;
create policy "chat_messages_select_anon" on public.chat_messages
    for select to anon using (true);
