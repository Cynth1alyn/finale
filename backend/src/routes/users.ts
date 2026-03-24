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

export default router;
