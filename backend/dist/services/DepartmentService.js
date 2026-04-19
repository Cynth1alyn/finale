"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const DepartmentRepository_1 = require("../repositories/DepartmentRepository");
class DepartmentService {
    static async getAllDepartments() {
        return await DepartmentRepository_1.DepartmentRepository.findAll();
    }
    static async getDepartmentById(id) {
        return await DepartmentRepository_1.DepartmentRepository.findById(id);
    }
    static async createDepartment(data) {
        return await DepartmentRepository_1.DepartmentRepository.create(data);
    }
    static async updateDepartment(id, data) {
        await DepartmentRepository_1.DepartmentRepository.update(id, data);
        return await DepartmentRepository_1.DepartmentRepository.findById(id);
    }
    static async deleteDepartment(id) {
        return await DepartmentRepository_1.DepartmentRepository.delete(id);
    }
}
exports.DepartmentService = DepartmentService;
