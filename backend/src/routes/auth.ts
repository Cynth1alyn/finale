import { Router } from 'express';
import { users } from '../lib/data';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: การยืนยันตัวตน
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *       401:
 *         description: email หรือ password ไม่ถูกต้อง
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt for: ${email}`);

  const user = users.find(u => u.email === email);

  if (user) {
    res.json({
      success: true,
      data: {
        user,
        token: "real-token-from-backend-" + Date.now()
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
});

export default router;