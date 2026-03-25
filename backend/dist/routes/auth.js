"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
// Mock login logic
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    const user = data_1.users.find(u => u.email === email);
    if (user) {
        res.json({
            success: true,
            data: {
                user,
                token: "real-token-from-backend-" + Date.now()
            }
        });
    }
    else {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
});
exports.default = router;
