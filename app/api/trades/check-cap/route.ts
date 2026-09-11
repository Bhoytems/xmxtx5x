import { NextResponse } from "next/server";
import { checkTradeCap } from "@/lib/riskEngine";

export async function POST(req: Request) {
  const { accountId } = await req.json();
  if (!accountId) {
    return NextResponse.json({ error: "accountId required" }, { status: 400 });
  }
  const result = await checkTradeCap(accountId);
  return NextResponse.json(result);
}
