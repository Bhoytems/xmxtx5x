import TopBar from "@/components/TopBar";
import KpiCard from "@/components/KpiCard";
import EquityChart from "@/components/EquityChart";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAccounts() {
  const { data } = await supabaseAdmin.from("client_accounts").select("*");
  return data ?? [];
}

export default async function OverviewPage() {
  const accounts = await getAccounts();

  const totalAum = accounts.reduce((sum, a) => sum + Number(a.equity ?? 0), 0);
  const totalOpenPnl = accounts.reduce((sum, a) => sum + Number(a.open_pnl ?? 0), 0);
  const activeAccounts = accounts.filter((a) => a.status === "connected").length;
  const atRisk = accounts.filter((a) => Number(a.drawdown_pct ?? 0) >= 15).length;

  return (
    <div>
      <TopBar title="Overview" />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Total AUM" value={`$${totalAum.toLocaleString()}`} />
          <KpiCard
            label="Aggregate open P&L"
            value={`${totalOpenPnl >= 0 ? "+" : ""}$${totalOpenPnl.toLocaleString()}`}
            deltaPositive={totalOpenPnl >= 0}
            delta={totalOpenPnl >= 0 ? "In profit" : "In drawdown"}
          />
          <KpiCard label="Active accounts" value={String(activeAccounts)} />
          <KpiCard
            label="Drawdown warnings"
            value={String(atRisk)}
            delta={atRisk > 0 ? "Needs attention" : "All clear"}
            deltaPositive={atRisk === 0}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-lg border border-base-700 bg-base-800 p-4">
            <p className="mb-4 text-xs font-medium text-ink-300">
              Aggregate equity curve
            </p>
            <EquityChart />
          </div>

          <div className="rounded-lg border border-base-700 bg-base-800 p-4">
            <p className="mb-3 text-xs font-medium text-ink-300">Alerts</p>
            {accounts.length === 0 ? (
              <p className="text-sm text-ink-500">
                No accounts connected yet. Add your first client account to
                start seeing live status here.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {accounts
                  .filter((a) => a.status !== "connected" || Number(a.drawdown_pct) >= 15)
                  .map((a) => (
                    <li key={a.id} className="text-ink-300">
                      <span className="text-signal-amber">{a.client_name}</span>{" "}
                      {a.status !== "connected" ? "disconnected" : "approaching drawdown limit"}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
