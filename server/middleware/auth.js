import jwt from 'jsonwebtoken';

// Khóa bí mật cho JWT
const JWT_SECRET = 'quananonline-secret-key';

// Tạo token JWT
export const generateToken = (user, isAdmin = false) => {
  return jwt.sign(
    { id: user.id, isAdmin },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Middleware xác thực người dùng
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực, truy cập bị từ chối' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ, truy cập bị từ chối' });
  }
};

// Middleware xác thực quyền admin
export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Xác thực thất bại, truy cập bị từ chối' });
  }
};