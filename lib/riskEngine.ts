import { supabaseAdmin } from "./supabase";
import type { CapPeriod } from "./types";

export interface CapCheckResult {
  allowed: boolean;
  blockedBy: CapPeriod | null;
}

/**
 * Checks all four trade caps (daily/weekly/monthly/yearly) for an account.
 * Any one cap being hit blocks the trade — caps don't average out.
 * Call this immediately before executing any ICT/SMC confluence signal.
 */
export async function checkTradeCap(accountId: string): Promise<CapCheckResult> {
  const { data: settings } = await supabaseAdmin
    .from("trade_cap_settings")
    .select("*")
    .eq("account_id", accountId)
    .single();

  const { data: usage } = await supabaseAdmin
    .from("trade_cap_usage")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (!settings || !usage) {
    // No caps configured yet — fail safe by blocking, not by allowing
    // unlimited trading on a misconfigured account.
    return { allowed: false, blockedBy: "daily" };
  }

  await rolloverCountersIfNeeded(accountId, usage);

  if (usage.trades_today >= settings.daily_max) return { allowed: false, blockedBy: "daily" };
  if (usage.trades_this_week >= settings.weekly_max) return { allowed: false, blockedBy: "weekly" };
  if (usage.trades_this_month >= settings.monthly_max) return { allowed: false, blockedBy: "monthly" };
  if (usage.trades_this_year >= settings.yearly_max) return { allowed: false, blockedBy: "yearly" };

  return { allowed: true, blockedBy: null };
}

/**
 * Increments all four counters after a trade actually executes.
 * Call this once the broker confirms the fill — not before.
 */
export async function recordTradeAgainstCap(accountId: string) {
  const { data: usage } = await supabaseAdmin
    .from("trade_cap_usage")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (!usage) return;

  await supabaseAdmin
    .from("trade_cap_usage")
    .update({
      trades_today: usage.trades_today + 1,
      trades_this_week: usage.trades_this_week + 1,
      trades_this_month: usage.trades_this_month + 1,
      trades_this_year: usage.trades_this_year + 1,
    })
    .eq("account_id", accountId);
}

/**
 * Resets a counter to zero when its period has rolled over
 * (new day / ISO week / month / year since it was last touched).
 * Server timezone governs "daily" — pin this to a specific timezone
 * (e.g. broker server time) rather than leaving it to the host's default.
 */
async function rolloverCountersIfNeeded(accountId: string, usage: any) {
  const now = new Date();
  const startOfToday = now.toISOString().slice(0, 10);
  const startOfWeek = getIsoWeekStart(now).toISOString().slice(0, 10);
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const startOfYear = `${now.getFullYear()}-01-01`;

  const patch: Record<string, unknown> = {};
  if (usage.period_start_today !== startOfToday) {
    patch.trades_today = 0;
    patch.period_start_today = startOfToday;
  }
  if (usage.period_start_week !== startOfWeek) {
    patch.trades_this_week = 0;
    patch.period_start_week = startOfWeek;
  }
  if (usage.period_start_month !== startOfMonth) {
    patch.trades_this_month = 0;
    patch.period_start_month = startOfMonth;
  }
  if (usage.period_start_year !== startOfYear) {
    patch.trades_this_year = 0;
    patch.period_start_year = startOfYear;
  }

  if (Object.keys(patch).length > 0) {
    await supabaseAdmin.from("trade_cap_usage").update(patch).eq("account_id", accountId);
  }
}

function getIsoWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7; // Sunday -> 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
