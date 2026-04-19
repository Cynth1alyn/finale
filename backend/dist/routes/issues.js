"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const IssueService_1 = require("../services/IssueService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const { status, priority } = req.query;
        const issues = await IssueService_1.IssueService.getAllIssues(user.role, user.user_id, { limit, offset, status, priority });
        res.json({ success: true, data: issues });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const issue = await IssueService_1.IssueService.getIssueById(req.params.id);
        if (!issue)
            return res.status(404).json({ success: false, error: 'Issue not found' });
        res.json({ success: true, data: issue });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const issueId = await IssueService_1.IssueService.createIssue(req.body);
        res.status(201).json({ success: true, data: { ...req.body, issue_id: issueId } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const updated = await IssueService_1.IssueService.updateIssue(req.params.id, req.body);
        res.json({ success: true, message: 'Updated successfully', data: updated });
    }
    catch (error) {
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await IssueService_1.IssueService.deleteIssue(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Issue not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
