import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";

export async function GET() {
  try {
    const allPlayers = await db.select().from(players).orderBy(players.name);
    return NextResponse.json(allPlayers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, photoUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const [newPlayer] = await db
      .insert(players)
      .values({ name, photoUrl })
      .returning();

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
