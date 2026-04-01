import { Router } from 'express';
import { query } from '../lib/db';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: การยืนยันตัวตน
 */

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Login attempt for: ${email}`);

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ success: false, error: 'Invalid email or password' });

    res.json({
      success: true,
      data: {
        user: users[0],
        token: 'real-token-from-backend-' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;