"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.issues });
});
router.get('/:id', (req, res) => {
    const issue = data_1.issues.find(i => i.issue_id === req.params.id);
    if (!issue)
        return res.status(404).json({ success: false, error: 'Issue not found' });
    res.json({ success: true, data: issue });
});
router.post('/', (req, res) => {
    const newIssue = { ...req.body, issue_id: 'I' + Date.now() };
    data_1.issues.push(newIssue);
    res.status(201).json({ success: true, data: newIssue });
});
router.put('/:id', (req, res) => {
    const index = data_1.issues.findIndex(i => i.issue_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Issue not found' });
    data_1.issues[index] = { ...data_1.issues[index], ...req.body };
    res.json({ success: true, data: data_1.issues[index] });
});
router.delete('/:id', (req, res) => {
    const index = data_1.issues.findIndex(i => i.issue_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Issue not found' });
    data_1.issues.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
