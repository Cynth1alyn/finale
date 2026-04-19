import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { JobService } from '../services/JobService';

const router = Router();

router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;
    const { status, priority } = req.query as { status?: string; priority?: string };

    const jobs = await JobService.getAllJobs(user.role, user.user_id, { limit, offset, status, priority });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const job = await JobService.getJobById(req.params.id, user.role, user.user_id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

    res.json({ success: true, data: job });
  } catch (error) {
    const status = (error as Error).message.includes('Forbidden') ? 403 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const jobId = await JobService.createJob(req.body);
    res.status(201).json({ success: true, data: { ...req.body, job_id: jobId } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await JobService.updateJob(req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await JobService.deleteJob(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;