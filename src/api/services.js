import api from './axios';

// Auth Services
export const authService = {
  signupBuyer: (data) => api.post('/auth/signup/buyer', data),
  signupSeller: (data) => api.post('/auth/signup/seller', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Admin Services
export const adminService = {
  login: (data) => api.post('/admin/login', data),
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingSellers: () => api.get('/admin/sellers/pending'),
  approveSeller: (id) => api.post(`/admin/sellers/${id}/approve`),
  rejectSeller: (id, data) => api.post(`/admin/sellers/${id}/reject`, data),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  freezeUser: (id) => api.put(`/admin/users/${id}/freeze`),
  unfreezeUser: (id) => api.put(`/admin/users/${id}/unfreeze`),
  getPendingProducts: () => api.get('/admin/products/pending'),
  approveProduct: (id) => api.post(`/admin/products/${id}/approve`),
  rejectProduct: (id, data) => api.post(`/admin/products/${id}/reject`, data),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id, data) => api.post(`/admin/withdrawals/${id}/reject`, data),
  getPlatformSettings: () => api.get('/admin/settings'),
  updatePlatformSetting: (data) => api.put('/admin/settings', data),
  getAuditLogs: (params) => api.get('/admin/logs', { params }),
};

// Product Services
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getSellerProducts: () => api.get('/products/seller'),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Category Services
export const categoryService = {
  getAll: () => api.get('/categories'),
};

// Order Services
export const orderService = {
  create: (data) => api.post('/orders', data),
  getBuyerOrders: () => api.get('/orders/buyer'),
  getSellerOrders: () => api.get('/orders/seller'),
  getById: (id) => api.get(`/orders/${id}`),
  markAsDelivered: (id, data) => api.post(`/orders/${id}/deliver`, data),
  confirmReceipt: (id) => api.post(`/orders/${id}/confirm`),
  openDispute: (id, data) => api.post(`/orders/${id}/dispute`, data),
};

// Wallet Services
export const walletService = {
  getWallet: () => api.get('/wallet'),
  deposit: (data) => api.post('/wallet/deposit', data),
  withdraw: (data) => api.post('/wallet/withdraw', data),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
  getAllWallets: (params) => api.get('/admin/wallets', { params }),
};

// Buyer Services
export const buyerService = {
  getDashboard: () => api.get('/buyer/dashboard'),
};

// Seller Services
export const sellerService = {
  applyAsSeller: (data) => api.post('/seller/apply', data),
  getApplicationStatus: () => api.get('/seller/application-status'),
  getDashboard: () => api.get('/seller/dashboard'),
  getEarnings: () => api.get('/seller/earnings'),
  getProfile: () => api.get('/seller/profile'),
};

// Notification Services
export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Review Services
export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getSellerReviews: (sellerId) => api.get(`/reviews/seller/${sellerId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Referral Services
export const referralService = {
  getInfo: () => api.get('/referrals'),
  withdraw: (data) => api.post('/referrals/withdraw', data),
};

// Dispute Services
export const disputeService = {
  getAll: (params) => api.get('/disputes', { params }),
  getById: (id) => api.get(`/disputes/${id}`),
  resolve: (id, data) => api.post(`/disputes/${id}/resolve`, data),
};

export default api;
