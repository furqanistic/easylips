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

-- ──────────────────────────────────────────────────────────────────────────
-- Credits, ledger, devices, sessions
--
-- The server is the single source of truth for how many translation minutes
-- a user has. The Electron app may only READ these values; it may never set
-- them. Every grant and every spend is recorded in usage_ledger (append-only).
-- ──────────────────────────────────────────────────────────────────────────

-- One row per user. free_seconds resets daily (UTC); paid_seconds is topped
-- up only by a verified payment webhook. Never decrement by mutating these
-- columns directly from untrusted input — go through tryDebit().
create table if not exists public.credit_balances (
  user_id          uuid primary key references public.users(id) on delete cascade,
  free_seconds     bigint not null default 0,
  paid_seconds     bigint not null default 0,
  -- UTC timestamp of the most recent daily free refill.
  free_refilled_at timestamptz,
  -- When true, this user/device has been flagged for abuse and gets no free minutes.
  free_revoked     boolean not null default false,
  updated_at       timestamptz not null default now()
);

create index if not exists credit_balances_user_idx on public.credit_balances (user_id);

-- Append-only audit trail. Every credit (grant) and every debit (spend) is a
-- new row. Nothing here is ever updated or deleted.
create table if not exists public.usage_ledger (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  session_id  text,                       -- translation session, nullable for grants
  direction   text not null check (direction in ('credit', 'debit')),
  kind        text not null,              -- 'free_daily' | 'paid' | 'usage' | 'admin' ...
  seconds     bigint not null,            -- always positive
  reason      text,
  -- Idempotency key for grants coming from external systems (e.g. a Creem
  -- checkout id). Unique so a replayed webhook can't double-grant.
  ref_key     text,
  created_at  timestamptz not null default now(),
  unique (ref_key)
);

create index if not exists usage_ledger_user_idx on public.usage_ledger (user_id, created_at desc);
create index if not exists usage_ledger_session_idx on public.usage_ledger (session_id);

-- Devices. We store only hashes — never raw machine fingerprints. install_id is
-- a client-generated UUID persisted in the OS keychain; fingerprint_hash is a
-- SHA-256 of salted machine signals; ip_hash is a salted SHA-256 of the IP.
create table if not exists public.devices (
  install_id       uuid primary key,
  fingerprint_hash text not null,
  ip_hash          text not null,
  first_user_id    uuid references public.users(id) on delete set null,
  -- When true, this device is flagged for abuse and gets no free minutes.
  free_revoked     boolean not null default false,
  first_seen       timestamptz not null default now(),
  last_seen        timestamptz not null default now(),
  seen_count       integer not null default 1
);

create index if not exists devices_fingerprint_idx on public.devices (fingerprint_hash);
create index if not exists devices_ip_idx on public.devices (ip_hash);

-- Which accounts have existed on which device. Lets us enforce "limited free
-- minutes per device" even when users create fresh accounts.
create table if not exists public.device_accounts (
  install_id  uuid not null references public.devices(install_id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (install_id, user_id)
);

create index if not exists device_accounts_device_idx on public.device_accounts (install_id);
create index if not exists device_accounts_user_idx on public.device_accounts (user_id);

-- Logged abuse signals. Not a blocklist on its own — the credits/devices
-- services read these to decide whether to withhold free minutes.
create table if not exists public.abuse_flags (
  id          uuid primary key default gen_random_uuid(),
  subject     text not null check (subject in ('user', 'device', 'ip')),
  subject_id  text not null,              -- user_id / install_id / ip_hash
  reason      text not null,              -- 'multiple_accounts_device' | 'ip_farming' | 'device_reset_farming' | 'vm' ...
  severity    text not null default 'low' check (severity in ('low', 'medium', 'high')),
  created_at  timestamptz not null default now()
);

create index if not exists abuse_flags_subject_idx on public.abuse_flags (subject, subject_id, created_at desc);

-- Translation sessions. The server approves the start and meters the duration;
-- the Electron app cannot run a session the server has not approved.
create table if not exists public.translation_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  install_id  uuid references public.devices(install_id) on delete set null,
  status      text not null default 'pending' check (status in ('pending','active','stopped','expired')),
  target_lang text,
  source_lang text,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  -- Seconds debited from the user's balance while this session was running.
  billed_seconds bigint not null default 0
);

create index if not exists translation_sessions_user_idx on public.translation_sessions (user_id, started_at desc);
create index if not exists translation_sessions_status_idx on public.translation_sessions (status);
