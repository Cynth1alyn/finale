"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
function jsonValue(value) {
    return value == null ? null : JSON.stringify(value);
}
router.get('/', async (req, res) => {
    try {
        const jobs = await (0, db_1.query)('SELECT * FROM jobs');
        res.json({ success: true, data: jobs });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const jobs = await (0, db_1.query)('SELECT * FROM jobs WHERE job_id = ?', [req.params.id]);
        if (jobs.length === 0)
            return res.status(404).json({ success: false, error: 'Job not found' });
        res.json({ success: true, data: jobs[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const newJob = { ...req.body };
        if (!newJob.job_id) {
            newJob.job_id = 'J' + Date.now();
        }
        await (0, db_1.query)('INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            newJob.job_id,
            newJob.job_title || '',
            newJob.description || '',
            newJob.start_date || new Date().toISOString().slice(0, 10),
            newJob.due_date || new Date().toISOString().slice(0, 10),
            newJob.job_priority || '',
            newJob.job_status || '',
            jsonValue(newJob.assigned_user_ids),
            newJob.lat ?? null,
            newJob.lng ?? null,
            newJob.customer_name || null,
            newJob.contact_number || null,
            newJob.address || null,
            newJob.landmark || null,
            newJob.assigned_lead_id || null,
            jsonValue(newJob.equipment_requests)
        ]);
        res.status(201).json({ success: true, data: newJob });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const jobs = await (0, db_1.query)('SELECT * FROM jobs WHERE job_id = ?', [req.params.id]);
        if (jobs.length === 0)
            return res.status(404).json({ success: false, error: 'Job not found' });
        const existing = jobs[0];
        const updated = { ...existing, ...req.body };
        await (0, db_1.query)('UPDATE jobs SET job_title = ?, description = ?, start_date = ?, due_date = ?, job_priority = ?, job_status = ?, assigned_user_ids = ?, lat = ?, lng = ?, customer_name = ?, contact_number = ?, address = ?, landmark = ?, assigned_lead_id = ?, equipment_requests = ? WHERE job_id = ?', [
            updated.job_title || '',
            updated.description || '',
            updated.start_date || new Date().toISOString().slice(0, 10),
            updated.due_date || new Date().toISOString().slice(0, 10),
            updated.job_priority || '',
            updated.job_status || '',
            jsonValue(updated.assigned_user_ids),
            updated.lat ?? null,
            updated.lng ?? null,
            updated.customer_name || null,
            updated.contact_number || null,
            updated.address || null,
            updated.landmark || null,
            updated.assigned_lead_id || null,
            jsonValue(updated.equipment_requests),
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
        const result = await (0, db_1.execute)('DELETE FROM jobs WHERE job_id = ?', [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: 'Job not found' });
        res.json({ success: true, message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
