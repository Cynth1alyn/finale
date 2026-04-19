import { RequestRepository } from '../repositories/RequestRepository';
import { Request } from '../lib/types';

export class RequestService {
  static async getAllRequests(limit?: number, offset?: number) {
    return await RequestRepository.findAll(limit, offset);
  }

  static async getRequestById(id: string) {
    return await RequestRepository.findById(id);
  }

  static async createRequest(data: Partial<Request>) {
    return await RequestRepository.create(data);
  }

  static async updateRequest(id: string, data: Partial<Request>) {
    await RequestRepository.update(id, data);
    return await RequestRepository.findById(id);
  }

  static async deleteRequest(id: string) {
    return await RequestRepository.delete(id);
  }
}
