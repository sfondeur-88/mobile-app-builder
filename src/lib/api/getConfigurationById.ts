import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { ConfigWithRevision } from "@/types";
import { desc, eq } from "drizzle-orm";

export async function getConfigurationById(id: number): Promise<ConfigWithRevision | null> {
  const [config] = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, id));

  if (!config) return null;

  const [latestRevision] = await db
    .select()
    .from(configurationRevisions)
    .where(eq(configurationRevisions.configurationId, id))
    .orderBy(desc(configurationRevisions.revisionNumber))
    .limit(1);

  return {
    ...config,
    latestRevision: latestRevision ?? null
  };
}