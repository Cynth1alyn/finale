"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueRepository = void 0;
const db_1 = require("../lib/db");
class IssueRepository {
    static async findAll(params = {}) {
        const { limit = 100, offset = 0, status, priority } = params;
        let sql = 'SELECT * FROM issues WHERE 1=1';
        const values = [];
        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }
        // Note: Issue table might not have priority column yet based on my previous check, 
        // but the frontend sends it. I'll add the filter logic anyway if I find it in the schema.
        // Re-checking db.ts: issues table does NOT have priority.
        sql += ' ORDER BY report_date DESC LIMIT ? OFFSET ?';
        values.push(limit, offset);
        return await (0, db_1.query)(sql, values);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM issues WHERE issue_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async findByReporterId(userId, limit = 100, offset = 0) {
        return await (0, db_1.query)('SELECT * FROM issues WHERE reporter_id = ? ORDER BY report_date DESC LIMIT ? OFFSET ?', [userId, limit, offset]);
    }
    static async create(issue) {
        const id = issue.issue_id || 'I' + Date.now();
        await (0, db_1.query)(`INSERT INTO issues (issue_id, topic, detail, solution, status, report_date, reporter_id, lat, lng) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            issue.topic || '',
            issue.detail || '',
            issue.solution || '',
            issue.status || 'open',
            issue.report_date || new Date().toISOString().slice(0, 10),
            issue.reporter_id || '',
            issue.lat ?? null,
            issue.lng ?? null
        ]);
        return id;
    }
    static async update(id, issue) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error('Issue not found');
        const updated = { ...existing, ...issue };
        await (0, db_1.query)(`UPDATE issues SET topic = ?, detail = ?, solution = ?, status = ?, report_date = ?, reporter_id = ?, lat = ?, lng = ? 
       WHERE issue_id = ?`, [
            updated.topic,
            updated.detail,
            updated.solution,
            updated.status,
            updated.report_date,
            updated.reporter_id,
            updated.lat ?? null,
            updated.lng ?? null,
            id
        ]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM issues WHERE issue_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.IssueRepository = IssueRepository;
