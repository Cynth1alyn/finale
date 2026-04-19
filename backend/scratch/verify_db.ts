import mysql from 'mysql2/promise';

async function verify() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'techjob',
    password: 'techjob123',
    database: 'techjob'
  });

  console.log('--- Database Verification ---');
  
  const tables = ['users', 'departments', 'jobs', 'issues', 'equipment', 'units'];
  for (const table of tables) {
    try {
      const [rows]: any = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`Table ${table.padEnd(15)}: ${rows[0].count} rows`);
    } catch (e: any) {
      console.log(`Table ${table.padEnd(15)}: ERROR - ${e.message}`);
    }
  }

  console.log('\n--- Specific Entry Checks ---');
  const [manager]: any = await connection.query("SELECT user_id, firstname, role FROM users WHERE email = 'manager@techjob.th'");
  console.log('Manager Account  :', manager.length > 0 ? `FOUND (${manager[0].firstname}, Role: ${manager[0].role})` : 'NOT FOUND');

  const [technician]: any = await connection.query("SELECT user_id FROM users WHERE role = 'technician'");
  console.log('Technician Count :', technician.length);

  const [userRole]: any = await connection.query("SELECT user_id FROM users WHERE role = 'user'");
  console.log('User Role Count   :', userRole.length);

  const [leadJobs]: any = await connection.query("SELECT COUNT(*) as count FROM jobs WHERE assigned_lead_id IS NOT NULL");
  console.log('Jobs with Lead   :', leadJobs[0].count);

  await connection.end();
}

verify();
