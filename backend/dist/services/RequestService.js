"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const RequestRepository_1 = require("../repositories/RequestRepository");
class RequestService {
    static async getAllRequests(limit, offset) {
        return await RequestRepository_1.RequestRepository.findAll(limit, offset);
    }
    static async getRequestById(id) {
        return await RequestRepository_1.RequestRepository.findById(id);
    }
    static async createRequest(data) {
        return await RequestRepository_1.RequestRepository.create(data);
    }
    static async updateRequest(id, data) {
        await RequestRepository_1.RequestRepository.update(id, data);
        return await RequestRepository_1.RequestRepository.findById(id);
    }
    static async deleteRequest(id) {
        return await RequestRepository_1.RequestRepository.delete(id);
    }
}
exports.RequestService = RequestService;
