"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(true);
      setCode("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-900 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-sm bg-signal-teal" />
          <h1 className="text-lg font-medium text-ink-100">Desk</h1>
          <p className="mt-1 text-sm text-ink-500">
            Enter the passcode to continue
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded border border-base-600 bg-base-800 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-ink-100 outline-none focus:border-signal-teal"
            placeholder="••••••"
            maxLength={8}
          />
          {error && (
            <p className="text-center text-sm text-signal-red">
              Incorrect passcode
            </p>
          )}
          <button
            type="submit"
            disabled={loading || code.length === 0}
            className="w-full rounded bg-signal-teal py-3 text-sm font-medium text-base-950 transition disabled:opacity-40"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
