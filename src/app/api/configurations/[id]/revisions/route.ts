import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurationRevisions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
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

    const revisions = await db
      .select()
      .from(configurationRevisions)
      .where(eq(configurationRevisions.configurationId, configId))
      .orderBy(desc(configurationRevisions.revisionNumber));

    return NextResponse.json({
      success: true,
      data: revisions,
    });

  } catch (err) {
    console.error('Failed to fetch revisions:', err);
    return NextResponse.json(
      { error: 'Failed to fetch revisions' },
      { status: 500 }
    );
  }
}