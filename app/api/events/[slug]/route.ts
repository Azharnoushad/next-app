import { NextRequest, NextResponse } from "next/server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

type RouteParams = {
  slug?: string;
};

/**
 * GET /api/events/[slug]
 * Returns a single event matched by its slug.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const params = await context.params;
    const slug = params?.slug?.trim().toLowerCase();

    if (!slug) {
      return NextResponse.json(
        { message: "A valid event slug is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";

    console.error("GET /api/events/[slug] failed:", errorMessage);

    return NextResponse.json(
      {
        message: "Failed to fetch event.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
