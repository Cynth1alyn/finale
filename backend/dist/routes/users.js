"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserService_1 = require("../services/UserService");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const users = await UserService_1.UserService.getAllUsers(limit, offset);
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await UserService_1.UserService.getUserById(req.params.id);
        if (!user)
            return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', (0, authorize_1.authorizeRoles)('admin'), async (req, res) => {
    try {
        const id = await UserService_1.UserService.createUser(req.body);
        res.status(201).json({ success: true, data: { ...req.body, user_id: id } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', (0, authorize_1.authorizeRoles)('admin'), async (req, res) => {
    try {
        const updated = await UserService_1.UserService.updateUser(req.params.id, req.body);
        res.json({ success: true, message: 'Updated successfully', data: updated });
    }
    catch (error) {
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', (0, authorize_1.authorizeRoles)('admin'), async (req, res) => {
    try {
        const deleted = await UserService_1.UserService.deleteUser(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
