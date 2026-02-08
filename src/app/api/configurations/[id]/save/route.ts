import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurations, configurationRevisions } from "@/lib/db/schema";
import { updateConfigurationSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

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

    const body = await request.json();
    const schemaData = updateConfigurationSchema.parse(body);

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

      const nextRevisionNumber = latestRevision ? latestRevision.revisionNumber + 1 : 1;

      // Create new revision
      const [newRevision] = await tx
        .insert(configurationRevisions)
        .values({
          configurationId: configId,
          revisionNumber: nextRevisionNumber,
          content: schemaData.content,
          isPublished: false,
        })
        .returning();

      // Update configuration's updatedAt
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
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.issues },
        { status: 400 }
      );
    }

    if (err instanceof Error && err.message === 'Configuration not found') {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    console.error('Failed to save configuration:', err);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}