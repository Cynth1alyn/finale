"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = require("../lib/db");
const types_1 = require("../lib/types");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRepository {
    static async findAll(limit = 100, offset = 0) {
        return await (0, db_1.query)('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    }
    static async findById(id) {
        const results = await (0, db_1.query)('SELECT * FROM users WHERE user_id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async findByEmail(email) {
        const results = await (0, db_1.query)('SELECT * FROM users WHERE email = ?', [email]);
        return results.length > 0 ? results[0] : null;
    }
    static async create(user) {
        const id = user.user_id || 'U' + Date.now();
        let hashedPassword = user.password || null;
        if (user.password) {
            hashedPassword = await bcryptjs_1.default.hash(user.password, 10);
        }
        await (0, db_1.query)(`INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color, last_login, password_changed_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            user.firstname || '',
            user.lastname || '',
            user.email || '',
            user.tel || '',
            user.role || types_1.Role.TECHNICIAN,
            hashedPassword,
            user.dept_id || null,
            user.avatar_color || '#3B82F6',
            user.last_login || null,
            user.password_changed_at || null
        ]);
        return id;
    }
    static async update(id, user) {
        const existing = await this.findById(id);
        if (!existing)
            throw new Error('User not found');
        const updated = { ...existing, ...user };
        let hashedPassword = updated.password;
        if (user.password && user.password !== existing.password) {
            hashedPassword = await bcryptjs_1.default.hash(user.password, 10);
            updated.password_changed_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
        await (0, db_1.query)(`UPDATE users SET firstname = ?, lastname = ?, email = ?, tel = ?, role = ?, password = ?, dept_id = ?, avatar_color = ?, last_login = ?, password_changed_at = ?
       WHERE user_id = ?`, [
            updated.firstname,
            updated.lastname,
            updated.email,
            updated.tel,
            updated.role,
            hashedPassword,
            updated.dept_id,
            updated.avatar_color,
            updated.last_login || null,
            updated.password_changed_at || null,
            id
        ]);
    }
    static async delete(id) {
        const result = await (0, db_1.execute)('DELETE FROM users WHERE user_id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.UserRepository = UserRepository;
