"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./lib/db");
async function seed() {
    try {
        await (0, db_1.connectDB)();
        await (0, db_1.initializeDatabase)();
        console.log('Database seeding completed.');
        process.exit(0);
    }
    catch (error) {
        console.error('Database seeding failed:', error);
        process.exit(1);
    }
}
seed();
