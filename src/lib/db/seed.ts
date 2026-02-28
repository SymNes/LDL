import 'dotenv/config'
import { db } from './index';
import { players, events, stats } from './schema';
import { eq } from 'drizzle-orm';

const playerNames = [
  'Albatros',
  'Bagheera',
  'Bogey',
  'Captain',
  'Cobra Kai',
  'Dart Gangster',
  'Grizzly',
  'Hitman',
  'Joker',
  'Maverick',
  'Maxson Dart',
  'Moneymaker',
  'Phoenix',
  'Rook',
  'Russe',
  'Sniper',
  'Steelman',
  'Tank',
  'Thunder',
  'Venom'
];

// Event 1: January 16, 2026 - All 20 players participated
// UPDATED with corrected stats
const event1Stats: Record<string, { v: number; d: number; b: number; t: number } | null> = {
  'Albatros': { v: 8, d: 2, b: 25, t: 25 },
  'Bagheera': null,
  'Bogey': { v: 4, d: 6, b: 16, t: 18 },
  'Captain': { v: 9, d: 1, b: 40, t: 29 },
  'Cobra Kai': { v: 8, d: 2, b: 26, t: 22 },
  'Dart Gangster': { v: 1, d: 9, b: 14, t: 9 },  // UPDATED: 9 triples (was 4)
  'Grizzly': { v: 1, d: 9, b: 10, t: 19 },  // UPDATED: 10 bulls, 19 triples
  'Hitman': { v: 3, d: 7, b: 24, t: 10 },
  'Joker': { v: 4, d: 6, b: 18, t: 20 },  // UPDATED: 18 bulls
  'Maverick': null,
  'Maxson Dart': { v: 0, d: 10, b: 13, t: 12 },  // UPDATED: 10 losses, 13 bulls, 12 triples
  'Moneymaker': { v: 6, d: 4, b: 23, t: 18 },
  'Phoenix': { v: 5, d: 5, b: 18, t: 19 },
  'Rook': { v: 7, d: 3, b: 29, t: 24 },
  'Russe': { v: 4, d: 6, b: 12, t: 18 },  // UPDATED: 18 triples
  'Sniper': { v: 3, d: 7, b: 12, t: 20 },
  'Steelman': { v: 6, d: 4, b: 24, t: 21 },
  'Tank': { v: 9, d: 1, b: 30, t: 22 },
  'Thunder': { v: 7, d: 3, b: 38, t: 17 },
  'Venom': null
};

// Event 2: February 6, 2026 - 16 players participated
// UPDATED with corrected stats
const event2Stats: Record<string, { v: number; d: number; b: number; t: number } | null> = {
  'Albatros': { v: 10, d: 0, b: 33, t: 28 },
  'Bagheera': { v: 1, d: 9, b: 8, t: 20 },  // UPDATED: Was absent, now has stats
  'Bogey': { v: 2, d: 8, b: 8, t: 12 },
  'Captain': { v: 8, d: 2, b: 31, t: 24 },
  'Cobra Kai': { v: 9, d: 1, b: 31, t: 24 },
  'Dart Gangster': { v: 1, d: 9, b: 20, t: 19 },
  'Grizzly': { v: 1, d: 9, b: 14, t: 14 },  // UPDATED: Was absent, now has stats
  'Hitman': null,  // Absent - 3 points
  'Joker': { v: 5, d: 5, b: 16, t: 12 },
  'Maverick': { v: 6, d: 4, b: 24, t: 15 },
  'Maxson Dart': { v: 1, d: 9, b: 12, t: 14 },
  'Moneymaker': { v: 6, d: 4, b: 29, t: 26 },
  'Phoenix': { v: 6, d: 4, b: 25, t: 17 },
  'Rook': { v: 7, d: 3, b: 29, t: 18 },
  'Russe': { v: 4, d: 6, b: 20, t: 17 },
  'Sniper': { v: 2, d: 8, b: 14, t: 11 },
  'Steelman': null,  // Did not participate
  'Tank': { v: 8, d: 2, b: 27, t: 20 },
  'Thunder': { v: 8, d: 2, b: 33, t: 28 },
  'Venom': null  // Absent - 3 points
};

