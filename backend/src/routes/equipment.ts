import { Router } from 'express';
import { EquipmentService } from '../services/EquipmentService';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;
    const { status, dept_id } = req.query as { status?: string; dept_id?: string };

    const equipment = await EquipmentService.getAllEquipment({ limit, offset, status, dept_id });
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const history = await EquipmentService.getEquipmentHistory(req.params.id, limit, offset);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await EquipmentService.getEquipmentById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await EquipmentService.createEquipment(req.body);
    res.status(201).json({ success: true, data: { ...req.body, equip_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await EquipmentService.updateEquipment(req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.post('/:id/checkout', async (req: AuthenticatedRequest, res) => {
  try {
    const { qty, notes } = req.body;
    const user_id = req.user?.user_id;
    
    if (!user_id || !qty) {
      return res.status(400).json({ success: false, error: 'Missing user context or qty' });
    }

    const updated = await EquipmentService.checkoutEquipment(req.params.id, user_id, qty, notes);
    res.json({ success: true, message: 'Check-out successful', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 400;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await EquipmentService.deleteEquipment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;