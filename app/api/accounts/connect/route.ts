import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mt5Connector } from "@/lib/mt5Connector";

export async function POST(req: Request) {
  const body = await req.json();
  const { client_name, broker, platform, login, password, server, risk_tier } = body;

  if (!client_name || !broker || !platform || !login || !password || !server) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // The password is forwarded to the connector and never touches our
  // own database — only the connectionRef it returns gets persisted.
  let connectionRef: string;
  try {
    const result = await mt5Connector.provisionAccount({ platform, login, password, server });
    connectionRef = result.connectionRef;
  } catch (err: any) {
    return NextResponse.json(
      { error: `Could not connect to broker: ${err.message}` },
      { status: 502 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .insert({
      client_name,
      broker,
      mt_login: login,
      platform,
      connection_ref: connectionRef,
      risk_tier: risk_tier ?? "standard",
      status: "connected",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from("trade_cap_settings").insert({ account_id: data.id });
  await supabaseAdmin.from("trade_cap_usage").insert({ account_id: data.id });

  return NextResponse.json({ account: data });
}
