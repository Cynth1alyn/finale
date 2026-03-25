"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../lib/data");
const types_1 = require("../lib/types");
const router = (0, express_1.Router)();
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalUsers: data_1.users.length,
            activeJobs: data_1.jobs.filter(j => j.job_status === types_1.JobStatus.IN_PROGRESS).length,
            openIssues: data_1.issues.filter(i => i.status === types_1.IssueStatus.OPEN || i.status === types_1.IssueStatus.IN_PROGRESS).length,
            totalEquipment: data_1.equipment.length,
            totalDepartments: data_1.departments.length,
            pendingRequests: data_1.requests.filter(r => r.req_status === types_1.RequestStatus.PENDING).length,
        }
    });
});
exports.default = router;
