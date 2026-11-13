import { Router } from 'express';
import { loginAdmin, getCurrentAdmin, logoutAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authMiddleware, getCurrentAdmin);

export default router;
