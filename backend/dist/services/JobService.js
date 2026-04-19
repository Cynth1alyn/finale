"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const JobRepository_1 = require("../repositories/JobRepository");
class JobService {
    static async getAllJobs(role, userId, params = {}) {
        const r = role.toLowerCase();
        if (r === 'admin') {
            return await JobRepository_1.JobRepository.findAll(params);
        }
        // Managers and others will now only see jobs they are involved in
        return await JobRepository_1.JobRepository.findByUserId(userId, params.limit, params.offset);
    }
    static async getJobById(id, role, userId) {
        const job = await JobRepository_1.JobRepository.findById(id);
        if (!job)
            return null;
        const r = role.toLowerCase();
        const isAuthorized = r === 'admin' ||
            r === 'manager' ||
            job.assigned_lead_id === userId ||
            (Array.isArray(job.assigned_user_ids) && job.assigned_user_ids.includes(userId));
        if (!isAuthorized) {
            throw new Error('Forbidden: You do not have access to this job');
        }
        return job;
    }
    static async createJob(data, role) {
        if (role.toLowerCase() !== 'admin') {
            throw new Error('Forbidden: Only administrators can create new jobs');
        }
        return await JobRepository_1.JobRepository.create(data);
    }
    static async updateJob(id, data, role, userId) {
        const job = await JobRepository_1.JobRepository.findById(id);
        if (!job)
            throw new Error('Job not found');
        const r = role.toLowerCase();
        const isAuthorized = r === 'admin' || job.assigned_lead_id === userId;
        if (!isAuthorized) {
            throw new Error('Forbidden: You are not authorized to update this job');
        }
        await JobRepository_1.JobRepository.update(id, data);
        return await JobRepository_1.JobRepository.findById(id);
    }
    static async deleteJob(id) {
        return await JobRepository_1.JobRepository.delete(id);
    }
}
exports.JobService = JobService;
