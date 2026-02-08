import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET Configuration by ID.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Fetch the configuration
    const [config] = await db
      .select()
      .from(configurations)
      .where(eq(configurations.id, configId));

    if (!config) {
      return NextResponse.json(
        { error: `Configuration with ID: ${configId} not found` },
        { status: 404 }
      );
    }

    // Fetch the latest revision
    const [latestRevision] = await db
      .select()
      .from(configurationRevisions)
      .where(eq(configurationRevisions.configurationId, configId))
      .orderBy(desc(configurationRevisions.revisionNumber))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        latestRevision: latestRevision ? {
          ...latestRevision,
          content: latestRevision.content
        } : null,
      },
    });

  } catch (err) {
    console.error('Failed to fetch configuration:', err);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}