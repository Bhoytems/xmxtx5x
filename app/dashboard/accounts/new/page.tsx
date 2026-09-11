"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";

export default function NewAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    client_name: "",
    broker: "",
    platform: "mt5",
    login: "",
    password: "",
    server: "",
    risk_tier: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/accounts/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/accounts");
    } else {
      const body = await res.json();
      setError(body.error ?? "Something went wrong");
    }
  }

  return (
    <div>
      <TopBar title="Connect a client account" />
      <div className="p-6">
        <form onSubmit={submit} className="max-w-md space-y-4 rounded-lg border border-base-700 bg-base-800 p-6">
          <div className="rounded border border-signal-tealDim bg-base-900 p-3 text-xs text-ink-500">
            Use the client&apos;s <span className="text-ink-300">investor (read-only) password</span> wherever
            the broker offers one. This password is sent directly to the
            broker/connection provider and is never stored in this app&apos;s
            database.
          </div>

          <Field label="Client name">
            <input
              required
              value={form.client_name}
              onChange={(e) => update("client_name", e.target.value)}
              className="input"
              placeholder="Jane Doe"
            />
          </Field>

          <Field label="Broker">
            <input
              required
              value={form.broker}
              onChange={(e) => update("broker", e.target.value)}
              className="input"
              placeholder="IC Markets"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <select
                value={form.platform}
                onChange={(e) => update("platform", e.target.value)}
                className="input"
              >
                <option value="mt4">MT4</option>
                <option value="mt5">MT5</option>
              </select>
            </Field>
            <Field label="Server">
              <input
                required
                value={form.server}
                onChange={(e) => update("server", e.target.value)}
                className="input"
                placeholder="ICMarkets-Live01"
              />
            </Field>
          </div>

          <Field label="Login (account number)">
            <input
              required
              value={form.login}
              onChange={(e) => update("login", e.target.value)}
              className="input tabular"
              placeholder="1234567"
            />
          </Field>

          <Field label="Password (investor password preferred)">
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Risk tier">
            <select
              value={form.risk_tier}
              onChange={(e) => update("risk_tier", e.target.value)}
              className="input"
            >
              <option value="conservative">Conservative</option>
              <option value="standard">Standard</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </Field>

          {error && <p className="text-sm text-signal-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-signal-teal py-2.5 text-sm font-medium text-base-950 disabled:opacity-40"
          >
            {loading ? "Connecting…" : "Connect account"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #0f1417;
          border: 1px solid #262f35;
          border-radius: 5px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #e8ecee;
          outline: none;
        }
        .input:focus {
          border-color: #3dd9c4;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-ink-500">{label}</span>
      {children}
    </label>
  );
}
