import { Router } from 'express';
import { query, execute } from '../lib/db';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: จัดการอุปกรณ์
 */

router.get('/', async (req, res) => {
  try {
    const equipment = await query('SELECT * FROM equipment');
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const history = await query('SELECT * FROM equipment_history WHERE equip_id = ? ORDER BY date DESC', [req.params.id]);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM equipment WHERE equip_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const newItem = req.body;
    if (!newItem.equip_id) {
      newItem.equip_id = 'E' + Date.now();
    }

    await query(
      'INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newItem.equip_id,
        newItem.name || '',
        newItem.type_category || null,
        newItem.total_qty || 0,
        newItem.remain_qty || 0,
        newItem.unit_id || null,
        newItem.dept_id || null,
        newItem.status || null
      ]
    );

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM equipment WHERE equip_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Equipment not found' });

    const existing = rows[0] as any;
    const updated = { ...existing, ...req.body };

    await query(
      'UPDATE equipment SET name = ?, type_category = ?, total_qty = ?, remain_qty = ?, unit_id = ?, dept_id = ?, status = ? WHERE equip_id = ?',
      [
        updated.name || '',
        updated.type_category || null,
        updated.total_qty || 0,
        updated.remain_qty || 0,
        updated.unit_id || null,
        updated.dept_id || null,
        updated.status || null,
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
    const result: any = await execute('DELETE FROM equipment WHERE equip_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Equipment not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;