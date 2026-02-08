import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const configId = parseInt(id);

    if (isNaN(configId)) {
      return NextResponse.json(
        { error: 'Invalid configuration ID' },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [config] = await tx
        .select()
        .from(configurations)
        .where(eq(configurations.id, configId));

      if (!config) {
        throw new Error(`Configuration with ID: ${configId} not found`);
      }

      const [latestRevision] = await tx
        .select()
        .from(configurationRevisions)
        .where(eq(configurationRevisions.configurationId, configId))
        .orderBy(desc(configurationRevisions.revisionNumber))
        .limit(1);

      if (!latestRevision) {
        throw new Error('No revisions found');
      }

      // Unpublish all previous revisions for this config
      await tx
        .update(configurationRevisions)
        .set({ isPublished: false })
        .where(eq(configurationRevisions.configurationId, configId));

      // Then we update the latest revision only - `isPublished` -> true
      await tx
        .update(configurationRevisions)
        .set({ isPublished: true })
        .where(eq(configurationRevisions.id, latestRevision.id));

      // Update configuration
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

    if (err instanceof Error && err.message === 'No revisions found') {
      return NextResponse.json(
        { error: 'No revisions to publish' },
        { status: 400 }
      );
    }

    console.error('Failed to publish configuration:', err);
    return NextResponse.json(
      { error: 'Failed to publish configuration' },
      { status: 500 }
    );
  }
}