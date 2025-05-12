import axios from 'axios';

// Khởi tạo Axios Instance
const instance = axios.create({
  baseURL: 'http://localhost:5000', // URL của API server
  timeout: 10000,                   // thời gian Timeout: sau 10 giây
  headers: {
    'Content-Type': 'application/json'
  }
});

// Bộ chặn request để thêm token xác thực
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bộ chặn response để xử lý lỗi
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (expired tokens, etc.)
    if (error.response && error.response.status === 401) {
      // Xóa thông tin đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      // Chuyển hướng về trang login
      if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;