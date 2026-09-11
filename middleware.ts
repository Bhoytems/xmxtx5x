import { NextRequest, NextResponse } from "next/server";

// Protects everything under /dashboard behind the passcode gate.
// The session cookie is set by /api/auth after a correct passcode.
export function middleware(req: NextRequest) {
  const session = req.cookies.get("desk_session")?.value;

  if (session === "granted") {
    return NextResponse.next();
  }

  const gateUrl = new URL("/gate", req.url);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
