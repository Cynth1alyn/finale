import { Router } from 'express';
import { users, jobs, issues, equipment, departments, requests } from '../lib/data';
import { JobStatus, IssueStatus, RequestStatus } from '../lib/types';

const router = Router();

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      activeJobs: jobs.filter(j => j.job_status === JobStatus.IN_PROGRESS).length,
      openIssues: issues.filter(i => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS).length,
      totalEquipment: equipment.length,
      totalDepartments: departments.length,
      pendingRequests: requests.filter(r => r.req_status === RequestStatus.PENDING).length,
    }
  });
});

export default router;
