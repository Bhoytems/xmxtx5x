function Bar({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  const nearLimit = pct >= 80;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-ink-500">{label}</span>
        <span className={`tabular ${nearLimit ? "text-signal-amber" : "text-ink-300"}`}>
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-700">
        <div
          className={`h-full rounded-full ${nearLimit ? "bg-signal-amber" : "bg-signal-teal"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CapProgress({
  usage,
  settings,
}: {
  usage: { trades_today: number; trades_this_week: number; trades_this_month: number; trades_this_year: number };
  settings: { daily_max: number; weekly_max: number; monthly_max: number; yearly_max: number };
}) {
  return (
    <div className="space-y-3 rounded-lg border border-base-700 bg-base-800 p-4">
      <p className="text-xs font-medium text-ink-300">Trade caps</p>
      <Bar label="Daily" used={usage.trades_today} max={settings.daily_max} />
      <Bar label="Weekly" used={usage.trades_this_week} max={settings.weekly_max} />
      <Bar label="Monthly" used={usage.trades_this_month} max={settings.monthly_max} />
      <Bar label="Yearly" used={usage.trades_this_year} max={settings.yearly_max} />
    </div>
  );
}
