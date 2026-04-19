"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
class NotificationService {
    static async getAllNotifications(limit, offset) {
        return await NotificationRepository_1.NotificationRepository.findAll(limit, offset);
    }
    static async getUnreadCount() {
        return await NotificationRepository_1.NotificationRepository.getUnreadCount();
    }
    static async createNotification(data) {
        return await NotificationRepository_1.NotificationRepository.create(data);
    }
    static async markAsRead(id) {
        await NotificationRepository_1.NotificationRepository.markAsRead(id);
        return await NotificationRepository_1.NotificationRepository.findById(id);
    }
    static async markAllAsRead() {
        await NotificationRepository_1.NotificationRepository.markAllAsRead();
    }
    static async deleteNotification(id) {
        return await NotificationRepository_1.NotificationRepository.delete(id);
    }
}
exports.NotificationService = NotificationService;
