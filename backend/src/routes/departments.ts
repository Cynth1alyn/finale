import { Router } from 'express';
import { departments } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: จัดการแผนก
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: ดึงแผนกทั้งหมด
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: departments });
});

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: ดึงแผนกตาม ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: dept_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.get('/:id', (req, res) => {
  const dept = departments.find(d => d.dept_id === req.params.id);
  if (!dept) return res.status(404).json({ success: false, error: 'Department not found' });
  res.json({ success: true, data: dept });
});

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: สร้างแผนกใหม่
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dept_id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newDept = req.body;

  if (!newDept.dept_id) {
    newDept.dept_id = 'D' + String(Date.now()).slice(-4);
  }

  departments.push(newDept);
  res.status(201).json({ success: true, data: newDept });
});

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: แก้ไขแผนก
 *     tags: [Departments]
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
 *         description: ไม่พบข้อมูล
 */
router.put('/:id', (req, res) => {
  const index = departments.findIndex(d => d.dept_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Department not found' });

  departments[index] = { ...departments[index], ...req.body };
  res.json({ success: true, data: departments[index] });
});

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: ลบแผนก
 *     tags: [Departments]
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
 *         description: ไม่พบข้อมูล
 */
router.delete('/:id', (req, res) => {
  const index = departments.findIndex(d => d.dept_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Department not found' });

  departments.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;