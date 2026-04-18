import { Router } from 'express';
import { query, execute } from '../lib/db';

const router = Router();

function jsonValue(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

router.get('/', async (req, res) => {
  try {
    const requests = await query('SELECT * FROM requests');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM requests WHERE req_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const newReq = { ...req.body };
    if (!newReq.req_id) {
      newReq.req_id = 'R' + Date.now();
    }

    await query(
      'INSERT INTO requests (req_id, req_date, req_status, user_id, items) VALUES (?, ?, ?, ?, ?)',
      [
        newReq.req_id,
        newReq.req_date || new Date().toISOString().slice(0, 10),
        newReq.req_status || '',
        newReq.user_id || '',
        jsonValue(newReq.items)
      ]
    );

    res.status(201).json({ success: true, data: newReq });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM requests WHERE req_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Request not found' });

    const existing = rows[0] as Record<string, unknown>;
    const updated = { ...existing, ...req.body };

    await query(
      'UPDATE requests SET req_date = ?, req_status = ?, user_id = ?, items = ? WHERE req_id = ?',
      [
        updated.req_date || new Date().toISOString().slice(0, 10),
        updated.req_status || '',
        updated.user_id || '',
        jsonValue(updated.items),
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
    const result = await execute('DELETE FROM requests WHERE req_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;