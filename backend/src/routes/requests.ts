import { Router } from 'express';
import { RequestService } from '../services/RequestService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;
    const requests = await RequestService.getAllRequests(limit, offset);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await RequestService.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await RequestService.createRequest(req.body);
    res.status(201).json({ success: true, data: { ...req.body, req_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await RequestService.updateRequest(req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RequestService.deleteRequest(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;