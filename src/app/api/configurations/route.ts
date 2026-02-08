import { getSessionCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import { configurationRevisions, configurations } from "@/lib/db/schema";
import { createConfigurationSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import z from "zod";

// GET Configurations
export async function GET() {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const allConfigurations = await db
      .select()
      .from(configurations)
      .orderBy(configurations.updatedAt);

    return NextResponse.json({
      success: true,
      data: allConfigurations,
    });

  } catch (err) {
    console.error('Failed to fetch all configurations: ', err);

    return NextResponse.json(
      { error: 'Failed to fetch all configurations' },
      { status: 500 },
    );
  }
}

// POST Configuration
export async function POST(request: Request) {
  const session = await getSessionCookies();

  if (!session.isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const schemaData = createConfigurationSchema.parse(body);

    const result = await db.transaction(async (tx) => {
      const [newConfig] = await tx
        .insert(configurations)
        .values({
          name: schemaData.name,
          isPublished: false,
        })
        .returning();

      await tx
        .insert(configurationRevisions)
        .values({
          configurationId: newConfig.id,
          revisionNumber: 1,
          content: schemaData.content,
          isPublished: false,
        });

      return newConfig;
    });

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.issues },
        { status: 400 }
      );
    }

    console.error('Failed to create configuration: ', err);
    return NextResponse.json(
      { error: 'Failed to create configuration' },
      { status: 500 }
    );
  }
}