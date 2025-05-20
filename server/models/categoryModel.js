import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesFilePath = path.join(__dirname, '../data/categories.json');

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const data = await fs.readFile(categoriesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories file:', error);
    return [];
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const categories = await getAllCategories();
    return categories.find(category => category.id === id) || null;
  } catch (error) {
    console.error('Error getting category by ID:', error);
    return null;
  }
};

// Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const categories = await getAllCategories();
    
    // Tạo danh mục mới
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      createdAt: new Date().toISOString()
    };
    
    // Thêm vào mảng danh mục và lưu lại
    categories.push(newCategory);
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
    
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (id, updateData) => {
  try {
    const categories = await getAllCategories();
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Cập nhật dữ liệu danh mục
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updateData
    };
    
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
    
    return categories[categoryIndex];
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Xóa danh mục
export const deleteCategory = async (id) => {
  try {
    let categories = await getAllCategories();
    const categoryToDelete = categories.find(category => category.id === id);
    
    if (!categoryToDelete) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Loại bỏ danh mục cần xóa khỏi mảng
    categories = categories.filter(category => category.id !== id);
    
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
    
    return { message: 'Đã xóa danh mục thành công' };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};