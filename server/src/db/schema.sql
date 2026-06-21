-- EasyLips auth schema (Supabase / Postgres)
-- Run this in the Supabase SQL Editor:
--   Dashboard > SQL Editor > New query > paste > Run
-- Or print it locally with:  npm run db:schema

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text,
  google_sub    text unique,
  auth_provider text not null default 'password',
  name          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users alter column password_hash drop not null;
alter table public.users add column if not exists google_sub text unique;
alter table public.users add column if not exists auth_provider text not null default 'password';

create index if not exists users_email_idx on public.users (email);
create index if not exists users_google_sub_idx on public.users (google_sub);

create table if not exists public.refresh_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  token_hash  text not null unique,
  expires_at  timestamptz not null,
  revoked_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists refresh_tokens_user_idx on public.refresh_tokens (user_id);
create index if not exists refresh_tokens_hash_idx on public.refresh_tokens (token_hash);

-- Optional: revoke every session for a user (e.g. on password change)
-- update public.refresh_tokens set revoked_at = now()
--   where user_id = '<uuid>' and revoked_at is null;
