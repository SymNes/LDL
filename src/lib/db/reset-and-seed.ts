import 'dotenv/config'
import { db } from './index';
import { players, events, stats } from './schema';
import { seed } from './seed';

async function resetAndSeed() {
  console.log('Resetting database...');
  
  // Delete all data in reverse order of dependencies
  console.log('Deleting stats...');
  await db.delete(stats);
  
  console.log('Deleting events...');
  await db.delete(events);
  
  console.log('Deleting players...');
  await db.delete(players);
  
  console.log('Database reset complete!\n');
  
  // Now seed with new data
  await seed();
}

resetAndSeed().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
