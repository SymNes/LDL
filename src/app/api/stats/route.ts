import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stats } from "@/lib/db/schema";

export async function GET() {
  try {
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
