"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueService = void 0;
const IssueRepository_1 = require("../repositories/IssueRepository");
class IssueService {
    static async getAllIssues(role, userId, params = {}) {
        const r = role.toLowerCase();
        if (r === 'admin' || r === 'manager') {
            return await IssueRepository_1.IssueRepository.findAll(params);
        }
        return await IssueRepository_1.IssueRepository.findByReporterId(userId, params.limit, params.offset);
    }
    static async getIssueById(id) {
        return await IssueRepository_1.IssueRepository.findById(id);
    }
    static async createIssue(data) {
        return await IssueRepository_1.IssueRepository.create(data);
    }
    static async updateIssue(id, data) {
        await IssueRepository_1.IssueRepository.update(id, data);
        return await IssueRepository_1.IssueRepository.findById(id);
    }
    static async deleteIssue(id) {
        return await IssueRepository_1.IssueRepository.delete(id);
    }
}
exports.IssueService = IssueService;
