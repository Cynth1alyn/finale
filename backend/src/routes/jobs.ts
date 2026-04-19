import { Router } from 'express';
import { query, execute } from '../lib/db';

import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

function jsonValue(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const role = user.role.toLowerCase();
    let jobs;

    if (role === 'admin' || role === 'manager') {
      // Admin and Manager can see all jobs
      jobs = await query('SELECT * FROM jobs');
    } else {
      // Technicians and others see only assigned jobs
      // 1. Where they are the Lead (assigned_lead_id)
      // 2. Where they are in the assigned_user_ids JSON array
      jobs = await query(
        'SELECT * FROM jobs WHERE assigned_lead_id = ? OR JSON_CONTAINS(assigned_user_ids, CAST(? AS JSON))',
        [user.user_id, JSON.stringify(user.user_id)]
      );
    }
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const jobs = await query('SELECT * FROM jobs WHERE job_id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, error: 'Job not found' });

    const job = jobs[0] as any;
    const role = user.role.toLowerCase();

    // IDOR Protection: Check if user is authorized to see this specific job
    const isAuthorized = 
      role === 'admin' || 
      role === 'manager' || 
      job.assigned_lead_id === user.user_id || 
      (Array.isArray(job.assigned_user_ids) && job.assigned_user_ids.includes(user.user_id));

    if (!isAuthorized) {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have access to this job' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const newJob = { ...req.body };
    if (!newJob.job_id) {
      newJob.job_id = 'J' + Date.now();
    }

    await query(
      'INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newJob.job_id,
        newJob.job_title || '',
        newJob.description || '',
        newJob.start_date || new Date().toISOString().slice(0, 10),
        newJob.due_date || new Date().toISOString().slice(0, 10),
        newJob.job_priority || '',
        newJob.job_status || '',
        jsonValue(newJob.assigned_user_ids),
        newJob.lat ?? null,
        newJob.lng ?? null,
        newJob.customer_name || null,
        newJob.contact_number || null,
        newJob.address || null,
        newJob.landmark || null,
        newJob.assigned_lead_id || null,
        jsonValue(newJob.equipment_requests)
      ]
    );

    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const jobs = await query('SELECT * FROM jobs WHERE job_id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, error: 'Job not found' });

    const existing = jobs[0] as Record<string, unknown>;
    const updated = { ...existing, ...req.body };

    await query(
      'UPDATE jobs SET job_title = ?, description = ?, start_date = ?, due_date = ?, job_priority = ?, job_status = ?, assigned_user_ids = ?, lat = ?, lng = ?, customer_name = ?, contact_number = ?, address = ?, landmark = ?, assigned_lead_id = ?, equipment_requests = ? WHERE job_id = ?',
      [
        updated.job_title || '',
        updated.description || '',
        updated.start_date || new Date().toISOString().slice(0, 10),
        updated.due_date || new Date().toISOString().slice(0, 10),
        updated.job_priority || '',
        updated.job_status || '',
        jsonValue(updated.assigned_user_ids),
        updated.lat ?? null,
        updated.lng ?? null,
        updated.customer_name || null,
        updated.contact_number || null,
        updated.address || null,
        updated.landmark || null,
        updated.assigned_lead_id || null,
        jsonValue(updated.equipment_requests),
        req.params.id
      ]
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await execute('DELETE FROM jobs WHERE job_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;