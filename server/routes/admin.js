import express from 'express';
import { loginAdmin, getDashboardStats } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Các route công khai
router.post('/login', loginAdmin);

// Các route dành riêng cho admin (cần xác thực)
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

export default router;