import { Router } from 'express';
import { users } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: จัดการผู้ใช้งาน
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: ดึงผู้ใช้ทั้งหมด
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: users });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ดึงผู้ใช้ตาม ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: user_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบผู้ใช้
 */
router.get('/:id', (req, res) => {
  const user = users.find(u => u.user_id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: สร้างผู้ใช้ใหม่
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newUser = req.body;

  if (!newUser.user_id) {
    newUser.user_id = 'U' + String(Date.now()).slice(-4);
  }

  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: แก้ไขผู้ใช้
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 *       404:
 *         description: ไม่พบผู้ใช้
 */
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.user_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  res.json({ success: true, data: users[index] });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: ลบผู้ใช้
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *       404:
 *         description: ไม่พบผู้ใช้
 */
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.user_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });

  users.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;