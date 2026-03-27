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

router.post('/', (req, res) => {
  const newItem = req.body;
  if (!newItem.equip_id) {
    newItem.equip_id = 'E' + String(Date.now()).slice(-4);
  }
  equipment.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

router.put('/:id', (req, res) => {
  const index = equipment.findIndex(e => e.equip_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Equipment not found' });
  equipment[index] = { ...equipment[index], ...req.body };
  res.json({ success: true, data: equipment[index] });
});

router.delete('/:id', (req, res) => {
  const index = equipment.findIndex(e => e.equip_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Equipment not found' });
  equipment.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
