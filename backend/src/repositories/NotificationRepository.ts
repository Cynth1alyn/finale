import { query, execute } from '../lib/db';
import { Notification } from '../lib/types';

export class NotificationRepository {
  static async findAll(limit: number = 100, offset: number = 0): Promise<Notification[]> {
    return await query<Notification>('SELECT * FROM notifications ORDER BY timestamp DESC LIMIT ? OFFSET ?', [limit, offset]);
  }

  static async findById(id: string): Promise<Notification | null> {
    const results = await query<Notification>('SELECT * FROM notifications WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async getUnreadCount(): Promise<number> {
    const results = await query<{ count: number }>('SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE');
    return results[0]?.count || 0;
  }

  static async create(notification: Partial<Notification>): Promise<string> {
    const id = notification.id || 'N' + Date.now();
    await query(
      `INSERT INTO notifications (id, title, message, timestamp, is_read, related_link) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        notification.title || '',
        notification.message || '',
        notification.timestamp || new Date().toISOString().slice(0, 19).replace('T', ' '),
        notification.is_read || false,
        notification.related_link || null
      ]
    );
    return id;
  }

  static async markAsRead(id: string): Promise<void> {
    await query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
  }

  static async markAllAsRead(): Promise<void> {
    await query('UPDATE notifications SET is_read = TRUE');
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM notifications WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
