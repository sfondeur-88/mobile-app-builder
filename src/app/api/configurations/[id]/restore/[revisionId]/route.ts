import { restoreRevision } from "@/lib/api/restoreRevision";
import { getSessionCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; revisionId: string }> }
) {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, revisionId } = await params;
    const configId = parseInt(id);
    const revId = parseInt(revisionId);

    if (isNaN(configId) || isNaN(revId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const newRevision = await restoreRevision(configId, revId);

    return NextResponse.json({
      success: true,
      data: newRevision,
    });

  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) {
      return NextResponse.json(
        { error: err.message },
        { status: 404 }
      );
    }

    if (err instanceof Error && err.message.includes('does not belong')) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}