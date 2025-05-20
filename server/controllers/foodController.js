import { 
  getAllFoods, 
  getFoodById, 
  getPopularFoods, 
  createFood, 
  updateFood, 
  deleteFood 
} from '../models/foodModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy danh sách món ăn
export const getFoods = async (req, res) => {
  try {
    const foods = await getAllFoods();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy món ăn phổ biến
export const getPopular = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;
    const popularFoods = await getPopularFoods(limit);
    res.json(popularFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy món ăn theo ID
export const getFood = async (req, res) => {
  try {
    const food = await getFoodById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo món ăn mới
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Xử lý hình ảnh upload
    let imageUrl = image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Tạo món mới
    const newFood = await createFood({ 
      name, 
      description, 
      price: parseFloat(price), 
      category, 
      image: imageUrl 
    });
    
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật món ăn
export const editFood = async (req, res) => {
  try {
    const { name, description, price, category, popular, image } = req.body;
    
    // Lấy món ăn hiện tại
    const existingFood = await getFoodById(req.params.id);
    if (!existingFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    
    // Xử lý hình ảnh mới nếu có
    let imageUrl = image || existingFood.image;
    if (req.file) {
    // Xóa ảnh cũ nếu là ảnh local
      if (existingFood.image?.startsWith('/uploads/')) {
        try {
          const oldImagePath = path.join(__dirname, '..', existingFood.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Cập nhật thông tin món ăn
    const updatedFood = await updateFood(req.params.id, { 
      name, 
      description, 
      price: price ? parseFloat(price) : existingFood.price, 
      category, 
      popular: popular === undefined ? existingFood.popular : popular === 'true',
      image: imageUrl
    });
    
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa Món Ăn
export const removeFood = async (req, res) => {
  try {
    // Kiểm tra món ăn tồn tại
    const existingFood = await getFoodById(req.params.id);
    if (!existingFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    
    // Xóa file ảnh nếu là ảnh local
    if (existingFood.image?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(__dirname, '..', existingFood.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    
    // Xóa món ăn khỏi database
    await deleteFood(req.params.id);
    
    res.json({ message: 'Đã xóa món ăn thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};