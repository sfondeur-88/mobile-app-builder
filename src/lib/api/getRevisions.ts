import { db } from "@/lib/db";
import { configurationRevisions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getRevisions(configId: number) {
  const revisions = await db
    .select()
    .from(configurationRevisions)
    .where(eq(configurationRevisions.configurationId, configId))
    .orderBy(desc(configurationRevisions.revisionNumber));

  return revisions;
}