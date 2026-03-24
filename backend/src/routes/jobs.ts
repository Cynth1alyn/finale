import { Router } from 'express';
import { jobs } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: jobs });
});

router.get('/:id', (req, res) => {
  const job = jobs.find(j => j.job_id === req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, data: job });
});

router.post('/', (req, res) => {
  const newJob = { ...req.body, job_id: 'J' + Date.now() };
  jobs.push(newJob);
  res.status(201).json({ success: true, data: newJob });
});

router.put('/:id', (req, res) => {
  const index = jobs.findIndex(j => j.job_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Job not found' });
  jobs[index] = { ...jobs[index], ...req.body };
  res.json({ success: true, data: jobs[index] });
});

router.delete('/:id', (req, res) => {
  const index = jobs.findIndex(j => j.job_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Job not found' });
  jobs.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
