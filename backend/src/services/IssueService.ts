import { IssueRepository } from '../repositories/IssueRepository';
import { Issue } from '../lib/types';

export class IssueService {
  static async getAllIssues(role: string, userId: string, params: { limit?: number; offset?: number; status?: string; priority?: string } = {}) {
    const r = role.toLowerCase();
    if (r === 'admin' || r === 'manager') {
      return await IssueRepository.findAll(params);
    }
    return await IssueRepository.findByReporterId(userId, params.limit, params.offset);
  }

  static async getIssueById(id: string) {
    return await IssueRepository.findById(id);
  }

  static async createIssue(data: Partial<Issue>) {
    return await IssueRepository.create(data);
  }

  static async updateIssue(id: string, data: Partial<Issue>) {
    await IssueRepository.update(id, data);
    return await IssueRepository.findById(id);
  }

  static async deleteIssue(id: string) {
    return await IssueRepository.delete(id);
  }
}
