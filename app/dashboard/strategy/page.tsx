import TopBar from "@/components/TopBar";
import { supabaseAdmin } from "@/lib/supabase";

async function getSignalLog() {
  const { data } = await supabaseAdmin
    .from("signal_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);
  return data ?? [];
}

const actionColor: Record<string, string> = {
  executed: "text-signal-teal",
  skipped_cap_reached: "text-signal-amber",
  skipped_no_confluence: "text-ink-500",
};

export default async function StrategyPage() {
  const log = await getSignalLog();

  return (
    <div>
      <TopBar title="Strategy" />
      <div className="space-y-4 p-6">
        <div className="rounded-lg border border-base-700 bg-base-800 p-4">
          <p className="mb-2 text-xs font-medium text-ink-300">Active model</p>
          <p className="text-sm text-ink-100">ICT / SMC confluence</p>
          <p className="mt-1 text-xs text-ink-500">
            Requires: liquidity sweep → confirmed BOS/CHoCH → entry at order
            block or fair value gap → aligned with higher-timeframe bias →
            within discount (longs) or premium (shorts) zone. Partial matches
            do not execute.
          </p>
        </div>

        <div className="rounded-lg border border-base-700 bg-base-800 p-4">
          <p className="mb-3 text-xs font-medium text-ink-300">Signal log</p>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-500">
              <tr>
                <th className="py-2 font-medium">Time</th>
                <th className="py-2 font-medium">Symbol</th>
                <th className="py-2 font-medium">Bias</th>
                <th className="py-2 font-medium">Criteria matched</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-500">
                    No signals logged yet — this fills in once the engine is
                    connected to a live price feed.
                  </td>
                </tr>
              )}
              {log.map((entry) => (
                <tr key={entry.id} className="border-t border-base-700">
                  <td className="py-2 text-ink-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 text-ink-100">{entry.symbol}</td>
                  <td className="py-2 capitalize text-ink-300">{entry.bias}</td>
                  <td className="py-2 text-ink-500">{entry.criteria_matched.join(", ")}</td>
                  <td className={`py-2 ${actionColor[entry.action] ?? "text-ink-500"}`}>
                    {entry.action.replace(/_/g, " ")}
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
