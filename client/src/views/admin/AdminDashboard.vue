<script setup>
import { ref, onMounted } from 'vue';
import AdminSidebar from '../../components/admin/AdminSidebar.vue';
import axios from '../../utils/axios';

const stats = ref({
  totalOrders: 0,
  totalSales: 0,
  totalCustomers: 0,
  totalFoodItems: 0
});

const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await axios.get('/api/admin/dashboard');
    stats.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />
    
    <div class="admin-content">
      <div class="admin-header">
        <h1>Dashboard</h1>
      </div>
      
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
      
      <div v-else class="dashboard-container">
        <!-- Các thẻ thống kê số liệu -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #4caf50;">
              <span>📦</span>
            </div>
            <div class="stat-content">
              <h3>Tổng đơn hàng</h3>
              <p class="stat-value">{{ stats.totalOrders }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #2196f3;">
              <span>💰</span>
            </div>
            <div class="stat-content">
              <h3>Doanh thu</h3>
              <p class="stat-value">{{ stats.totalSales.toLocaleString() }}đ</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #ff9800;">
              <span>👤</span>
            </div>
            <div class="stat-content">
              <h3>Khách hàng</h3>
              <p class="stat-value">{{ stats.totalCustomers }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #e91e63;">
              <span>🍔</span>
            </div>
            <div class="stat-content">
              <h3>Món ăn</h3>
              <p class="stat-value">{{ stats.totalFoodItems }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  padding: 24px;
  margin-left: 250px;
  background-color: #f8f9fa;
}

.admin-header {
  margin-bottom: 24px;
}

.admin-header h1 {
  margin: 0;
  color: var(--secondary);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 250px);
  gap: 24px;
  margin-bottom: 24px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--gray);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 4px 0 0;
  color: var(--dark);
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 250px);
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: repeat(1, 250px);
  }
  
  .dashboard-container {
    padding: 0 16px;
  }
  
  .admin-content {
    margin-left: 0;
  }
}
</style>