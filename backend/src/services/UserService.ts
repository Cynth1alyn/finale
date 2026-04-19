import { UserRepository } from '../repositories/UserRepository';
import { User } from '../lib/types';
import bcrypt from 'bcryptjs';

export class UserService {
  static async getAllUsers(limit?: number, offset?: number) {
    return await UserRepository.findAll(limit, offset);
  }

  static async getUserById(id: string) {
    return await UserRepository.findById(id);
  }

  static async getUserByEmail(email: string) {
    return await UserRepository.findByEmail(email);
  }

  static async createUser(data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await UserRepository.create(data);
  }

  static async updateUser(id: string, data: Partial<User>) {
    if (data.password && data.password.trim() !== '') {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }
    await UserRepository.update(id, data);
    return await UserRepository.findById(id);
  }

  static async deleteUser(id: string) {
    return await UserRepository.delete(id);
  }
}
