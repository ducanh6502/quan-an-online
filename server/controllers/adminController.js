import { getAdminByUsername, verifyPassword } from '../models/adminModel.js';
import { generateToken } from '../middleware/auth.js';

// Xử lý đăng nhập admin
export const loginAdmin = async (req, res) => {
  try {
    // Lấy thông tin đăng nhập
    const { username, password } = req.body;
    
    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }
    
    // Kiểm tra admin có tồn tại ko 
    const admin = await getAdminByUsername(username);
    if (!admin) {
      return res.status(404).json({ message: 'Tên đăng nhập không tồn tại' });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }
    
    // Tạo token
    const token = generateToken(admin, true);
    
    const { password: _, ...adminWithoutPassword } = admin;
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      admin: adminWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xử lý lấy thông tin 
export const getDashboardStats = async (req, res) => {
  try {
    
    res.json({
      totalOrders: 4,
      totalSales: 125000,
      totalCustomers: 2,
      totalFoodItems: 7,
      recentOrders: [],
      popularItems: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};