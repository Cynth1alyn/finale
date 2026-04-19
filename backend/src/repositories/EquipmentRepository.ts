import { query, execute } from '../lib/db';
import { Equipment, EquipmentHistory } from '../lib/types';
import mysql from 'mysql2/promise';

export class EquipmentRepository {
  static async findAll(params: { limit?: number; offset?: number; status?: string; dept_id?: string } = {}): Promise<Equipment[]> {
    const { limit = 100, offset = 0, status, dept_id } = params;
    let sql = 'SELECT * FROM equipment WHERE 1=1';
    const values: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      values.push(status);
    }
    if (dept_id) {
      sql += ' AND dept_id = ?';
      values.push(dept_id);
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    return await query<Equipment>(sql, values);
  }

  static async findById(id: string): Promise<Equipment | null> {
    const results = await query<Equipment>('SELECT * FROM equipment WHERE equip_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async findHistoryByEquipId(equipId: string, limit: number = 100, offset: number = 0): Promise<EquipmentHistory[]> {
    return await query<EquipmentHistory>('SELECT * FROM equipment_history WHERE equip_id = ? ORDER BY date DESC LIMIT ? OFFSET ?', [equipId, limit, offset]);
  }

  static async create(item: Partial<Equipment>): Promise<string> {
    const id = item.equip_id || 'E' + Date.now();
    await query(
      `INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        item.name || '',
        item.type_category || null,
        item.total_qty || 0,
        item.remain_qty || 0,
        item.unit_id || null,
        item.dept_id || null,
        item.status || 'operational'
      ]
    );
    return id;
  }

  static async update(id: string, item: Partial<Equipment>, connection?: mysql.PoolConnection): Promise<void> {
    // If connection is provided, use it for transaction
    const q = connection ? (sql: string, params: any[]) => connection.execute(sql, params) : query;
    
    const existing = await this.findById(id);
    if (!existing) throw new Error('Equipment not found');

    const updated = { ...existing, ...item };
    
    const sql = `UPDATE equipment SET name = ?, type_category = ?, total_qty = ?, remain_qty = ?, unit_id = ?, dept_id = ?, status = ? WHERE equip_id = ?`;
    const params = [
      updated.name || '',
      updated.type_category || null,
      updated.total_qty || 0,
      updated.remain_qty || 0,
      updated.unit_id || '',
      updated.dept_id || null,
      updated.status || null,
      id
    ];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await query(sql, params);
    }
  }

  static async addHistory(history: Partial<EquipmentHistory>, connection?: mysql.PoolConnection): Promise<string> {
    const id = history.id || 'H' + Date.now();
    const sql = `INSERT INTO equipment_history (id, equip_id, date, user_id, action, notes) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      history.equip_id ?? '',
      history.date || new Date().toISOString().slice(0, 10),
      history.user_id ?? '',
      history.action ?? 'unknown',
      history.notes || ''
    ];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await query(sql, params);
    }
    return id;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM equipment WHERE equip_id = ?', [id]);
    return result.affectedRows > 0;
  }
}
