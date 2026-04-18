import { execute } from '../src/lib/db';

async function fixNullPasswords() {
  try {
    const defaultHash = '$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO';
    console.log('Fixing NULL passwords...');
    
    // Update any user with NULL or empty password to use the default hash
    const result = await execute(
      'UPDATE users SET password = ? WHERE password IS NULL OR password = ""',
      [defaultHash]
    );

    console.log(`Updated ${(result as any).affectedRows || 0} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing passwords:', error);
    process.exit(1);
  }
}

fixNullPasswords();
