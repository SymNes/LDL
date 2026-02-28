import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, parseInt(id)))
        .limit(1);
      return NextResponse.json(event ? [event] : []);
    }

    const allEvents = await db.select().from(events).orderBy(desc(events.date));
    return NextResponse.json(allEvents);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, date, season, description } = body;

    if (!type || !date || !season) {
      return NextResponse.json(
        { error: "Type, date, and season are required" },
        { status: 400 }
      );
    }

    // Parse date and store at noon UTC to avoid timezone issues
    const dateStr = date === "" ? "" : `${date}T12:00:00.000Z`;
    const eventDate = dateStr ? new Date(dateStr) : new Date();

    const [newEvent] = await db
      .insert(events)
      .values({
        type,
        date: eventDate,
        season,
        description,
      })
      .returning();

    return NextResponse.json(newEvent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, date, season, description } = body;

    if (!type || !date || !season) {
      return NextResponse.json(
        { error: "Type, date, and season are required" },
        { status: 400 }
      );
    }

    // Parse date and store at noon UTC to avoid timezone issues
    const dateStr = `${date}T12:00:00.000Z`;
    const eventDate = new Date(dateStr);

    const [updatedEvent] = await db
      .update(events)
      .set({
        type,
        date: eventDate,
        season,
        description,
      })
      .where(eq(events.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedEvent);
  } catch {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await db.delete(events).where(eq(events.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
