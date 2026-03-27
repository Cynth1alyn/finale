"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.users });
});
router.get('/:id', (req, res) => {
    const user = data_1.users.find(u => u.user_id === req.params.id);
    if (!user)
        return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
});
router.post('/', (req, res) => {
    const newUser = req.body;
    // Provide fallback ID generation if not provided by frontend
    if (!newUser.user_id) {
        newUser.user_id = 'U' + String(Date.now()).slice(-4);
    }
    data_1.users.push(newUser);
    res.status(201).json({ success: true, data: newUser });
});
router.put('/:id', (req, res) => {
    const index = data_1.users.findIndex(u => u.user_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'User not found' });
    data_1.users[index] = { ...data_1.users[index], ...req.body };
    res.json({ success: true, data: data_1.users[index] });
});
router.delete('/:id', (req, res) => {
    const index = data_1.users.findIndex(u => u.user_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'User not found' });
    data_1.users.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
