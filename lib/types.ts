export type AccountStatus = "connected" | "disconnected" | "paused";
export type TradeDirection = "buy" | "sell";
export type CapPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface ClientAccount {
  id: string;
  client_name: string;
  broker: string;
  mt_login: string; // MT4/5 login number (never store the master password here)
  platform: "mt4" | "mt5";
  balance: number;
  equity: number;
  open_pnl: number;
  drawdown_pct: number;
  status: AccountStatus;
  risk_tier: "conservative" | "standard" | "aggressive";
  created_at: string;
}

export interface TradeCapSettings {
  account_id: string; // "*" for a global cap across all accounts
  daily_max: number;
  weekly_max: number;
  monthly_max: number;
  yearly_max: number;
}

export interface TradeCapUsage {
  account_id: string;
  trades_today: number;
  trades_this_week: number;
  trades_this_month: number;
  trades_this_year: number;
  period_start_today: string;
  period_start_week: string;
  period_start_month: string;
  period_start_year: string;
}

export interface Trade {
  id: string;
  account_id: string;
  symbol: string;
  direction: TradeDirection;
  lot_size: number;
  entry_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  pnl: number | null;
  strategy_tag: "ict_smc_confluence";
  status: "open" | "closed" | "skipped_cap_reached" | "rejected";
  opened_at: string;
  closed_at: string | null;
}

export interface SignalLogEntry {
  id: string;
  account_id: string | null;
  symbol: string;
  bias: "bullish" | "bearish";
  criteria_matched: string[]; // e.g. ["liquidity_sweep", "choch", "fvg_entry", "discount_zone"]
  action: "executed" | "skipped_cap_reached" | "skipped_no_confluence";
  created_at: string;
}

// Minimal Database type placeholder for supabase-js generics.
// Run `supabase gen types typescript` against your project to replace this
// with a fully generated type once the schema below is applied.
export type Database = any;
