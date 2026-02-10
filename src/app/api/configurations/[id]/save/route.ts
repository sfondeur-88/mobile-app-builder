import { saveConfiguration } from "@/lib/api/saveConfiguration";
import { getSessionCookies } from "@/lib/auth";
import { updateConfigurationSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(
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

    const body = await request.json();
    const { content } = updateConfigurationSchema.parse(body);

    const newRevision = await saveConfiguration(configId, content);

    return NextResponse.json({
      success: true,
      data: newRevision,
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.issues },
        { status: 400 }
      );
    }

    if (err instanceof Error && err.message.includes('not found')) {
      return NextResponse.json(
        { error: err.message },
        { status: 404 }
      );
    }

    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}