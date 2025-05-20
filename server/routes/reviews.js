import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { 
  getAllReviews,
  getReviewById,
  getReviewsByFoodId,
  getReviewsByUserId,
  createReview,
  updateReview,
  deleteReview
} from '../models/reviewModel.js';
import { getFoodById, updateFood } from '../models/foodModel.js';

const router = express.Router();

// Lấy tất cả đánh giá (chỉ admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy đánh giá theo ID món ăn
router.get('/food/:foodId', async (req, res) => {
  try {
    const reviews = await getReviewsByFoodId(req.params.foodId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy đánh giá theo ID người dùng
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const reviews = await getReviewsByUserId(req.user.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo đánh giá mới
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!foodId || !rating || !comment) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Kiểm tra món ăn có tồn tại không
    const food = await getFoodById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    
    // Tạo đánh giá mới
    const newReview = await createReview({
      userId: req.user.id,
      foodId,
      rating: parseInt(rating),
      comment,
      userName: req.user.name
    });
    
    // Cập nhật điểm đánh giá của món ăn
    const allReviews = await getReviewsByFoodId(foodId);
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await updateFood(foodId, { rating: averageRating.toFixed(1) });
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật đánh giá (admin trả lời hoặc người dùng sửa)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    
    // Kiểm tra quyền: chỉ admin hoặc chủ đánh giá mới được sửa
    if (!req.user.isAdmin && review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa đánh giá này' });
    }
    
    // Cập nhật đánh giá
    let updateData = {};
    
    if (req.user.isAdmin) {
      // Admin có thể trả lời đánh giá
      updateData = { adminReply: req.body.adminReply };
    } else {
      // Người dùng có thể sửa đánh giá của mình
      if (!req.body.rating || !req.body.comment) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }
      
      updateData = {
        rating: parseInt(req.body.rating),
        comment: req.body.comment
      };
      
      // Cập nhật điểm đánh giá của món ăn
      const allReviews = await getReviewsByFoodId(review.foodId);
      // Cập nhật điểm đánh giá mới vào mảng để tính trung bình
      const updatedReviews = allReviews.map(r => 
        r.id === review.id ? { ...r, rating: parseInt(req.body.rating) } : r
      );
      
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / updatedReviews.length;
      
      await updateFood(review.foodId, { rating: averageRating.toFixed(1) });
    }
    
    const updatedReview = await updateReview(req.params.id, updateData);
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa đánh giá (admin hoặc chủ đánh giá)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    
    // Kiểm tra quyền: chỉ admin hoặc chủ đánh giá mới được xóa
    if (!req.user.isAdmin && review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xóa đánh giá này' });
    }
    
    await deleteReview(req.params.id);
    
    // Cập nhật điểm đánh giá của món ăn
    const allReviews = await getReviewsByFoodId(review.foodId);
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allReviews.length;
      await updateFood(review.foodId, { rating: averageRating.toFixed(1) });
    } else {
      // Nếu không còn đánh giá nào, đặt lại điểm về 0
      await updateFood(review.foodId, { rating: 0 });
    }
    
    res.json({ message: 'Đã xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;