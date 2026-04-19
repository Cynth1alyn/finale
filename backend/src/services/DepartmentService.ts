import { DepartmentRepository } from '../repositories/DepartmentRepository';
import { Department } from '../lib/types';

export class DepartmentService {
  static async getAllDepartments() {
    return await DepartmentRepository.findAll();
  }

  static async getDepartmentById(id: string) {
    return await DepartmentRepository.findById(id);
  }

  static async createDepartment(data: Partial<Department>) {
    return await DepartmentRepository.create(data);
  }

  static async updateDepartment(id: string, data: Partial<Department>) {
    await DepartmentRepository.update(id, data);
    return await DepartmentRepository.findById(id);
  }

  static async deleteDepartment(id: string) {
    return await DepartmentRepository.delete(id);
  }
}
