import { Router } from 'express';
import { UserService } from '../services/UserService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;
    const users = await UserService.getAllUsers(limit, offset);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: { ...req.body, user_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await UserService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await UserService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;