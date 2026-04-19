"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    static async getAllUsers(limit, offset) {
        return await UserRepository_1.UserRepository.findAll(limit, offset);
    }
    static async getUserById(id) {
        return await UserRepository_1.UserRepository.findById(id);
    }
    static async getUserByEmail(email) {
        return await UserRepository_1.UserRepository.findByEmail(email);
    }
    static async createUser(data) {
        if (data.password) {
            data.password = await bcryptjs_1.default.hash(data.password, 10);
        }
        return await UserRepository_1.UserRepository.create(data);
    }
    static async updateUser(id, data) {
        if (data.password && data.password.trim() !== '') {
            data.password = await bcryptjs_1.default.hash(data.password, 10);
        }
        else {
            delete data.password;
        }
        await UserRepository_1.UserRepository.update(id, data);
        return await UserRepository_1.UserRepository.findById(id);
    }
    static async deleteUser(id) {
        return await UserRepository_1.UserRepository.delete(id);
    }
}
exports.UserService = UserService;
