import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function restoreRevision(configId: number, revisionId: number) {
  return await db.transaction(async (tx) => {
    const [config] = await tx
      .select()
      .from(configurations)
      .where(eq(configurations.id, configId));

    if (!config) {
      throw new Error('Configuration not found');
    }

    // Get revision to restore.
    const [revisionToRestore] = await tx
      .select()
      .from(configurationRevisions)
      .where(eq(configurationRevisions.id, revisionId));

    if (!revisionToRestore) {
      throw new Error('Revision not found');
    }

    if (revisionToRestore.configurationId !== configId) {
      throw new Error('Revision does not belong to this configuration');
    }

    const [latestRevision] = await tx
      .select()
      .from(configurationRevisions)
      .where(eq(configurationRevisions.configurationId, configId))
      .orderBy(desc(configurationRevisions.revisionNumber))
      .limit(1);

    const nextRevisionNumber = latestRevision ? latestRevision.revisionNumber + 1 : 1;

    // Create new revision with restored content.
    const [newRevision] = await tx
      .insert(configurationRevisions)
      .values({
        configurationId: configId,
        revisionNumber: nextRevisionNumber,
        content: revisionToRestore.content,
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