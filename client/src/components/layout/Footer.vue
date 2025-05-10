<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Quán Ăn Online</h3>
          <p>Đặt món ăn ngon, giao hàng tận nơi, nhanh chóng và tiện lợi.</p>
        </div>
        
        <div class="footer-section">
          <h3>Liên hệ</h3>
          <p>Email: ducanh652k2@gmail.com</p>
          <p>Điện thoại: 0834 459 599</p>
          <p>Địa chỉ: ngõ 54, Đường Ngũ Nhạc, phường Thanh Trì, Quận Hoàng Mai, TP.Hà Nội</p>
        </div>
        
        <div class="footer-section">
          <h3>Giờ mở cửa</h3>
          <p>Thứ 2 - Thứ 6: 7:00 AM - 10:00 PM</p>
          <p>Thứ 7 - Chủ Nhật: 7:00 AM - 11:00 PM</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Hệ thống đặt đồ ăn trực tuyến.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--secondary);
  color: white;
  padding: 48px 0 16px;
  margin-top: 48px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h3 {
  margin-bottom: 16px;
  font-size: 1.25rem;
  color: var(--primary);
}

.footer-section p {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>