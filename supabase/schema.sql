-- Desk: MT4/MT5 managed account system
-- Run this in the Supabase SQL editor before deploying.

create extension if not exists "uuid-ossp";

create table if not exists client_accounts (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  broker text not null,
  mt_login text not null,               -- MT4/5 account number only
  platform text not null check (platform in ('mt4', 'mt5')),
  connection_ref text,                  -- MetaApi account id / bridge reference — never the password
  balance numeric not null default 0,
  equity numeric not null default 0,
  open_pnl numeric not null default 0,
  drawdown_pct numeric not null default 0,
  status text not null default 'disconnected' check (status in ('connected','disconnected','paused')),
  risk_tier text not null default 'standard' check (risk_tier in ('conservative','standard','aggressive')),
  max_drawdown_pct numeric not null default 20,   -- kill-switch threshold
  daily_loss_limit_pct numeric not null default 5,
  created_at timestamptz not null default now()
);

create table if not exists trade_cap_settings (
  account_id uuid primary key references client_accounts(id) on delete cascade,
  daily_max int not null default 10 check (daily_max between 0 and 1000),
  weekly_max int not null default 40 check (weekly_max between 0 and 1000),
  monthly_max int not null default 150 check (monthly_max between 0 and 1000),
  yearly_max int not null default 1000 check (yearly_max between 0 and 1000)
);

create table if not exists trade_cap_usage (
  account_id uuid primary key references client_accounts(id) on delete cascade,
  trades_today int not null default 0,
  trades_this_week int not null default 0,
  trades_this_month int not null default 0,
  trades_this_year int not null default 0,
  period_start_today date not null default current_date,
  period_start_week date not null default date_trunc('week', now()),
  period_start_month date not null default date_trunc('month', now()),
  period_start_year date not null default date_trunc('year', now())
);

create table if not exists trades (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid not null references client_accounts(id) on delete cascade,
  symbol text not null,
  direction text not null check (direction in ('buy','sell')),
  lot_size numeric not null,
  entry_price numeric not null,
  stop_loss numeric,
  take_profit numeric,
  pnl numeric,
  strategy_tag text not null default 'ict_smc_confluence',
  status text not null default 'open' check (status in ('open','closed','skipped_cap_reached','rejected')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists signal_log (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references client_accounts(id) on delete cascade,
  symbol text not null,
  bias text not null check (bias in ('bullish','bearish')),
  criteria_matched text[] not null default '{}',
  action text not null check (action in ('executed','skipped_cap_reached','skipped_no_confluence')),
  created_at timestamptz not null default now()
);

-- One row per account holding a manual pause flag, plus a single
-- global row (id = 'global') for the engine-wide kill switch.
create table if not exists engine_controls (
  id text primary key,
  is_paused boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into engine_controls (id, is_paused)
values ('global', false)
on conflict (id) do nothing;
