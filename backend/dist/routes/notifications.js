"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationService_1 = require("../services/NotificationService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;
        const notifications = await NotificationService_1.NotificationService.getAllNotifications(limit, offset);
        res.json({ success: true, data: notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/unread-count', async (req, res) => {
    try {
        const count = await NotificationService_1.NotificationService.getUnreadCount();
        res.json({ success: true, data: count });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const id = await NotificationService_1.NotificationService.createNotification(req.body);
        res.status(201).json({ success: true, data: { ...req.body, id } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.patch('/:id/read', async (req, res) => {
    try {
        const updated = await NotificationService_1.NotificationService.markAsRead(req.params.id);
        res.json({ success: true, message: 'Marked as read', data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.patch('/read-all', async (req, res) => {
    try {
        await NotificationService_1.NotificationService.markAllAsRead();
        res.json({ success: true, message: 'All marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await NotificationService_1.NotificationService.deleteNotification(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Notification not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
