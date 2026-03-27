import { Router } from 'express';
import { departments } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: departments });
});

router.get('/:id', (req, res) => {
  const dept = departments.find(d => d.dept_id === req.params.id);
  if (!dept) return res.status(404).json({ success: false, error: 'Department not found' });
  res.json({ success: true, data: dept });
});

router.post('/', (req, res) => {
  const newDept = req.body;
  if (!newDept.dept_id) {
    newDept.dept_id = 'D' + String(Date.now()).slice(-4);
  }
  departments.push(newDept);
  res.status(201).json({ success: true, data: newDept });
});

router.put('/:id', (req, res) => {
  const index = departments.findIndex(d => d.dept_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Department not found' });
  departments[index] = { ...departments[index], ...req.body };
  res.json({ success: true, data: departments[index] });
});

router.delete('/:id', (req, res) => {
  const index = departments.findIndex(d => d.dept_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Department not found' });
  departments.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
