import { getSessionCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const session = await getSessionCookies();
    session.destroy();
  } catch (error) {
    console.error('Failed to destroy session:', error);
  }

  redirect('/login');
}