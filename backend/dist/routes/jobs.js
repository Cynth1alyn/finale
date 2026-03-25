"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.jobs });
});
router.get('/:id', (req, res) => {
    const job = data_1.jobs.find(j => j.job_id === req.params.id);
    if (!job)
        return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
});
router.post('/', (req, res) => {
    const newJob = { ...req.body, job_id: 'J' + Date.now() };
    data_1.jobs.push(newJob);
    res.status(201).json({ success: true, data: newJob });
});
router.put('/:id', (req, res) => {
    const index = data_1.jobs.findIndex(j => j.job_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Job not found' });
    data_1.jobs[index] = { ...data_1.jobs[index], ...req.body };
    res.json({ success: true, data: data_1.jobs[index] });
});
router.delete('/:id', (req, res) => {
    const index = data_1.jobs.findIndex(j => j.job_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Job not found' });
    data_1.jobs.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
