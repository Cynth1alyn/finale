import { Router } from 'express';
import { users } from '../lib/data';

const router = Router();

// Mock login logic
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
