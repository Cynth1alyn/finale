import { Router } from 'express';
import { requests } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: จัดการคำร้อง
 */

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: ดึงคำร้องทั้งหมด
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: requests });
});

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: ดึงคำร้องตาม ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: req_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.get('/:id', (req, res) => {
  const item = requests.find(r => r.req_id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: item });
});

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: สร้างคำร้องใหม่
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               req_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newReq = req.body;

  if (!newReq.req_id) {
    newReq.req_id = 'R' + String(Date.now()).slice(-4);
  }

  requests.push(newReq);
  res.status(201).json({ success: true, data: newReq });
});

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: แก้ไขคำร้อง
 *     tags: [Requests]
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
  const index = requests.findIndex(r => r.req_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Request not found' });

  requests[index] = { ...requests[index], ...req.body };
  res.json({ success: true, data: requests[index] });
});

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: ลบคำร้อง
 *     tags: [Requests]
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
  const index = requests.findIndex(r => r.req_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Request not found' });

  requests.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;