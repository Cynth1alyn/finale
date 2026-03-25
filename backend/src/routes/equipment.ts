import { Router } from 'express';
import { equipment, equipmentHistory } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: equipment });
});

router.get('/:id', (req, res) => {
  const item = equipment.find(e => e.equip_id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Equipment not found' });
  res.json({ success: true, data: item });
});

router.get('/:id/history', (req, res) => {
  const history = equipmentHistory.filter(h => h.equip_id === req.params.id);
  res.json({ success: true, data: history });
});

export default router;
