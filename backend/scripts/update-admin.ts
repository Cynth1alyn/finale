import { execute } from '../src/lib/db';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const hash = '$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO';
  await execute('UPDATE users SET password = ?', [hash]);
  console.log('Successfully updated all users to password123');
  process.exit();
}

run().catch(console.error);
