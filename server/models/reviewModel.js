import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reviewsFilePath = path.join(__dirname, '../data/reviews.json');

// Lấy tất cả đánh giá
export const getAllReviews = async () => {
  try {
    const data = await fs.readFile(reviewsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews file:', error);
    return [];
  }
};

// Lấy đánh giá theo ID
export const getReviewById = async (id) => {
  try {
    const reviews = await getAllReviews();
    return reviews.find(review => review.id === id) || null;
  } catch (error) {
    console.error('Error getting review by ID:', error);
    return null;
  }
};

// Lấy đánh giá theo ID món ăn
export const getReviewsByFoodId = async (foodId) => {
  try {
    const reviews = await getAllReviews();
    return reviews.filter(review => review.foodId === foodId);
  } catch (error) {
    console.error('Error getting reviews by food ID:', error);
    return [];
  }
};

// Lấy đánh giá theo ID người dùng
export const getReviewsByUserId = async (userId) => {
  try {
    const reviews = await getAllReviews();
    return reviews.filter(review => review.userId === userId);
  } catch (error) {
    console.error('Error getting reviews by user ID:', error);
    return [];
  }
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
  try {
    const reviews = await getAllReviews();
    
    // Tạo đánh giáá
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    
    // Thêm vào mảng đánh giá và lưu lại
    reviews.push(newReview);
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2));
    
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (id, updateData) => {
  try {
    const reviews = await getAllReviews();
    const reviewIndex = reviews.findIndex(review => review.id === id);
    
    if (reviewIndex === -1) {
      throw new Error('Không tìm thấy đánh giá');
    }
    
    // Cập nhật dữ liệu đánh giá
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...updateData
    };
    
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2));
    
    return reviews[reviewIndex];
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (id) => {
  try {
    let reviews = await getAllReviews();
    const reviewToDelete = reviews.find(review => review.id === id);
    
    if (!reviewToDelete) {
      throw new Error('Không tìm thấy đánh giá');
    }
    
    // Loại bỏ đánh giá cần xóa khỏi mảng
    reviews = reviews.filter(review => review.id !== id);
    
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2));
    
    return { message: 'Đã xóa đánh giá thành công' };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};