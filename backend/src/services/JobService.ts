import { JobRepository } from '../repositories/JobRepository';
import { Job } from '../lib/types';

export class JobService {
  static async getAllJobs(role: string, userId: string, params: { limit?: number; offset?: number; status?: string; priority?: string } = {}) {
    const r = role.toLowerCase();
    if (r === 'admin') {
      return await JobRepository.findAll(params);
    }
    
    // Managers and others will now only see jobs they are involved in
    return await JobRepository.findByUserId(userId, params.limit, params.offset);
  }

  static async getJobById(id: string, role: string, userId: string) {
    const job = await JobRepository.findById(id);
    if (!job) return null;

    const r = role.toLowerCase();
    const isAuthorized = 
      r === 'admin' || 
      r === 'manager' || 
      job.assigned_lead_id === userId || 
      (Array.isArray(job.assigned_user_ids) && job.assigned_user_ids.includes(userId));

    if (!isAuthorized) {
      throw new Error('Forbidden: You do not have access to this job');
    }

    return job;
  }

  static async createJob(data: Partial<Job>) {
    return await JobRepository.create(data);
  }

  static async updateJob(id: string, data: Partial<Job>) {
    await JobRepository.update(id, data);
    return await JobRepository.findById(id);
  }

  static async deleteJob(id: string) {
    return await JobRepository.delete(id);
  }
}
