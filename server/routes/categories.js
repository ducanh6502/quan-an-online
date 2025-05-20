import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { 
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../models/categoryModel.js';

const router = express.Router();

// Lấy danh sách tất cả danh mục món ăn
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy danh mục theo ID
router.get('/:id', async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo danh mục mới (chỉ admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
    }
    
    const newCategory = await createCategory({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật danh mục (chỉ admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
    }
    
    const updatedCategory = await updateCategory(req.params.id, { name });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa danh mục (chỉ admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;