import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminsFilePath = path.join(__dirname, '../data/admins.json');

// Lấy và trả về toàn bộ danh sách tài khoản admin
export const getAllAdmins = async () => {
  try {
    const data = await fs.readFile(adminsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading admins file:', error);
    return [];
  }
};

// Lấy thông tin admin theo ID
export const getAdminById = async (id) => {
  try {
    const admins = await getAllAdmins();
    return admins.find(admin => admin.id === id) || null;
  } catch (error) {
    console.error('Error getting admin by ID:', error);
    return null;
  }
};

// Lấy thông tin admin theo tên đăng nhập
export const getAdminByUsername = async (username) => {
  try {
    const admins = await getAllAdmins();
    return admins.find(admin => admin.username === username) || null;
  } catch (error) {
    console.error('Error getting admin by username:', error);
    return null;
  }
};

// Xác thực mật khẩu
export const verifyPassword = async (plainPassword, storedPassword) => {
  return plainPassword === storedPassword;
};