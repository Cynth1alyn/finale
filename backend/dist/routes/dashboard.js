"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const types_1 = require("../lib/types");
const router = (0, express_1.Router)();
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
        const [totalUsersRows, activeJobsRows, openIssuesRows, totalEquipmentRows, totalDepartmentsRows, pendingRequestsRows] = await Promise.all([
            (0, db_1.query)('SELECT COUNT(*) AS count FROM users'),
            (0, db_1.query)('SELECT COUNT(*) AS count FROM jobs WHERE job_status = ?', [types_1.JobStatus.IN_PROGRESS]),
            (0, db_1.query)('SELECT COUNT(*) AS count FROM issues WHERE status = ? OR status = ?', [types_1.IssueStatus.OPEN, types_1.IssueStatus.IN_PROGRESS]),
            (0, db_1.query)('SELECT COUNT(*) AS count FROM equipment'),
            (0, db_1.query)('SELECT COUNT(*) AS count FROM departments'),
            (0, db_1.query)('SELECT COUNT(*) AS count FROM requests WHERE req_status = ?', [types_1.RequestStatus.PENDING])
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});
exports.default = router;
