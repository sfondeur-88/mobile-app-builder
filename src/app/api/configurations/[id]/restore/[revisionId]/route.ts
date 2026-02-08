import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Restore a prior revision
// Copies content from old revision to a newly created Revision
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; revisionId: string }> }
) {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id, revisionId } = await params;
    const configId = parseInt(id);
    const revId = parseInt(revisionId);

    if (isNaN(configId) || isNaN(revId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [config] = await tx
        .select()
        .from(configurations)
        .where(eq(configurations.id, configId));

      if (!config) {
        throw new Error('Configuration not found');
      }

      const [revisionToRestore] = await tx
        .select()
        .from(configurationRevisions)
        .where(eq(configurationRevisions.id, revId));

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

      // Create new revision with restored content
      const [newRevision] = await tx
        .insert(configurationRevisions)
        .values({
          configurationId: configId,
          revisionNumber: nextRevisionNumber,
          content: revisionToRestore.content,
          isPublished: false,
        })
        .returning();

      // Update timestamp
      await tx
        .update(configurations)
        .set({ updatedAt: new Date() })
        .where(eq(configurations.id, configId));

      return newRevision;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err) {
    if (err instanceof Error && err.message === 'Configuration not found') {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    if (err instanceof Error && err.message === 'Revision not found') {
      return NextResponse.json(
        { error: 'Revision not found' },
        { status: 404 }
      );
    }

    if (err instanceof Error && err.message === 'Revision does not belong to this configuration') {
      return NextResponse.json(
        { error: 'Revision does not belong to this configuration' },
        { status: 400 }
      );
    }

    console.error('Failed to restore revision:', err);
    return NextResponse.json(
      { error: 'Failed to restore revision' },
      { status: 500 }
    );
  }
}