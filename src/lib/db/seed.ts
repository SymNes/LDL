import 'dotenv/config'
import { db } from './index';
import { players, events, stats } from './schema';

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

// Event 1: January 16, 2025 - All 20 players participated
const event1Stats: Record<string, { v: number; d: number; b: number; t: number }> = {
  'Albatros': { v: 8, d: 2, b: 25, t: 25 },
  'Bagheera': { v: 3, d: 0, b: 0, t: 0 },  // Not clear in photo, assuming 3 pts for attendance
  'Bogey': { v: 4, d: 6, b: 16, t: 18 },
  'Captain': { v: 9, d: 1, b: 40, t: 29 },
  'Cobra Kai': { v: 8, d: 2, b: 26, t: 22 },
  'Dart Gangster': { v: 1, d: 9, b: 14, t: 4 },
  'Grizzly': { v: 1, d: 9, b: 6, t: 14 },
  'Hitman': { v: 3, d: 7, b: 24, t: 10 },
  'Joker': { v: 4, d: 6, b: 14, t: 20 },
  'Maverick': { v: 3, d: 0, b: 0, t: 0 },  // Partial data in photo
  'Maxson Dart': { v: 0, d: 0, b: 10, t: 13 },  // From photo: 0 victories visible
  'Moneymaker': { v: 6, d: 4, b: 23, t: 18 },
  'Phoenix': { v: 5, d: 5, b: 18, t: 19 },
  'Rook': { v: 7, d: 3, b: 29, t: 24 },
  'Russe': { v: 4, d: 6, b: 12, t: 8 },
  'Sniper': { v: 3, d: 7, b: 12, t: 20 },
  'Steelman': { v: 6, d: 4, b: 24, t: 21 },
  'Tank': { v: 9, d: 1, b: 30, t: 22 },
  'Thunder': { v: 7, d: 3, b: 38, t: 17 },
  'Venom': { v: 3, d: 0, b: 0, t: 0 }  // Partial data
};

// Event 2: February 6, 2025 - 16 players participated
const event2Stats: Record<string, { v: number; d: number; b: number; t: number } | null> = {
  'Albatros': { v: 10, d: 0, b: 33, t: 28 },
  'Bagheera': null,  // Absent - 3 points
  'Bogey': { v: 2, d: 8, b: 8, t: 12 },
  'Captain': { v: 8, d: 2, b: 31, t: 24 },
  'Cobra Kai': { v: 9, d: 1, b: 31, t: 24 },
  'Dart Gangster': { v: 1, d: 9, b: 20, t: 19 },
  'Grizzly': null,  // Absent - 3 points
  'Hitman': null,  // Absent - 3 points
  'Joker': { v: 5, d: 5, b: 16, t: 12 },
  'Maverick': { v: 6, d: 4, b: 24, t: 15 },
  'Maxson Dart': { v: 1, d: 9, b: 12, t: 14 },
  'Moneymaker': { v: 8, d: 2, b: 29, t: 26 },
  'Phoenix': { v: 6, d: 4, b: 25, t: 17 },
  'Rook': { v: 7, d: 3, b: 29, t: 18 },
  'Russe': { v: 4, d: 6, b: 20, t: 17 },
  'Sniper': { v: 2, d: 8, b: 14, t: 11 },
  'Steelman': null,  // Did not participate
  'Tank': { v: 8, d: 2, b: 27, t: 20 },
  'Thunder': { v: 8, d: 2, b: 33, t: 28 },
  'Venom': null  // Absent - 3 points
};

export async function seed() {
  console.log('Seeding database...');

  // Create players
  console.log('Creating players...');
  const createdPlayers: Record<string, number> = {};

  for (const name of playerNames) {
    const [player] = await db.insert(players).values({ name }).returning();
    createdPlayers[name] = player.id;
    console.log(`Created player: ${name} (ID: ${player.id})`);
  }

  // Create all events for the season
  console.log('Creating events...');

  const allEvents = [
    { type: 'saison-solo', date: '2026-01-16', description: 'Soirée Saison Solo #1' },
    { type: 'saison-solo', date: '2026-02-06', description: 'Soirée Saison Solo #2' },
    { type: 'saison-equipe', date: '2026-02-27', description: 'Soirée Saison Équipe #1' },
    { type: 'saison-equipe', date: '2026-03-20', description: 'Soirée Saison Équipe #2' },
    { type: 'tournois-equipe', date: '2026-04-10', description: 'Tournoi Équipe #1' },
    { type: 'saison-equipe', date: '2026-05-01', description: 'Soirée Saison Équipe #3' },
    { type: 'saison-equipe', date: '2026-05-22', description: 'Soirée Saison Équipe #4' },
    { type: 'saison-solo', date: '2026-06-12', description: 'Soirée Saison Solo #3' },
    { type: 'saison-equipe', date: '2026-07-10', description: 'Soirée Saison Équipe #5' },
    { type: 'tournois-equipe', date: '2026-08-07', description: 'Tournoi Équipe #2' },
    { type: 'saison-solo', date: '2026-08-28', description: 'Soirée Saison Solo #4' },
    { type: 'saison-solo', date: '2026-09-18', description: 'Soirée Saison Solo #5' },
    { type: 'saison-equipe', date: '2026-10-09', description: 'Soirée Saison Équipe #6' },
    { type: 'saison-solo', date: '2026-10-23', description: 'Soirée Saison Solo #6' },
    { type: 'tournois-solo', date: '2026-11-06', description: 'Tournoi Solo' },
    { type: 'celebration', date: '2026-12-04', description: 'Célébration de fin de saison' },
  ];

  const createdEvents = [];
  for (const eventData of allEvents) {
    const [event] = await db.insert(events).values({
      type: eventData.type as any,
      date: new Date(eventData.date),
      season: '2024-2025',
      description: eventData.description,
    }).returning();
    createdEvents.push(event);
    console.log(`Created event: ${event.description}`);
  }

  const event1 = createdEvents[0];
  const event2 = createdEvents[1];

  // Create stats for Event 1
  console.log('Creating stats for Event 1...');
  for (const [playerName, statData] of Object.entries(event1Stats)) {
    const playerId = createdPlayers[playerName];
    if (!playerId) continue;

    await db.insert(stats).values({
      playerId,
      eventId: event1.id,
      points: statData.v, // Each victory = 1 point
      wins: statData.v,
      losses: statData.d,
      bullseyes: statData.b,
      triples: statData.t,
    });
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

  console.log('Seeding completed!');
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch(console.error);
}
