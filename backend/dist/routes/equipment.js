"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: จัดการอุปกรณ์
 */
router.get('/', async (req, res) => {
    try {
        const equipment = await (0, db_1.query)('SELECT * FROM equipment');
        res.json({ success: true, data: equipment });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id/history', async (req, res) => {
    try {
        const history = await (0, db_1.query)('SELECT * FROM equipment_history WHERE equip_id = ? ORDER BY date DESC', [req.params.id]);
        res.json({ success: true, data: history });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const rows = await (0, db_1.query)('SELECT * FROM equipment WHERE equip_id = ?', [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, error: 'Equipment not found' });
        res.json({ success: true, data: rows[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const newItem = req.body;
        if (!newItem.equip_id) {
            newItem.equip_id = 'E' + Date.now();
        }
        await (0, db_1.query)('INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            newItem.equip_id,
            newItem.name || '',
            newItem.type_category || null,
            newItem.total_qty || 0,
            newItem.remain_qty || 0,
            newItem.unit_id || null,
            newItem.dept_id || null,
            newItem.status || null
        ]);
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const rows = await (0, db_1.query)('SELECT * FROM equipment WHERE equip_id = ?', [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, error: 'Equipment not found' });
        const existing = rows[0];
        const updated = { ...existing, ...req.body };
        await (0, db_1.query)('UPDATE equipment SET name = ?, type_category = ?, total_qty = ?, remain_qty = ?, unit_id = ?, dept_id = ?, status = ? WHERE equip_id = ?', [
            updated.name || '',
            updated.type_category || null,
            updated.total_qty || 0,
            updated.remain_qty || 0,
            updated.unit_id || null,
            updated.dept_id || null,
            updated.status || null,
            req.params.id
        ]);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/:id/checkout', async (req, res) => {
    try {
        const { user_id, qty, notes } = req.body;
        const equip_id = req.params.id;
        if (!user_id || !qty) {
            return res.status(400).json({ success: false, error: 'Missing user_id or qty' });
        }
        const rows = await (0, db_1.query)('SELECT * FROM equipment WHERE equip_id = ?', [equip_id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, error: 'Equipment not found' });
        const equip = rows[0];
        if (equip.remain_qty < qty) {
            return res.status(400).json({ success: false, error: 'จำนวนอุปกรณ์ในสต็อกไม่เพียงพอ' });
        }
        const newRemainQty = equip.remain_qty - qty;
        await (0, db_1.query)('UPDATE equipment SET remain_qty = ? WHERE equip_id = ?', [newRemainQty, equip_id]);
        const historyId = 'H' + Date.now();
        await (0, db_1.query)('INSERT INTO equipment_history (id, equip_id, date, user_id, action, notes) VALUES (?, ?, ?, ?, ?, ?)', [historyId, equip_id, new Date().toISOString().slice(0, 10), user_id, 'check-out', notes || `เบิกออก ${qty} ชิ้น`]);
        res.json({ success: true, message: 'Check-out successful', data: { ...equip, remain_qty: newRemainQty } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const result = await (0, db_1.execute)('DELETE FROM equipment WHERE equip_id = ?', [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: 'Equipment not found' });
        res.json({ success: true, message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
