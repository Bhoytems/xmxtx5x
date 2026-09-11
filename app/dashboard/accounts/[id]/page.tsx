import TopBar from "@/components/TopBar";
import CapProgress from "@/components/CapProgress";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAccountData(id: string) {
  const [{ data: account }, { data: settings }, { data: usage }, { data: trades }] = await Promise.all([
    supabaseAdmin.from("client_accounts").select("*").eq("id", id).single(),
    supabaseAdmin.from("trade_cap_settings").select("*").eq("account_id", id).single(),
    supabaseAdmin.from("trade_cap_usage").select("*").eq("account_id", id).single(),
    supabaseAdmin.from("trades").select("*").eq("account_id", id).order("opened_at", { ascending: false }).limit(20),
  ]);
  return { account, settings, usage, trades: trades ?? [] };
}

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const { account, settings, usage, trades } = await getAccountData(params.id);

  if (!account) {
    return (
      <div>
        <TopBar title="Account not found" />
        <div className="p-6 text-ink-500">This account doesn&apos;t exist.</div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={account.client_name} />
      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-base-700 bg-base-800 p-4">
              <p className="text-xs text-ink-500">Balance</p>
              <p className="tabular mt-1 text-xl text-ink-100">${Number(account.balance).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-700 bg-base-800 p-4">
              <p className="text-xs text-ink-500">Equity</p>
              <p className="tabular mt-1 text-xl text-ink-100">${Number(account.equity).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-base-700 bg-base-800 p-4">
              <p className="text-xs text-ink-500">Drawdown</p>
              <p className="tabular mt-1 text-xl text-signal-amber">{Number(account.drawdown_pct).toFixed(1)}%</p>
            </div>
          </div>

          <div className="rounded-lg border border-base-700 bg-base-800 p-4">
            <p className="mb-3 text-xs font-medium text-ink-300">Recent trades</p>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-ink-500">
                <tr>
                  <th className="py-2 font-medium">Symbol</th>
                  <th className="py-2 font-medium">Direction</th>
                  <th className="py-2 font-medium">Lots</th>
                  <th className="py-2 font-medium">Entry</th>
                  <th className="py-2 font-medium">P&L</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-ink-500">
                      No trades recorded yet.
                    </td>
                  </tr>
                )}
                {trades.map((t) => (
                  <tr key={t.id} className="border-t border-base-700">
                    <td className="py-2 text-ink-100">{t.symbol}</td>
                    <td className="py-2 capitalize text-ink-300">{t.direction}</td>
                    <td className="tabular py-2 text-ink-300">{t.lot_size}</td>
                    <td className="tabular py-2 text-ink-300">{t.entry_price}</td>
                    <td
                      className={`tabular py-2 ${
                        (t.pnl ?? 0) >= 0 ? "text-signal-teal" : "text-signal-red"
                      }`}
                    >
                      {t.pnl ?? "—"}
                    </td>
                    <td className="py-2 text-ink-500">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {settings && usage && <CapProgress settings={settings} usage={usage} />}

          <div className="rounded-lg border border-base-700 bg-base-800 p-4">
            <p className="mb-3 text-xs font-medium text-ink-300">Risk settings</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Max drawdown kill-switch</span>
                <span className="tabular text-ink-100">{account.max_drawdown_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Daily loss limit</span>
                <span className="tabular text-ink-100">{account.daily_loss_limit_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Risk tier</span>
                <span className="capitalize text-ink-100">{account.risk_tier}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
