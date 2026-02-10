import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function publishConfiguration(configId: number) {
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

    if (!latestRevision) {
      throw new Error('No revisions found to publish');
    }

    // Unpublish all previous revisions for this config.
    await tx
      .update(configurationRevisions)
      .set({ isPublished: false })
      .where(eq(configurationRevisions.configurationId, configId));

    // Then Publish the latest revision after.
    await tx
      .update(configurationRevisions)
      .set({ isPublished: true })
      .where(eq(configurationRevisions.id, latestRevision.id));

    // Update configuration.
    const [updatedConfig] = await tx
      .update(configurations)
      .set({
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(configurations.id, configId))
      .returning();

    return updatedConfig;
  });
}