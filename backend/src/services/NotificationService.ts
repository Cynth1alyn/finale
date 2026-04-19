import { NotificationRepository } from '../repositories/NotificationRepository';
import { Notification } from '../lib/types';

export class NotificationService {
  static async getAllNotifications(limit?: number, offset?: number) {
    return await NotificationRepository.findAll(limit, offset);
  }

  static async getUnreadCount() {
    return await NotificationRepository.getUnreadCount();
  }

  static async createNotification(data: Partial<Notification>) {
    return await NotificationRepository.create(data);
  }

  static async markAsRead(id: string) {
    await NotificationRepository.markAsRead(id);
    return await NotificationRepository.findById(id);
  }

  static async markAllAsRead() {
    await NotificationRepository.markAllAsRead();
  }

  static async deleteNotification(id: string) {
    return await NotificationRepository.delete(id);
  }
}
