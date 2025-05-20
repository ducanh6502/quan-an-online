import axios from 'axios';

// Khởi tạo Axios Instance với cấu hình mặc định (baseURL, timeout, headers)
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Địa chỉ URL của máy chủ API server
  timeout: 10000,                   // Thời gian chờ tối đa cho mỗi request (timeout): sau 10 giây
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm token xác thực vào header của mỗi request nếu có
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (nếu đã đăng nhập)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi khi gửi request
    return Promise.reject(error);
  }
);

// Kiểm tra và xử lý lỗi từ phản hồi của server (ví dụ: hết hạn đăng nhập)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu gặp lỗi 401 (không xác thực), xóa thông tin đăng nhập và chuyển hướng về trang đăng nhập
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
    // Trả về lỗi để các nơi khác có thể xử lý tiếp nếu cần
    return Promise.reject(error);
  }
);

export default instance;