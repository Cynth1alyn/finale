import { Router } from 'express';
import { users, jobs, issues, equipment, departments, requests } from '../lib/data';

const router = Router();

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      activeJobs: jobs.filter(j => j.job_status === 'in-progress').length,
      openIssues: issues.filter(i => i.status === 'open' || i.status === 'in-progress').length,
      totalEquipment: equipment.length,
      totalDepartments: departments.length,
      pendingRequests: requests.filter(r => r.req_status === 'pending').length,
    }
  });
});

export default router;
