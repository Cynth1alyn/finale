import { Router } from 'express';
import { equipment, equipmentHistory } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: จัดการอุปกรณ์
 */

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: ดึงอุปกรณ์ทั้งหมด
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: equipment });
});

/**
 * @swagger
 * /api/equipment/{id}:
 *   get:
 *     summary: ดึงอุปกรณ์ตาม ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: equip_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.get('/:id', (req, res) => {
  const item = equipment.find(e => e.equip_id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Equipment not found' });
  res.json({ success: true, data: item });
});

/**
 * @swagger
 * /api/equipment/{id}/history:
 *   get:
 *     summary: ดูประวัติอุปกรณ์
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: equip_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/:id/history', (req, res) => {
  const history = equipmentHistory.filter(h => h.equip_id === req.params.id);
  res.json({ success: true, data: history });
});

/**
 * @swagger
 * /api/equipment:
 *   post:
 *     summary: เพิ่มอุปกรณ์ใหม่
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equip_id:
 *                 type: string
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 */
router.post('/', (req, res) => {
  const newItem = req.body;

  if (!newItem.equip_id) {
    newItem.equip_id = 'E' + String(Date.now()).slice(-4);
  }

  equipment.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

/**
 * @swagger
 * /api/equipment/{id}:
 *   put:
 *     summary: แก้ไขอุปกรณ์
 *     tags: [Equipment]
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
  const index = equipment.findIndex(e => e.equip_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Equipment not found' });

  equipment[index] = { ...equipment[index], ...req.body };
  res.json({ success: true, data: equipment[index] });
});

/**
 * @swagger
 * /api/equipment/{id}:
 *   delete:
 *     summary: ลบอุปกรณ์
 *     tags: [Equipment]
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
  const index = equipment.findIndex(e => e.equip_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Equipment not found' });

  equipment.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;