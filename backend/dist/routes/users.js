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
exports.default = router;
