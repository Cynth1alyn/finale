"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: จัดการแผนก
 */
router.get('/', async (req, res) => {
    try {
        const departments = await (0, db_1.query)('SELECT * FROM departments');
        res.json({ success: true, data: departments });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const departments = await (0, db_1.query)('SELECT * FROM departments WHERE dept_id = ?', [req.params.id]);
        if (departments.length === 0)
            return res.status(404).json({ success: false, error: 'Department not found' });
        res.json({ success: true, data: departments[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const newDept = req.body;
        if (!newDept.dept_id) {
            newDept.dept_id = 'D' + Date.now();
        }
        await (0, db_1.query)('INSERT INTO departments (dept_id, dept_name, description) VALUES (?, ?, ?)', [newDept.dept_id, newDept.dept_name || '', newDept.description || null]);
        res.status(201).json({ success: true, data: newDept });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const departments = await (0, db_1.query)('SELECT * FROM departments WHERE dept_id = ?', [req.params.id]);
        if (departments.length === 0)
            return res.status(404).json({ success: false, error: 'Department not found' });
        const existing = departments[0];
        const updated = { ...existing, ...req.body };
        await (0, db_1.query)('UPDATE departments SET dept_name = ?, description = ? WHERE dept_id = ?', [updated.dept_name || '', updated.description || null, req.params.id]);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const result = await (0, db_1.execute)('DELETE FROM departments WHERE dept_id = ?', [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: 'Department not found' });
        res.json({ success: true, message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
