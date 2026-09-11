import { NextRequest, NextResponse } from "next/server";

// Passcode lives in an env var in production — DESK_PASSCODE.
// Falls back to the default below only if the env var isn't set,
// so don't forget to set DESK_PASSCODE in Vercel's project settings.
const PASSCODE = process.env.DESK_PASSCODE || "022005";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (code !== PASSCODE) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("desk_session", "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hour session
  });
  return res;
}
