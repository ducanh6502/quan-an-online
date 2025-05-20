import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foodsFilePath = path.join(__dirname, '../data/foods.json');

// Lấy tất cả món ăn
export const getAllFoods = async () => {
  try {
    const data = await fs.readFile(foodsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading foods file:', error);
    return [];
  }
};

// Lấy món ăn theo ID
export const getFoodById = async (id) => {
  try {
    const foods = await getAllFoods();
    return foods.find(food => food.id === id) || null;
  } catch (error) {
    console.error('Error getting food by ID:', error);
    return null;
  }
};

// Lấy các món ăn nổi bật
export const getPopularFoods = async (limit = 4) => {
  try {
    const foods = await getAllFoods();
    return foods
      .filter(food => food.popular)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting popular foods:', error);
    return [];
  }
};

// Tạo món ăn mới
export const createFood = async (foodData) => {
  try {
    const foods = await getAllFoods();
    
    // Tạo món ăn mới
    const newFood = {
      id: Date.now().toString(),
      ...foodData,
      rating: 0,
      popular: false,
      createdAt: new Date().toISOString()
    };
    
    // Thêm vào mảng món ăn và lưu lại
    foods.push(newFood);
    await fs.writeFile(foodsFilePath, JSON.stringify(foods, null, 2));
    
    return newFood;
  } catch (error) {
    console.error('Error creating food:', error);
    throw error;
  }
};

// Cập nhật món ăn
export const updateFood = async (id, updateData) => {
  try {
    const foods = await getAllFoods();
    const foodIndex = foods.findIndex(food => food.id === id);
    
    if (foodIndex === -1) {
      throw new Error('Không tìm thấy món ăn');
    }
    
    // Cập nhật dữ liệu món ăn
    foods[foodIndex] = {
      ...foods[foodIndex],
      ...updateData
    };
    
    await fs.writeFile(foodsFilePath, JSON.stringify(foods, null, 2));
    
    return foods[foodIndex];
  } catch (error) {
    console.error('Error updating food:', error);
    throw error;
  }
};

// Xóa món ăn
export const deleteFood = async (id) => {
  try {
    let foods = await getAllFoods();
    const foodToDelete = foods.find(food => food.id === id);
    
    if (!foodToDelete) {
      throw new Error('Không tìm thấy món ăn');
    }
    
    // Loại bỏ món ăn cần xóa khỏi mảng
    foods = foods.filter(food => food.id !== id);
    
    await fs.writeFile(foodsFilePath, JSON.stringify(foods, null, 2));
    
    return { message: 'Đã xóa món ăn thành công' };
  } catch (error) {
    console.error('Error deleting food:', error);
    throw error;
  }
};