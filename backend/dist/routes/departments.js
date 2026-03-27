"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.departments });
});
router.get('/:id', (req, res) => {
    const dept = data_1.departments.find(d => d.dept_id === req.params.id);
    if (!dept)
        return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, data: dept });
});
router.post('/', (req, res) => {
    const newDept = req.body;
    if (!newDept.dept_id) {
        newDept.dept_id = 'D' + String(Date.now()).slice(-4);
    }
    data_1.departments.push(newDept);
    res.status(201).json({ success: true, data: newDept });
});
router.put('/:id', (req, res) => {
    const index = data_1.departments.findIndex(d => d.dept_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Department not found' });
    data_1.departments[index] = { ...data_1.departments[index], ...req.body };
    res.json({ success: true, data: data_1.departments[index] });
});
router.delete('/:id', (req, res) => {
    const index = data_1.departments.findIndex(d => d.dept_id === req.params.id);
    if (index === -1)
        return res.status(404).json({ success: false, error: 'Department not found' });
    data_1.departments.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
