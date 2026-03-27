import { Router } from 'express';
import { requests } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: requests });
});

router.get('/:id', (req, res) => {
  const item = requests.find(r => r.req_id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: item });
});

router.post('/', (req, res) => {
  const newReq = req.body;
  if (!newReq.req_id) {
    newReq.req_id = 'R' + String(Date.now()).slice(-4);
  }
  requests.push(newReq);
  res.status(201).json({ success: true, data: newReq });
});

router.put('/:id', (req, res) => {
  const index = requests.findIndex(r => r.req_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Request not found' });
  requests[index] = { ...requests[index], ...req.body };
  res.json({ success: true, data: requests[index] });
});

router.delete('/:id', (req, res) => {
  const index = requests.findIndex(r => r.req_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Request not found' });
  requests.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
