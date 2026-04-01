import { Router } from 'express';
import { query } from '../lib/db';
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
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsersRows,
      activeJobsRows,
      openIssuesRows,
      totalEquipmentRows,
      totalDepartmentsRows,
      pendingRequestsRows
    ] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query('SELECT COUNT(*) AS count FROM jobs WHERE job_status = ?', [JobStatus.IN_PROGRESS]),
      query('SELECT COUNT(*) AS count FROM issues WHERE status = ? OR status = ?', [IssueStatus.OPEN, IssueStatus.IN_PROGRESS]),
      query('SELECT COUNT(*) AS count FROM equipment'),
      query('SELECT COUNT(*) AS count FROM departments'),
      query('SELECT COUNT(*) AS count FROM requests WHERE req_status = ?', [RequestStatus.PENDING])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: totalUsersRows[0]?.count ?? 0,
        activeJobs: activeJobsRows[0]?.count ?? 0,
        openIssues: openIssuesRows[0]?.count ?? 0,
        totalEquipment: totalEquipmentRows[0]?.count ?? 0,
        totalDepartments: totalDepartmentsRows[0]?.count ?? 0,
        pendingRequests: pendingRequestsRows[0]?.count ?? 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;