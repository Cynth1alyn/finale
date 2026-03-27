"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.requests });
});
router.get('/:id', (req, res) => {
    const item = data_1.requests.find(r => r.req_id === req.params.id);
    if (!item)
        return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, data: item });
});
router.post('/', (req, res) => {
    const newReq = req.body;
    if (!newReq.req_id) {
        newReq.req_id = 'R' + String(Date.now()).slice(-4);
    }
    data_1.requests.push(newReq);
    res.status(201).json({ success: true, data: newReq });
});
router.put('/:id', (req, res) => {
    const index = data_1.requests.findIndex(r => r.req_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Request not found' });
    data_1.requests[index] = { ...data_1.requests[index], ...req.body };
    res.json({ success: true, data: data_1.requests[index] });
});
router.delete('/:id', (req, res) => {
    const index = data_1.requests.findIndex(r => r.req_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Request not found' });
    data_1.requests.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
