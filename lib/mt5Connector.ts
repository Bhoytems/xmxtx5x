/**
 * MT4/MT5 connector interface.
 *
 * This file defines the contract the rest of the app codes against.
 * It is NOT wired to a live broker yet — there's no MT4/5 credential,
 * MetaApi token, or broker API key available in this environment.
 *
 * To go live, pick ONE of these and implement the methods below:
 *
 *  1. MetaApi (metaapi.cloud) — cloud-hosted MT4/5 API, handles many
 *     accounts well, official REST + WebSocket SDK. Recommended for
 *     Tier 2 managed accounts since it supports investor-password-only
 *     connections for read data and a separate trading API scope.
 *
 *  2. Broker-native PAMM/MAM or copy-trading API — if your broker
 *     offers this, it's the lowest-custody-risk option since you never
 *     hold the client's login at all, only a "follow" relationship.
 *
 *  3. A self-hosted bridge (MT4/5 Expert Advisor <-> your server via
 *     a local socket/HTTP bridge) — more control, more infra to run
 *     and secure yourself.
 *
 * Whichever you pick, never persist a client's live trading password in
 * this app's database. Store only the connection_ref (e.g. MetaApi
 * account id) — the credential itself belongs in the broker's or
 * MetaApi's own vault, not yours.
 */

export interface AccountSnapshot {
  balance: number;
  equity: number;
  openPnl: number;
  marginLevel: number;
}

export interface OpenPosition {
  ticket: string;
  symbol: string;
  direction: "buy" | "sell";
  lotSize: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
}

export interface OrderRequest {
  symbol: string;
  direction: "buy" | "sell";
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Mt5Connector {
  getAccountSnapshot(connectionRef: string): Promise<AccountSnapshot>;
  getOpenPositions(connectionRef: string): Promise<OpenPosition[]>;
  placeOrder(connectionRef: string, order: OrderRequest): Promise<{ ticket: string }>;
  closePosition(connectionRef: string, ticket: string): Promise<void>;
  getCandles(
    connectionRef: string,
    symbol: string,
    timeframe: "M1" | "M5" | "M15" | "H1" | "H4" | "D1",
    count: number
  ): Promise<{ time: number; open: number; high: number; low: number; close: number }[]>;
}

/**
 * Placeholder implementation so the rest of the app (UI, risk engine,
 * strategy logic) runs and can be demoed against realistic-looking
 * mock data before a real broker connection is wired in.
 *
 * Replace this export with a real implementation of Mt5Connector
 * (e.g. `class MetaApiConnector implements Mt5Connector { ... }`)
 * once you've chosen a connection method above.
 */
export class MockMt5Connector implements Mt5Connector {
  async getAccountSnapshot(): Promise<AccountSnapshot> {
    return { balance: 10000, equity: 10240, openPnl: 240, marginLevel: 1850 };
  }
  async getOpenPositions(): Promise<OpenPosition[]> {
    return [];
  }
  async placeOrder(): Promise<{ ticket: string }> {
    throw new Error(
      "No live MT4/MT5 connector configured. Implement Mt5Connector and replace MockMt5Connector."
    );
  }
  async closePosition(): Promise<void> {
    throw new Error("No live MT4/MT5 connector configured.");
  }
  async getCandles() {
    return [];
  }
}

export const mt5Connector: Mt5Connector = new MockMt5Connector();
