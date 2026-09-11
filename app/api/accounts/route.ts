import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ accounts: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .insert({
      client_name: body.client_name,
      broker: body.broker,
      mt_login: body.mt_login,
      platform: body.platform,
      connection_ref: body.connection_ref ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Seed default cap settings and usage rows for the new account.
  await supabaseAdmin.from("trade_cap_settings").insert({ account_id: data.id });
  await supabaseAdmin.from("trade_cap_usage").insert({ account_id: data.id });

  return NextResponse.json({ account: data });
}
