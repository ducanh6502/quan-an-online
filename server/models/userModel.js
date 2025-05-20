import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Lấy người dùng theo ID
export const getUserById = async (id) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Lấy người dùng theo email
export const getUserByEmail = async (email) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  try {
    const users = await getAllUsers();
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Tạo người dùng mới
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Thêm vào mảng người dùng và lưu lại
    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    
    // Trả về dữ liệu người dùng không bao gồm mật khẩu
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Cập nhật người dùng
export const updateUser = async (id, updateData) => {
  try {
    const users = await getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    // Nếu cập nhật mật khẩu thì mã hóa lại
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    // Cập nhật dữ liệu người dùng
    users[userIndex] = {
      ...users[userIndex],
      ...updateData
    };
    
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    
    // Trả về dữ liệu người dùng không bao gồm mật khẩu
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Xác thực mật khẩu
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};