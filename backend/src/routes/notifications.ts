import { Router } from 'express';
import { NotificationService } from '../services/NotificationService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const notifications = await NotificationService.getAllNotifications(limit, offset);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount();
    res.json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await NotificationService.createNotification(req.body);
    res.status(201).json({ success: true, data: { ...req.body, id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await NotificationService.markAsRead(req.params.id);
    res.json({ success: true, message: 'Marked as read', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    await NotificationService.markAllAsRead();
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await NotificationService.deleteNotification(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Notification not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
