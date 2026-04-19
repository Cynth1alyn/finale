"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRepository = void 0;
const db_1 = require("../lib/db");
class RequestRepository {
    static async findAll(limit = 100, offset = 0) {
        return await (0, db_1.query)('SELECT * FROM requests LIMIT ? OFFSET ?', [limit, offset]);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM requests WHERE req_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async create(req) {
        const id = req.req_id || 'R' + Date.now();
        await (0, db_1.query)('INSERT INTO requests (req_id, req_date, req_status, user_id, items) VALUES (?, ?, ?, ?, ?)', [
            id,
            req.req_date || new Date().toISOString().slice(0, 10),
            req.req_status || 'pending',
            req.user_id || '',
            JSON.stringify(req.items || [])
        ]);
        return id;
    }
    static async update(id, req) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error('Request not found');
        const updated = { ...existing, ...req };
        await (0, db_1.query)('UPDATE requests SET req_status = ?, items = ? WHERE req_id = ?', [updated.req_status, JSON.stringify(updated.items), id]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM requests WHERE req_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.RequestRepository = RequestRepository;
