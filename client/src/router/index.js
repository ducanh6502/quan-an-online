import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import các component cho khách hàng
import Home from '../views/Home.vue';
import Menu from '../views/Menu.vue';
import FoodDetails from '../views/FoodDetails.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import UserLogin from '../views/UserLogin.vue';
import UserRegister from '../views/UserRegister.vue';
import UserProfile from '../views/UserProfile.vue';
import OrderHistory from '../views/OrderHistory.vue';

// Import các component cho admin
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import ManageFoods from '../views/admin/ManageFoods.vue';
import ManageOrders from '../views/admin/ManageOrders.vue';
import ManageReviews from '../views/admin/ManageReviews.vue';

const routes = [
  // Routes khách hàng
  { path: '/', component: Home, name: 'home' },
  { path: '/menu', component: Menu, name: 'menu' },
  { path: '/food/:id', component: FoodDetails, name: 'food-details' },
  { path: '/cart', component: Cart, name: 'cart' },
  { path: '/checkout', component: Checkout, name: 'checkout', meta: { requiresAuth: true } },
  { path: '/login', component: UserLogin, name: 'login', meta: { guestOnly: true } },
  { path: '/register', component: UserRegister, name: 'register', meta: { guestOnly: true } },
  { path: '/profile', component: UserProfile, name: 'profile', meta: { requiresAuth: true } },
  { path: '/orders', component: OrderHistory, name: 'orders', meta: { requiresAuth: true } },
  
// Routes Admin 
  { path: '/admin/login', component: AdminLogin, name: 'admin-login', meta: { hideNavbar: true, hideFooter: true, adminGuestOnly: true } },
  { 
    path: '/admin', 
    component: AdminDashboard, 
    name: 'admin-dashboard',
    meta: { requiresAdmin: true, hideNavbar: true, hideFooter: true }
  },
  { 
    path: '/admin/foods', 
    component: ManageFoods, 
    name: 'admin-foods',
    meta: { requiresAdmin: true, hideNavbar: true, hideFooter: true }
  },
  { 
    path: '/admin/orders', 
    component: ManageOrders, 
    name: 'admin-orders',
    meta: { requiresAdmin: true, hideNavbar: true, hideFooter: true }
  },
  { 
    path: '/admin/reviews', 
    component: ManageReviews, 
    name: 'admin-reviews',
    meta: { requiresAdmin: true, hideNavbar: true, hideFooter: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Kiểm tra yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } 
  // Kiểm tra quyền admin
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'admin-login' });
  } 
  // Chuyển hướng user đã đăng nhập khỏi trang login/register
  else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' });
  }
  // Chuyển hướng admin đã đăng nhập khỏi trang admin login
  else if (to.meta.adminGuestOnly && authStore.isAdmin) {
    next({ name: 'admin-dashboard' });
  }
  else {
    next();
  }
});

export default router;