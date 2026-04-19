"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRepository = void 0;
const db_1 = require("../lib/db");
class DepartmentRepository {
    static async findAll() {
        return await (0, db_1.query)('SELECT * FROM departments');
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM departments WHERE dept_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async create(dept) {
        const id = dept.dept_id || 'D' + Date.now();
        await (0, db_1.query)('INSERT INTO departments (dept_id, dept_name) VALUES (?, ?)', [id, dept.dept_name || '']);
        return id;
    }
    static async update(id, dept) {
        await (0, db_1.query)('UPDATE departments SET dept_name = ? WHERE dept_id = ?', [dept.dept_name || '', id]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM departments WHERE dept_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.DepartmentRepository = DepartmentRepository;
