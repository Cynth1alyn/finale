import { Router } from 'express';
import { users, jobs, issues, equipment, departments, requests } from '../lib/data';
import { JobStatus, IssueStatus, RequestStatus } from '../lib/types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: ข้อมูลภาพรวมระบบ
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: ดึงข้อมูลสถิติของระบบ
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeJobs:
 *                       type: integer
 *                     openIssues:
 *                       type: integer
 *                     totalEquipment:
 *                       type: integer
 *                     totalDepartments:
 *                       type: integer
 *                     pendingRequests:
 *                       type: integer
 */
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