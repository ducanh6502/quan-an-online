import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { 
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrder
} from '../models/orderModel.js';

const router = express.Router();

// Lấy danh sách tất cả đơn hàng (chỉ admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy đơn hàng theo ID (admin và người đặt đơn)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    // Kiểm tra quyền: chỉ admin hoặc người đặt đơn hàng mới được xem
    if (!req.user.isAdmin && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền truy cập đơn hàng này' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy đơn hàng của người dùng hiện tại theo ID người dùng
router.get('/user/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo đơn hàng mới
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, address, phone, paymentMethod } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!items || !totalAmount || !address || !phone || !paymentMethod) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Tạo đơn hàng mới
    const newOrder = await createOrder({
      userId: req.user.id,
      items,
      totalAmount,
      address,
      phone,
      paymentMethod
    });
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật đơn hàng (chỉ admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới' });
    }
    
    const updatedOrder = await updateOrder(req.params.id, { status });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;