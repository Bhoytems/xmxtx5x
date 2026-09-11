# Desk — MT4/MT5 Managed Account System

Admin console for running the ICT/SMC confluence strategy across client
MT4/MT5 accounts, with daily/weekly/monthly/yearly trade caps and a
passcode-gated dashboard. Built for Vercel + Supabase.

## What's real vs. what needs wiring

**Fully built and functional:**
- Passcode gate (`/gate`, middleware-protected `/dashboard`)
- Supabase schema: accounts, trade caps, trades, signal log, engine controls
- Trade cap logic (`lib/riskEngine.ts`) — checks and rolls over daily/weekly/monthly/yearly counters correctly
- ICT/SMC confluence detection logic (`lib/strategy.ts`) — the actual rules: liquidity sweep → BOS/CHoCH → order block/FVG entry → HTF bias alignment → premium/discount filter
- Full admin UI: overview, accounts list, account detail, strategy/signal log, reports

**Needs your input before going live:**
- **MT4/MT5 connection** (`lib/mt5Connector.ts`) — this is a clean interface with a mock implementation. You must implement it against MetaApi, a broker's PAMM/copy-trading API, or a self-hosted bridge. This is the one piece that genuinely can't be built without live broker credentials.
- **Passcode strength** — a single shared passcode is fine for a small early setup, but isn't real per-user auth. Once you have more than one operator or want audit trails of who did what, switch to Supabase Auth (email/password or magic link) instead.
- **Kill switch wiring** — the pause button in the UI is built but not yet connected to an API route that flips `engine_controls.global.is_paused`; add that route and have your trade-execution loop check it before firing.
- **Equity chart** — currently placeholder data; wire it to a daily snapshot table once you're recording real account history.

## Setup

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in your Supabase keys.
3. `npm install`
4. `npm run dev` to test locally.
5. Push to a GitHub repo, import it into Vercel, and add the same env vars in the Vercel project settings (including a real `DESK_PASSCODE`, not the default).
6. Once you've picked a MT4/5 connection method, implement `Mt5Connector` in `lib/mt5Connector.ts` and swap out `MockMt5Connector`.

## Legal reminder

Before connecting real client money: check your jurisdiction's rules on
managing third-party trading accounts for a fee. Using a broker's
official PAMM/MAM or copy-trading rails (rather than holding a client's
full trading password yourself) is generally the lowest-risk path.
