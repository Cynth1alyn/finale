"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: การยืนยันตัวตน
 */
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Login attempt for: ${email}`);
        const users = await (0, db_1.query)('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0)
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        res.json({
            success: true,
            data: {
                user: users[0],
                token: 'real-token-from-backend-' + Date.now()
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
