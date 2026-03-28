import { Router } from 'express';
import { jobs } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: จัดการงาน
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: ดึงงานทั้งหมด
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: jobs });
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: ดึงงานตาม ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: job_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบงาน
 */
router.get('/:id', (req, res) => {
  const job = jobs.find(j => j.job_id === req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, data: job });
});

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: สร้างงานใหม่
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newJob = { ...req.body, job_id: 'J' + Date.now() };
  jobs.push(newJob);
  res.status(201).json({ success: true, data: newJob });
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: แก้ไขงาน
 *     tags: [Jobs]
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
 *         description: ไม่พบงาน
 */
router.put('/:id', (req, res) => {
  const index = jobs.findIndex(j => j.job_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Job not found' });

  jobs[index] = { ...jobs[index], ...req.body };
  res.json({ success: true, data: jobs[index] });
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: ลบงาน
 *     tags: [Jobs]
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
 *         description: ไม่พบงาน
 */
router.delete('/:id', (req, res) => {
  const index = jobs.findIndex(j => j.job_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Job not found' });

  jobs.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;