import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { ConfigurationContent } from "@/types";
import { desc, eq } from "drizzle-orm";

export async function saveConfiguration(
  configId: number,
  content: ConfigurationContent
) {
  return await db.transaction(async (tx) => {
    const [config] = await tx
      .select()
      .from(configurations)
      .where(eq(configurations.id, configId));

    if (!config) {
      throw new Error(`Configuration ${configId} not found`);
    }

    const [latestRevision] = await tx
      .select()
      .from(configurationRevisions)
      .where(eq(configurationRevisions.configurationId, configId))
      .orderBy(desc(configurationRevisions.revisionNumber))
      .limit(1);

    const nextRevisionNumber = latestRevision ? latestRevision.revisionNumber + 1 : 1;

    const [newRevision] = await tx
      .insert(configurationRevisions)
      .values({
        configurationId: configId,
        revisionNumber: nextRevisionNumber,
        content: content,
        isPublished: false,
      })
      .returning();

    await tx
      .update(configurations)
      .set({ updatedAt: new Date() })
      .where(eq(configurations.id, configId));

    return newRevision;
  });
}