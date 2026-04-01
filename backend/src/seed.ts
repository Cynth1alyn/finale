import { connectDB, initializeDatabase } from './lib/db';

async function seed() {
  try {
    await connectDB();
    await initializeDatabase();
    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seed();
