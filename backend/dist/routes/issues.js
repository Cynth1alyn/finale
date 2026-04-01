"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: จัดการปัญหา (Issues)
 */
router.get('/', async (req, res) => {
    try {
        const issues = await (0, db_1.query)('SELECT * FROM issues');
        res.json({ success: true, data: issues });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const issues = await (0, db_1.query)('SELECT * FROM issues WHERE issue_id = ?', [req.params.id]);
        if (issues.length === 0)
            return res.status(404).json({ success: false, error: 'Issue not found' });
        res.json({ success: true, data: issues[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const newIssue = { ...req.body };
        if (!newIssue.issue_id) {
            newIssue.issue_id = 'I' + Date.now();
        }
        await (0, db_1.query)('INSERT INTO issues (issue_id, topic, detail, solution, status, report_date, reporter_id, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            newIssue.issue_id,
            newIssue.topic || '',
            newIssue.detail || '',
            newIssue.solution || '',
            newIssue.status || '',
            newIssue.report_date || new Date().toISOString().slice(0, 10),
            newIssue.reporter_id || '',
            newIssue.lat ?? null,
            newIssue.lng ?? null
        ]);
        res.status(201).json({ success: true, data: newIssue });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const issues = await (0, db_1.query)('SELECT * FROM issues WHERE issue_id = ?', [req.params.id]);
        if (issues.length === 0)
            return res.status(404).json({ success: false, error: 'Issue not found' });
        const existing = issues[0];
        const updated = { ...existing, ...req.body };
        await (0, db_1.query)('UPDATE issues SET topic = ?, detail = ?, solution = ?, status = ?, report_date = ?, reporter_id = ?, lat = ?, lng = ? WHERE issue_id = ?', [
            updated.topic || '',
            updated.detail || '',
            updated.solution || '',
            updated.status || '',
            updated.report_date || new Date().toISOString().slice(0, 10),
            updated.reporter_id || '',
            updated.lat ?? null,
            updated.lng ?? null,
            req.params.id
        ]);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const result = await (0, db_1.execute)('DELETE FROM issues WHERE issue_id = ?', [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: 'Issue not found' });
        res.json({ success: true, message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
