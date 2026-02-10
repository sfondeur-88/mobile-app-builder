import { getRevisions } from "@/lib/api/getRevisions";
import { getSessionCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const configId = parseInt(id);

    if (isNaN(configId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const revisions = await getRevisions(configId);

    return NextResponse.json({
      success: true,
      data: revisions,
    });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}