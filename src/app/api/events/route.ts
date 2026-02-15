import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allEvents = await db.select().from(events).orderBy(desc(events.date));
    return NextResponse.json(allEvents);
  } catch (error) {
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

    const [newEvent] = await db
      .insert(events)
      .values({
        type,
        date: new Date(date),
        season,
        description,
      })
      .returning();

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
