"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentRepository = void 0;
const db_1 = require("../lib/db");
class EquipmentRepository {
    static async findAll(params = {}) {
        const { limit = 100, offset = 0, status, dept_id } = params;
        let sql = 'SELECT * FROM equipment WHERE 1=1';
        const values = [];
        if (status && status !== 'all') {
            sql += ' AND status = ?';
            values.push(status);
        }
        if (dept_id) {
            sql += ' AND dept_id = ?';
            values.push(dept_id);
        }
        sql += ' LIMIT ? OFFSET ?';
        values.push(limit, offset);
        return await (0, db_1.query)(sql, values);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM equipment WHERE equip_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async findHistoryByEquipId(equipId, limit = 100, offset = 0) {
        return await (0, db_1.query)('SELECT * FROM equipment_history WHERE equip_id = ? ORDER BY date DESC LIMIT ? OFFSET ?', [equipId, limit, offset]);
    }
    static async create(item) {
        const id = item.equip_id || 'E' + Date.now();
        await (0, db_1.query)(`INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            item.name || '',
            item.type_category || null,
            item.total_qty || 0,
            item.remain_qty || 0,
            item.unit_id || null,
            item.dept_id || null,
            item.status || 'operational'
        ]);
        return id;
    }
    static async update(id, item, connection) {
        // If connection is provided, use it for transaction
        const q = connection ? (sql, params) => connection.execute(sql, params) : db_1.query;
        const existing = await this.findById(id);
        if (!existing)
            throw new Error('Equipment not found');
        const updated = { ...existing, ...item };
        const sql = `UPDATE equipment SET name = ?, type_category = ?, total_qty = ?, remain_qty = ?, unit_id = ?, dept_id = ?, status = ? WHERE equip_id = ?`;
        const params = [
            updated.name || '',
            updated.type_category || null,
            updated.total_qty || 0,
            updated.remain_qty || 0,
            updated.unit_id || null,
            updated.dept_id || null,
            updated.status || 'operational',
            id
        ];
        if (connection) {
            await connection.execute(sql, params);
        }
        else {
            await (0, db_1.query)(sql, params);
        }
    }
    static async addHistory(history, connection) {
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
        }
        else {
            await (0, db_1.query)(sql, params);
        }
        return id;
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM equipment WHERE equip_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.EquipmentRepository = EquipmentRepository;
