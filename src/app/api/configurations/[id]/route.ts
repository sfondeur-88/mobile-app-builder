import { getConfigurationById } from "@/lib/api/getConfigurationById";
import { getSessionCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET Configuration by ID.
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

    const config = await getConfigurationById(configId);

    if (!config) {
      return NextResponse.json(
        { error: `Configuration ${configId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
    });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}