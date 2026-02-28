import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stats } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (eventId) {
      const eventStats = await db
        .select()
        .from(stats)
        .where(eq(stats.eventId, parseInt(eventId)));
      return NextResponse.json(eventStats);
    }

    const allStats = await db.select().from(stats);
    return NextResponse.json(allStats);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, eventId, points, wins, losses, bullseyes, triples } = body;

    if (!playerId || !eventId) {
      return NextResponse.json(
        { error: "Player ID and Event ID are required" },
        { status: 400 }
      );
    }

    const [newStat] = await db
      .insert(stats)
      .values({
        playerId,
        eventId,
        points: points || 0,
        wins: wins || 0,
        losses: losses || 0,
        bullseyes: bullseyes || 0,
        triples: triples || 0,
      })
      .returning();

    return NextResponse.json(newStat, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create stats" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    const eventId = searchParams.get("eventId");

    if (!playerId || !eventId) {
      return NextResponse.json(
        { error: "Player ID and Event ID are required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { points, wins, losses, bullseyes, triples } = body;

    // Check if stats exist
    const existing = await db
      .select()
      .from(stats)
      .where(
        and(
          eq(stats.playerId, parseInt(playerId)),
          eq(stats.eventId, parseInt(eventId))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      const [updatedStat] = await db
        .update(stats)
        .set({
          points: points ?? existing[0].points,
          wins: wins ?? existing[0].wins,
          losses: losses ?? existing[0].losses,
          bullseyes: bullseyes ?? existing[0].bullseyes,
          triples: triples ?? existing[0].triples,
        })
        .where(eq(stats.id, existing[0].id))
        .returning();

      return NextResponse.json(updatedStat);
    } else {
      // Create new
      const [newStat] = await db
        .insert(stats)
        .values({
          playerId: parseInt(playerId),
          eventId: parseInt(eventId),
          points: points || 0,
          wins: wins || 0,
          losses: losses || 0,
          bullseyes: bullseyes || 0,
          triples: triples || 0,
        })
        .returning();

      return NextResponse.json(newStat, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
