import mysql from 'mysql2/promise';
async function test() {
  const c = await mysql.createConnection({host:'localhost',user:'techjob',password:'techjob123',database:'techjob'});
  try {
    const [res] = await c.query('SELECT * FROM jobs WHERE assigned_lead_id = ? OR JSON_CONTAINS(IFNULL(assigned_user_ids, "[]"), CAST(? AS JSON))', ['U004', '"U004"']);
    console.log('Query success:', res);
  } catch(e) {
    console.error('Query failed:', e);
  }
  await c.end();
}
test();
