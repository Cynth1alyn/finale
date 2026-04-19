"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_1 = require("../lib/db");
class NotificationRepository {
    static async findAll(limit = 100, offset = 0) {
        return await (0, db_1.query)('SELECT * FROM notifications ORDER BY timestamp DESC LIMIT ? OFFSET ?', [limit, offset]);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM notifications WHERE id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async getUnreadCount() {
        const results = await (0, db_1.query)('SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE');
        return results[0]?.count || 0;
    }
    static async create(notification) {
        const id = notification.id || 'N' + Date.now();
        await (0, db_1.query)(`INSERT INTO notifications (id, title, message, timestamp, is_read, related_link) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
            id,
            notification.title || '',
            notification.message || '',
            notification.timestamp || new Date().toISOString().slice(0, 19).replace('T', ' '),
            notification.is_read || false,
            notification.related_link || null
        ]);
        return id;
    }
    static async markAsRead(id) {
        await (0, db_1.query)('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    }
    static async markAllAsRead() {
        await (0, db_1.query)('UPDATE notifications SET is_read = TRUE');
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM notifications WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.NotificationRepository = NotificationRepository;
