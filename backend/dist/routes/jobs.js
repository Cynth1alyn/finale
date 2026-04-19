"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JobService_1 = require("../services/JobService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const { status, priority } = req.query;
        const jobs = await JobService_1.JobService.getAllJobs(user.role, user.user_id, { limit, offset, status, priority });
        res.json({ success: true, data: jobs });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const job = await JobService_1.JobService.getJobById(req.params.id, user.role, user.user_id);
        if (!job)
            return res.status(404).json({ success: false, error: 'Job not found' });
        res.json({ success: true, data: job });
    }
    catch (error) {
        const status = error.message.includes('Forbidden') ? 403 : 500;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const jobId = await JobService_1.JobService.createJob(req.body, user.role);
        res.status(201).json({ success: true, data: { ...req.body, job_id: jobId } });
    }
    catch (error) {
        const status = error.message.includes('Forbidden') ? 403 : 500;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const updated = await JobService_1.JobService.updateJob(req.params.id, req.body, user.role, user.user_id);
        res.json({ success: true, message: 'Updated successfully', data: updated });
    }
    catch (error) {
        let status = 500;
        if (error.message.includes('not found'))
            status = 404;
        else if (error.message.includes('Forbidden'))
            status = 403;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await JobService_1.JobService.deleteJob(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Job not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
