import { NextResponse } from "next/server";
import { getSessionCookies } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSessionCookies();
    session.destroy();

    // TODO:Shane - redirect back to login.
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}