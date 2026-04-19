import { query, execute } from '../lib/db';
import { User, Role } from '../lib/types';
import bcrypt from 'bcryptjs';

export class UserRepository {
  static async findAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    return await query<User>('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
  }

  static async findById(id: string): Promise<User | null> {
    const results = await query<User>('SELECT * FROM users WHERE user_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const results = await query<User>('SELECT * FROM users WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(user: Partial<User>): Promise<string> {
    const id = user.user_id || 'U' + Date.now();
    let hashedPassword = user.password || null;
    if (user.password) {
      hashedPassword = await bcrypt.hash(user.password, 10);
    }
    await query(
      `INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color, last_login, password_changed_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user.firstname || '',
        user.lastname || '',
        user.email || '',
        user.tel || '',
        user.role || Role.STAFF,
        hashedPassword,
        user.dept_id || null,
        user.avatar_color || '#3B82F6',
        user.last_login || null,
        user.password_changed_at || null
      ]
    );
    return id;
  }

  static async update(id: string, user: Partial<User>): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('User not found');

    const updated = { ...existing, ...user };
    let hashedPassword = updated.password;
    if (user.password && user.password !== existing.password) {
      hashedPassword = await bcrypt.hash(user.password, 10);
      updated.password_changed_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    await query(
      `UPDATE users SET firstname = ?, lastname = ?, email = ?, tel = ?, role = ?, password = ?, dept_id = ?, avatar_color = ?, last_login = ?, password_changed_at = ?
       WHERE user_id = ?`,
      [
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
      ]
    );
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM users WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
  }
}
