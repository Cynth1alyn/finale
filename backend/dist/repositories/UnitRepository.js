"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRepository = void 0;
const db_1 = require("../lib/db");
class UnitRepository {
    static async findAll() {
        return await (0, db_1.query)('SELECT * FROM units ORDER BY unit_name ASC');
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM units WHERE unit_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async create(item) {
        const id = item.unit_id || 'UN' + Date.now();
        await (0, db_1.query)('INSERT INTO units (unit_id, unit_name, description) VALUES (?, ?, ?)', [id, item.unit_name || '', item.description || null]);
        return id;
    }
    static async update(id, item) {
        await (0, db_1.query)('UPDATE units SET unit_name = ?, description = ? WHERE unit_id = ?', [item.unit_name, item.description, id]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM units WHERE unit_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.UnitRepository = UnitRepository;
