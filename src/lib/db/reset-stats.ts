import 'dotenv/config'
import { db } from './index';
import { stats } from './schema';

async function resetStats() {
  console.log('Deleting all stats...');
  await db.delete(stats);
  console.log('All stats deleted!');
}

resetStats().catch(console.error);
