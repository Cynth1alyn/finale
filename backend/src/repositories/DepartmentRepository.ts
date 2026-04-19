import { query, execute } from '../lib/db';
import { Department } from '../lib/types';

export class DepartmentRepository {
  static async findAll(): Promise<Department[]> {
    return await query<Department>('SELECT * FROM departments');
  }

  static async findById(id: string): Promise<Department | null> {
    const results = await query<Department>('SELECT * FROM departments WHERE dept_id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(dept: Partial<Department>): Promise<string> {
    const id = dept.dept_id || 'D' + Date.now();
    await query(
      'INSERT INTO departments (dept_id, dept_name) VALUES (?, ?)',
      [id, dept.dept_name || '']
    );
    return id;
  }

  static async update(id: string, dept: Partial<Department>): Promise<void> {
    await query(
      'UPDATE departments SET dept_name = ? WHERE dept_id = ?',
      [dept.dept_name || '', id]
    );
  }

  static async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM departments WHERE dept_id = ?', [id]);
    return result.affectedRows > 0;
  }
}
