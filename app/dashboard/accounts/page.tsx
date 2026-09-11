import Link from "next/link";
import TopBar from "@/components/TopBar";
import { supabaseAdmin } from "@/lib/supabase";

async function getAccounts() {
  const { data } = await supabaseAdmin
    .from("client_accounts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const statusColor: Record<string, string> = {
  connected: "text-signal-teal",
  disconnected: "text-signal-red",
  paused: "text-signal-amber",
};

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div>
      <TopBar title="Client accounts" />
      <div className="p-6">
        <div className="mb-4 flex justify-end">
          <Link
            href="/dashboard/accounts/new"
            className="rounded bg-signal-teal px-3 py-1.5 text-xs font-medium text-base-950"
          >
            Connect account
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-base-700">
          <table className="w-full text-sm">
            <thead className="bg-base-800 text-left text-xs text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Broker</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Equity</th>
                <th className="px-4 py-3 font-medium">Open P&L</th>
                <th className="px-4 py-3 font-medium">Drawdown</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-500">
                    No client accounts yet.
                  </td>
                </tr>
              )}
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-base-700 hover:bg-base-800/50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/accounts/${a.id}`} className="text-ink-100 hover:text-signal-teal">
                      {a.client_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{a.broker}</td>
                  <td className="tabular px-4 py-3 text-ink-300">${Number(a.balance).toLocaleString()}</td>
                  <td className="tabular px-4 py-3 text-ink-300">${Number(a.equity).toLocaleString()}</td>
                  <td
                    className={`tabular px-4 py-3 ${
                      Number(a.open_pnl) >= 0 ? "text-signal-teal" : "text-signal-red"
                    }`}
                  >
                    {Number(a.open_pnl) >= 0 ? "+" : ""}
                    ${Number(a.open_pnl).toLocaleString()}
                  </td>
                  <td className="tabular px-4 py-3 text-ink-300">{Number(a.drawdown_pct).toFixed(1)}%</td>
                  <td className={`px-4 py-3 capitalize ${statusColor[a.status] ?? "text-ink-500"}`}>
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
