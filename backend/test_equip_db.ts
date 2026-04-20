import { query } from './src/lib/db';

async function test() {
  try {
    const result = await query('SELECT count(*) as cnt FROM equipment');
    console.log('Count:', result);
    
    if ((result as any)[0]?.cnt === 0) {
       console.log('No data in equipment. Trying to run seedTableIfEmpty manually?');
    } else {
       const data = await query('SELECT * FROM equipment LIMIT 5');
       console.log('Sample:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

test();