// Event 3: February 27, 2025 - Saison Équipe
// Absent: Phoenix, Dart Gangster (3 pts each - 1st absence)
// Second absence: Bagheera, Venom (0 pts)
const event3Stats: Record<string, { points: number; v: number; d: number; b: number; t: number }> = {
  'Albatros': { points: 7, v: 7, d: 3, b: 22, t: 13 },
  'Bagheera': { points: 0, v: 0, d: 0, b: 0, t: 0 },  // 2nd absence - 0 pts
  'Bogey': { points: 6, v: 6, d: 4, b: 7, t: 4 },
  'Captain': { points: 7, v: 7, d: 3, b: 21, t: 14 },
  'Cobra Kai': { points: 6, v: 6, d: 4, b: 15, t: 10 },
  'Dart Gangster': { points: 3, v: 0, d: 0, b: 0, t: 0 },  // 1st absence - 3 pts
  'Grizzly': { points: 2, v: 2, d: 8, b: 2, t: 4 },
  'Hitman': { points: 2, v: 2, d: 8, b: 9, t: 7 },
  'Joker': { points: 4, v: 4, d: 6, b: 5, t: 10 },
  'Maverick': { points: 6, v: 6, d: 4, b: 11, t: 4 },
  'Maxson Dart': { points: 3, v: 3, d: 7, b: 4, t: 4 },
  'Moneymaker': { points: 4, v: 4, d: 6, b: 5, t: 1 },
  'Phoenix': { points: 3, v: 0, d: 0, b: 0, t: 0 },  // 1st absence - 3 pts
  'Rook': { points: 5, v: 5, d: 5, b: 17, t: 8 },
  'Russe': { points: 3, v: 3, d: 7, b: 3, t: 2 },
  'Sniper': { points: 4, v: 4, d: 6, b: 6, t: 6 },
  'Steelman': { points: 5, v: 5, d: 5, b: 9, t: 14 },
  'Tank': { points: 10, v: 10, d: 0, b: 22, t: 15 },
  'Thunder': { points: 7, v: 7, d: 3, b: 16, t: 6 },
  'Venom': { points: 0, v: 0, d: 0, b: 0, t: 0 }  // 2nd absence - 0 pts
};

