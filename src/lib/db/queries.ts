import { db } from "./index";
import { players, events, stats } from "./schema";
import { eq, desc, sql } from "drizzle-orm";

// Single query to get all top players at once (more efficient)
export async function getAllTopPlayers() {
  const result = await db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      totalPoints: sql<number>`sum(${stats.points})`.as("totalPoints"),
      totalBullseyes: sql<number>`sum(${stats.bullseyes})`.as("totalBullseyes"),
      totalTriples: sql<number>`sum(${stats.triples})`.as("totalTriples"),
    })
    .from(players)
    .leftJoin(stats, eq(players.id, stats.playerId))
    .groupBy(players.id, players.name, players.photoUrl);

  // Sort and get top 3 for each category
  const sortedByPoints = [...result].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  const sortedByBullseyes = [...result].sort((a, b) => (b.totalBullseyes || 0) - (a.totalBullseyes || 0));
  const sortedByTriples = [...result].sort((a, b) => (b.totalTriples || 0) - (a.totalTriples || 0));

  return {
    topPoints: sortedByPoints.slice(0, 3),
    topBullseyes: sortedByBullseyes.slice(0, 3),
    topTriples: sortedByTriples.slice(0, 3),
  };
}

// Keep individual functions for specific needs
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
    .orderBy(events.date);
}

// Get events that have stats (completed events)
export async function getCompletedEventIds() {
  const result = await db
    .select({ eventId: stats.eventId })
    .from(stats)
    .groupBy(stats.eventId);
  return result.map(r => r.eventId);
}

export async function getEventsBySeason(season: string) {
  return db
    .select()
    .from(events)
    .where(eq(events.season, season))
    .orderBy(events.date);
}

export async function getAllSeasons() {
  const result = await db
    .select({ season: events.season })
    .from(events)
    .groupBy(events.season)
    .orderBy(desc(events.season));
  
  return result.map(r => r.season);
}

// Returns both current season and all seasons in one query
export async function getSeasonsInfo() {
  const seasons = await getAllSeasons();
  return {
    currentSeason: seasons[0] || "2024-2025",
    seasons,
  };
}

export async function getCurrentSeason() {
  const seasons = await getAllSeasons();
  return seasons[0] || "2024-2025";
}

export async function getNextEvent() {
  const now = new Date();
  const [event] = await db
    .select()
    .from(events)
    .where(sql`${events.date} > ${now}`)
    .orderBy(events.date)
    .limit(1);
  return event;
}

export async function getLastEvent() {
  const now = new Date();
  const [event] = await db
    .select()
    .from(events)
    .where(sql`${events.date} <= ${now}`)
    .orderBy(desc(events.date))
    .limit(1);
  return event;
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
    .orderBy(
      desc(sql`totalPoints`),
      desc(sql`totalBullseyes`),
      desc(sql`totalTriples`)
    );
}

export async function getEventById(id: number) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return event;
}

export async function getEventStats(eventId: number) {
  return db
    .select({
      playerId: players.id,
      playerName: players.name,
      photoUrl: players.photoUrl,
      points: stats.points,
      wins: stats.wins,
      losses: stats.losses,
      bullseyes: stats.bullseyes,
      triples: stats.triples,
    })
    .from(stats)
    .innerJoin(players, eq(stats.playerId, players.id))
    .where(eq(stats.eventId, eventId))
    .orderBy(
      desc(stats.points),
      desc(stats.bullseyes),
      desc(stats.triples)
    );
}
