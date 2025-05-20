import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  changePassword 
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Các route công khai
router.post('/register', registerUser);
router.post('/login', loginUser);

// Các route bảo vệ (cần đăng nhập)
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/change-password', authMiddleware, changePassword);

export default router;