import { execute } from '../src/lib/db';

async function fixRoles() {
  try {
    console.log('Updating role "staff" → "user" in database...');
    const result = await execute(
      'UPDATE users SET role = ? WHERE role = ?',
      ['user', 'staff']
    );
    console.log(`Updated ${(result as any).affectedRows || 0} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixRoles();
