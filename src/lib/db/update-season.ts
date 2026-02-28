import 'dotenv/config'
import { db } from './index';
import { events } from './schema';

async function updateSeason() {
  console.log('Updating season to 2026...');

  // Update all events to season 2026
  await db.update(events).set({ season: '2026' });

  console.log('Season updated to 2026!');
}

updateSeason().catch(console.error);