export async function seed() {
  console.log('Seeding database...');

  // Get or create players
  console.log('Checking/Creating players...');
  const createdPlayers: Record<string, number> = {};

  for (const name of playerNames) {
    // Check if player already exists
    const existing = await db.select().from(players).where(eq(players.name, name)).limit(1);

    if (existing.length > 0) {
      createdPlayers[name] = existing[0].id;
      console.log(`Player already exists: ${name} (ID: ${existing[0].id})`);
    } else {
      const [player] = await db.insert(players).values({ name }).returning();
      createdPlayers[name] = player.id;
      console.log(`Created player: ${name} (ID: ${player.id})`);
    }
  }

  // Create all events for the season
  console.log('Creating events...');

  const allEvents = [
    { type: 'saison-solo', date: '2025-01-16', description: 'Soirée Saison Solo #1' },
    { type: 'saison-solo', date: '2025-02-06', description: 'Soirée Saison Solo #2' },
    { type: 'saison-equipe', date: '2025-02-27', description: 'Soirée Saison Équipe #1' },
    { type: 'saison-equipe', date: '2025-03-20', description: 'Soirée Saison Équipe #2' },
    { type: 'tournois-equipe', date: '2025-04-10', description: 'Tournoi Équipe' },
    { type: 'saison-equipe', date: '2025-05-01', description: 'Soirée Saison Équipe #3' },
    { type: 'saison-equipe', date: '2025-05-22', description: 'Soirée Saison Équipe #4' },
    { type: 'saison-solo', date: '2025-06-12', description: 'Soirée Saison Solo #3' },
    { type: 'saison-equipe', date: '2025-07-10', description: 'Soirée Saison Équipe #5' },
    { type: 'tournois-equipe', date: '2025-08-07', description: 'Tournoi Équipe #2' },
    { type: 'saison-solo', date: '2025-08-28', description: 'Soirée Saison Solo #4' },
    { type: 'saison-solo', date: '2025-09-18', description: 'Soirée Saison Solo #5' },
    { type: 'saison-equipe', date: '2025-10-09', description: 'Soirée Saison Équipe #6' },
    { type: 'saison-solo', date: '2025-10-23', description: 'Soirée Saison Solo #6' },
    { type: 'tournois-solo', date: '2025-11-06', description: 'Tournoi Solo' },
    { type: 'celebration', date: '2025-12-04', description: 'Célébration de fin de saison' },
  ];

  const createdEvents = [];
  for (const eventData of allEvents) {
    // Parse date and store at noon UTC to avoid timezone shifting
    const dateStr = `${eventData.date}T12:00:00.000Z`;
    const eventDate = new Date(dateStr);

    // Check if event already exists (by description)
    const existing = await db.select().from(events).where(eq(events.description, eventData.description)).limit(1);

    if (existing.length > 0) {
      createdEvents.push(existing[0]);
      console.log(`Event already exists: ${eventData.description}`);
    } else {
      const [event] = await db.insert(events).values({
        type: eventData.type as 'saison-solo' | 'saison-equipe' | 'tournois-solo' | 'tournois-equipe' | 'celebration',
        date: eventDate,
        season: '2026',
        description: eventData.description,
      }).returning();
      createdEvents.push(event);
      console.log(`Created event: ${event.description}`);
    }
  }

  const event1 = createdEvents[0];
  const event2 = createdEvents[1];

  // Create stats for Event 1
  console.log('Creating stats for Event 1...');
  for (const [playerName, statData] of Object.entries(event1Stats)) {
    const playerId = createdPlayers[playerName];
    if (!playerId) continue;

    if (statData === null) {
      // Player was absent - 3 points
      await db.insert(stats).values({
        playerId,
        eventId: event1.id,
        points: 3,
        wins: 0,
        losses: 0,
        bullseyes: 0,
        triples: 0,
      });
    } else {
      await db.insert(stats).values({
        playerId,
        eventId: event1.id,
        points: statData.v,
        wins: statData.v,
        losses: statData.d,
        bullseyes: statData.b,
        triples: statData.t,
      });
    }
  }

  // Create stats for Event 2
  console.log('Creating stats for Event 2...');
  for (const [playerName, statData] of Object.entries(event2Stats)) {
    const playerId = createdPlayers[playerName];
    if (!playerId) continue;

    if (statData === null) {
      // Player was absent - 3 points
      await db.insert(stats).values({
        playerId,
        eventId: event2.id,
        points: 3,
        wins: 0,
        losses: 0,
        bullseyes: 0,
        triples: 0,
      });
    } else {
      await db.insert(stats).values({
        playerId,
        eventId: event2.id,
        points: statData.v,
        wins: statData.v,
        losses: statData.d,
        bullseyes: statData.b,
        triples: statData.t,
      });
    }
  }

  // Create stats for Event 3 (February 27, 2025)
  const event3 = createdEvents[2];
  console.log('Creating stats for Event 3 (Feb 27)...');
  for (const [playerName, statData] of Object.entries(event3Stats)) {
    const playerId = createdPlayers[playerName];
    if (!playerId) continue;

    // Use the explicit points value from the data
    await db.insert(stats).values({
      playerId,
      eventId: event3.id,
      points: statData.points,
      wins: statData.v,
      losses: statData.d,
      bullseyes: statData.b,
      triples: statData.t,
    });
  }

  console.log('Seeding completed!');
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch(console.error);
}
