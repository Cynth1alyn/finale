"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DepartmentService_1 = require("../services/DepartmentService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const departments = await DepartmentService_1.DepartmentService.getAllDepartments();
        res.json({ success: true, data: departments });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const dept = await DepartmentService_1.DepartmentService.getDepartmentById(req.params.id);
        if (!dept)
            return res.status(404).json({ success: false, error: 'Department not found' });
        res.json({ success: true, data: dept });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.post('/', async (req, res) => {
    try {
        const id = await DepartmentService_1.DepartmentService.createDepartment(req.body);
        res.status(201).json({ success: true, data: { ...req.body, dept_id: id } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const updated = await DepartmentService_1.DepartmentService.updateDepartment(req.params.id, req.body);
        res.json({ success: true, message: 'Updated successfully', data: updated });
    }
    catch (error) {
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({ success: false, error: String(error) });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await DepartmentService_1.DepartmentService.deleteDepartment(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Department not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
