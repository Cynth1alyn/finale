import { Router } from 'express';
import { issues } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: จัดการปัญหา (Issues)
 */

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: ดึงปัญหาทั้งหมด
 *     tags: [Issues]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: issues });
});

/**
 * @swagger
 * /api/issues/{id}:
 *   get:
 *     summary: ดึงปัญหาตาม ID
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: issue_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.get('/:id', (req, res) => {
  const issue = issues.find(i => i.issue_id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, error: 'Issue not found' });
  res.json({ success: true, data: issue });
});

/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: สร้างปัญหาใหม่
 *     tags: [Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newIssue = { ...req.body, issue_id: 'I' + Date.now() };
  issues.push(newIssue);
  res.status(201).json({ success: true, data: newIssue });
});

/**
 * @swagger
 * /api/issues/{id}:
 *   put:
 *     summary: แก้ไขปัญหา
 *     tags: [Issues]
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
  const index = issues.findIndex(i => i.issue_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });

  issues[index] = { ...issues[index], ...req.body };
  res.json({ success: true, data: issues[index] });
});

/**
 * @swagger
 * /api/issues/{id}:
 *   delete:
 *     summary: ลบปัญหา
 *     tags: [Issues]
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
  const index = issues.findIndex(i => i.issue_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });

  issues.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;