import { Router } from 'express';
import { departments } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: departments });
});

export default router;
