import { query, execute } from '../lib/db';
import { Job } from '../lib/types';
import { ResultSetHeader } from 'mysql2';

export class JobRepository {
  static async findAll(params: { limit?: number; offset?: number; status?: string; priority?: string } = {}): Promise<Job[]> {
    const { limit = 100, offset = 0, status, priority } = params;
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const values: any[] = [];

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

    return await query<Job>(sql, values);
  }

  static async findById(id: string): Promise<Job | null> {
    const results = await query<Job>('SELECT * FROM jobs WHERE job_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async findByUserId(userId: string, limit: number = 100, offset: number = 0): Promise<Job[]> {
    return await query<Job>(
      'SELECT * FROM jobs WHERE assigned_lead_id = ? OR JSON_CONTAINS(IFNULL(assigned_user_ids, "[]"), CAST(? AS JSON)) LIMIT ? OFFSET ?',
      [userId, JSON.stringify(userId), limit, offset]
    );
  }

  static async create(job: Partial<Job>): Promise<string> {
    const id = job.job_id || 'J' + Date.now();
    await query(
      `INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );
    return id;
  }

  static async update(id: string, job: Partial<Job>): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Job not found');

    const updated = { ...existing, ...job };
    await query(
      `UPDATE jobs SET job_title = ?, description = ?, start_date = ?, due_date = ?, job_priority = ?, job_status = ?, assigned_user_ids = ?, lat = ?, lng = ?, customer_name = ?, contact_number = ?, address = ?, landmark = ?, assigned_lead_id = ?, equipment_requests = ? 
       WHERE job_id = ?`,
      [
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
      ]
    );
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM jobs WHERE job_id = ?', [id]);
    return result.affectedRows > 0;
  }
}
