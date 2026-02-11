import { db } from "@/lib/db";
import { configurations } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function BuilderPage() {
  // Fetch most recent configuration.
  const userConfigs = await db
    .select()
    .from(configurations)
    .orderBy(desc(configurations.updatedAt))
    .limit(1);

  // If user has configs, redirect to the most recent one.
  if (userConfigs.length > 0) {
    redirect(`/builder/${userConfigs[0].id}`);
  }

  // Else, if we have no configs, redirect to the new config page.
  redirect('/builder/new');
}