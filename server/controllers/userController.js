import { getUserByEmail, createUser, getUserById, updateUser, verifyPassword } from '../models/userModel.js';
import { generateToken } from '../middleware/auth.js';

// Đăng ký người dùng mới
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Tạo người dùng mới
    const newUser = await createUser({ name, email, password, phone, address });
    
    // Tạo token xác thực
    const token = generateToken(newUser);
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại' });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }
    
    // Tạo token xác thực
    const token = generateToken(user);
    
    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin hồ sơ người dùng
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật hồ sơ người dùng
export const updateUserProfile = async (req, res) => {
  try {
    // Chỉ cho phép cập nhật các trường này
    const { name, phone, address } = req.body;
    
    const updatedUser = await updateUser(req.user.id, { name, phone, address });
    
    res.json({
      message: 'Cập nhật thông tin thành công',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Lấy thông tin người dùng
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }
    
    // Cập nhật mật khẩu mới
    await updateUser(req.user.id, { password: newPassword });
    
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};