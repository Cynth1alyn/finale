"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const db_1 = require("../lib/db");
class JobRepository {
    static parseJob(row) {
        if (!row)
            return row;
        const parsed = { ...row };
        if (typeof parsed.assigned_user_ids === 'string') {
            try {
                parsed.assigned_user_ids = JSON.parse(parsed.assigned_user_ids);
            }
            catch (e) {
                parsed.assigned_user_ids = [];
            }
        }
        if (typeof parsed.equipment_requests === 'string') {
            try {
                parsed.equipment_requests = JSON.parse(parsed.equipment_requests);
            }
            catch (e) {
                parsed.equipment_requests = [];
            }
        }
        return parsed;
    }
    static async findAll(params = {}) {
        const { limit = 100, offset = 0, status, priority } = params;
        let sql = 'SELECT * FROM jobs WHERE 1=1';
        const values = [];
        if (status) {
            sql += ' AND job_status = ?';
            values.push(status);
        }
        if (priority) {
            sql += ' AND job_priority = ?';
            values.push(priority);
        }
        sql += ' LIMIT ? OFFSET ?';
        values.push(limit, offset);
        const rows = await (0, db_1.query)(sql, values);
        return rows.map(this.parseJob);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM jobs WHERE job_id = ?', [id]);
        return results.length > 0 ? this.parseJob(results[0]) : null;
    }
    static async findByUserId(userId, limit = 100, offset = 0) {
        const rows = await (0, db_1.query)('SELECT * FROM jobs WHERE assigned_lead_id = ? OR IFNULL(assigned_user_ids, "[]") LIKE CONCAT(\'%\"\', ?, \'\"%\') LIMIT ? OFFSET ?', [userId, userId, limit, offset]);
        return rows.map(this.parseJob);
    }
    static async create(job) {
        const id = job.job_id || 'J' + Date.now();
        await (0, db_1.query)(`INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            job.job_title || '',
            job.description || '',
            job.start_date || new Date().toISOString().slice(0, 10),
            job.due_date || new Date().toISOString().slice(0, 10),
            job.job_priority || 'medium',
            job.job_status || 'pending',
            JSON.stringify(job.assigned_user_ids || []),
            job.lat ?? null,
            job.lng ?? null,
            job.customer_name || null,
            job.contact_number || null,
            job.address || null,
            job.landmark || null,
            job.assigned_lead_id || null,
            JSON.stringify(job.equipment_requests || [])
        ]);
        return id;
    }
    static async update(id, job) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error('Job not found');
        const updated = { ...existing, ...job };
        await (0, db_1.query)(`UPDATE jobs SET job_title = ?, description = ?, start_date = ?, due_date = ?, job_priority = ?, job_status = ?, assigned_user_ids = ?, lat = ?, lng = ?, customer_name = ?, contact_number = ?, address = ?, landmark = ?, assigned_lead_id = ?, equipment_requests = ? 
       WHERE job_id = ?`, [
            updated.job_title,
            updated.description,
            updated.start_date,
            updated.due_date,
            updated.job_priority,
            updated.job_status,
            JSON.stringify(updated.assigned_user_ids),
            updated.lat ?? null,
            updated.lng ?? null,
            updated.customer_name || null,
            updated.contact_number || null,
            updated.address || null,
            updated.landmark || null,
            updated.assigned_lead_id || null,
            JSON.stringify(updated.equipment_requests),
            id
        ]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM jobs WHERE job_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.JobRepository = JobRepository;
