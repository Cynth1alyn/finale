import { query } from './src/lib/db';
import { equipment } from './src/lib/data';

async function test() {
  console.log('Starting seed test with total:', equipment.length);
  for (const row of equipment) {
    try {
      await query('INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [row.equip_id, row.name, row.type_category || null, row.total_qty, row.remain_qty, row.unit_id || null, row.dept_id || null, row.status || null]);
      console.log('Inserted', row.equip_id);
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log('Duplicate', row.equip_id);
      } else {
        console.error('Failed on', row.equip_id, e);
        break; // stop on other errors
      }
    }
  }
  process.exit(0);
}
test();
