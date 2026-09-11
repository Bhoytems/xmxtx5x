import TopBar from "@/components/TopBar";
import { supabaseAdmin } from "@/lib/supabase";

async function getAccounts() {
  const { data } = await supabaseAdmin.from("client_accounts").select("id, client_name, equity, balance");
  return data ?? [];
}

export default async function ReportsPage() {
  const accounts = await getAccounts();

  return (
    <div>
      <TopBar title="Reports" />
      <div className="p-6">
        <div className="rounded-lg border border-base-700 bg-base-800 p-4">
          <p className="mb-3 text-xs font-medium text-ink-300">Client statements</p>
          <p className="mb-4 text-xs text-ink-500">
            Generate a period statement per client to send them directly —
            builds trust by showing transparent, verifiable performance.
          </p>
          <ul className="divide-y divide-base-700">
            {accounts.length === 0 && (
              <li className="py-4 text-sm text-ink-500">No client accounts yet.</li>
            )}
            {accounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <span className="text-sm text-ink-100">{a.client_name}</span>
                <button className="rounded border border-base-600 px-3 py-1 text-xs text-ink-300 hover:border-signal-teal hover:text-signal-teal">
                  Generate statement
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
