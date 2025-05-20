import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import các route
import userRoutes from './routes/users.js';
import foodRoutes from './routes/foods.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// Lấy thư mục hiện tại của file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Phục vụ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Định nghĩa các route API
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Phục vụ file tĩnh khi ở môi trường production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});