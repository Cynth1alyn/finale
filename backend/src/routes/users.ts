import { Router } from 'express';
import { query, execute } from '../lib/db';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: จัดการผู้ใช้งาน
 */

router.get('/', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = req.body;
    if (!newUser.user_id) {
      newUser.user_id = 'U' + Date.now();
    }

    await query(
      'INSERT INTO users (user_id, firstname, lastname, email, tel, role, dept_id, avatar_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.user_id,
        newUser.firstname || '',
        newUser.lastname || '',
        newUser.email || '',
        newUser.tel || '',
        newUser.role || '',
        newUser.dept_id || null,
        newUser.avatar_color || null
      ]
    );

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ success: false, error: 'User not found' });

    const existing = users[0] as Record<string, unknown>;
    const updated = { ...existing, ...req.body };

    await query(
      'UPDATE users SET firstname = ?, lastname = ?, email = ?, tel = ?, role = ?, dept_id = ?, avatar_color = ? WHERE user_id = ?',
      [
        updated.firstname || '',
        updated.lastname || '',
        updated.email || '',
        updated.tel || '',
        updated.role || '',
        updated.dept_id || null,
        updated.avatar_color || null,
        req.params.id
      ]
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await execute('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;