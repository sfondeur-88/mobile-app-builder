import { SessionData, sessionOptions } from "@/lib/auth";
import { getIronSession } from "iron-session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  // Protect all routes except /login and /api/auth
  if (!session.isAuthenticated && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/api/auth")) {
    console.log('Redirecting to login...');
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to home if authenticated and trying to access login
  if (session.isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// TODO:Shane - check if we need this.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};