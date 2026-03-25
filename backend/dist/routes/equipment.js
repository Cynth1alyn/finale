"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: true, data: data_1.equipment });
});
router.get('/:id', (req, res) => {
    const item = data_1.equipment.find(e => e.equip_id === req.params.id);
    if (!item)
        return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, data: item });
});
router.get('/:id/history', (req, res) => {
    const history = data_1.equipmentHistory.filter(h => h.equip_id === req.params.id);
    res.json({ success: true, data: history });
});
exports.default = router;
