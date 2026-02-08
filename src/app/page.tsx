import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  redirect("/builder");
}