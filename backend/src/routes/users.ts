import { Router } from 'express';
import { users } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: users });
});

router.get('/:id', (req, res) => {
  const user = users.find(u => u.user_id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

router.post('/', (req, res) => {
  const newUser = req.body;
  
  // Provide fallback ID generation if not provided by frontend
  if (!newUser.user_id) {
    newUser.user_id = 'U' + String(Date.now()).slice(-4);
  }
  
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.user_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });
  
  users[index] = { ...users[index], ...req.body };
  res.json({ success: true, data: users[index] });
});

router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.user_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });
  
  users.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
