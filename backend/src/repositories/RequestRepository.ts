import { query, execute } from '../lib/db';
import { Request } from '../lib/types';

export class RequestRepository {
  static async findAll(limit: number = 100, offset: number = 0): Promise<Request[]> {
    return await query<Request>('SELECT * FROM requests LIMIT ? OFFSET ?', [limit, offset]);
  }

  static async findById(id: string): Promise<Request | null> {
    const results = await query<Request>('SELECT * FROM requests WHERE req_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(req: Partial<Request>): Promise<string> {
    const id = req.req_id || 'R' + Date.now();
    await query(
      'INSERT INTO requests (req_id, req_date, req_status, user_id, items) VALUES (?, ?, ?, ?, ?)',
      [
        id,
        req.req_date || new Date().toISOString().slice(0, 10),
        req.req_status || 'pending',
        req.user_id || '',
        JSON.stringify(req.items || [])
      ]
    );
    return id;
  }

  static async update(id: string, req: Partial<Request>): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Request not found');
    const updated = { ...existing, ...req };
    await query(
      'UPDATE requests SET req_status = ?, items = ? WHERE req_id = ?',
      [updated.req_status, JSON.stringify(updated.items), id]
    );
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM requests WHERE req_id = ?', [id]);
    return result.affectedRows > 0;
  }
}
