import { db } from "./index";
import { players, events, stats } from "./schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function getTopPlayersByPoints(limit: number = 3) {
  const result = await db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      totalPoints: sql<number>`sum(${stats.points})`.as("totalPoints"),
    })
    .from(players)
    .leftJoin(stats, eq(players.id, stats.playerId))
    .groupBy(players.id, players.name, players.photoUrl)
    .orderBy(desc(sql`totalPoints`))
    .limit(limit);

  return result;
}

export async function getTopPlayersByBullseyes(limit: number = 3) {
  const result = await db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      totalBullseyes: sql<number>`sum(${stats.bullseyes})`.as("totalBullseyes"),
    })
    .from(players)
    .leftJoin(stats, eq(players.id, stats.playerId))
    .groupBy(players.id, players.name, players.photoUrl)
    .orderBy(desc(sql`totalBullseyes`))
    .limit(limit);

  return result;
}

export async function getTopPlayersByTriples(limit: number = 3) {
  const result = await db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      totalTriples: sql<number>`sum(${stats.triples})`.as("totalTriples"),
    })
    .from(players)
    .leftJoin(stats, eq(players.id, stats.playerId))
    .groupBy(players.id, players.name, players.photoUrl)
    .orderBy(desc(sql`totalTriples`))
    .limit(limit);

  return result;
}

export async function getAllPlayers() {
  return db.select().from(players).orderBy(players.name);
}

export async function getPlayerById(id: number) {
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.id, id))
    .limit(1);
  return player;
}

export async function getPlayerStatsBySeason(playerId: number) {
  return db
    .select({
      season: events.season,
      totalPoints: sql<number>`sum(${stats.points})`.as("totalPoints"),
      totalWins: sql<number>`sum(${stats.wins})`.as("totalWins"),
      totalLosses: sql<number>`sum(${stats.losses})`.as("totalLosses"),
      totalBullseyes: sql<number>`sum(${stats.bullseyes})`.as("totalBullseyes"),
      totalTriples: sql<number>`sum(${stats.triples})`.as("totalTriples"),
      eventsPlayed: sql<number>`count(${stats.eventId})`.as("eventsPlayed"),
    })
    .from(stats)
    .innerJoin(events, eq(stats.eventId, events.id))
    .where(eq(stats.playerId, playerId))
    .groupBy(events.season)
    .orderBy(desc(events.season));
}

export async function getAllEvents() {
  return db
    .select()
    .from(events)
    .orderBy(desc(events.date));
}

export async function getEventsBySeason(season: string) {
  return db
    .select()
    .from(events)
    .where(eq(events.season, season))
    .orderBy(desc(events.date));
}

export async function getAllSeasons() {
  const result = await db
    .select({ season: events.season })
    .from(events)
    .groupBy(events.season)
    .orderBy(desc(events.season));
  
  return result.map(r => r.season);
}

export async function getCurrentSeason() {
  const seasons = await getAllSeasons();
  return seasons[0] || "2024-2025";
}

export async function getRankingsBySeason(season: string) {
  return db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      totalPoints: sql<number>`sum(${stats.points})`.as("totalPoints"),
      totalWins: sql<number>`sum(${stats.wins})`.as("totalWins"),
      totalLosses: sql<number>`sum(${stats.losses})`.as("totalLosses"),
      totalBullseyes: sql<number>`sum(${stats.bullseyes})`.as("totalBullseyes"),
      totalTriples: sql<number>`sum(${stats.triples})`.as("totalTriples"),
    })
    .from(players)
    .leftJoin(stats, eq(players.id, stats.playerId))
    .leftJoin(events, eq(stats.eventId, events.id))
    .where(eq(events.season, season))
    .groupBy(players.id, players.name, players.photoUrl)
    .orderBy(desc(sql`totalPoints`));
}
