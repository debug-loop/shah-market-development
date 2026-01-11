// Seller Dashboard Types - Ready for Express.js backend integration

export type ProductCategory = 
  | 'accounts'
  | 'gift-cards'
  | 'sms-verification'
  | 'software-licenses'
  | 'currency-exchange'
  | 'virtual-cards'
  | 'learning-courses'
  | 'digital-marketing'
  | 'usa-documents'
  | 'proxy-vpn'
  | 'games';

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export type DeliveryTime = 'instant' | '1-6h' | '12h' | '24h' | 'custom';

export type PaymentMethod = 'usdt' | 'usd' | 'both';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'disputed';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Product {
  id: string;
  sellerId: string;
  category: ProductCategory;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'USDT';
  deliveryTime: DeliveryTime;
  customDeliveryTime?: string;
  quantity: number;
  isUnlimited: boolean;
  hasReplacement: boolean;
  replacementDuration?: string;
  replacementConditions?: string;
  status: ProductStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  currency: 'USD' | 'USDT';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatar?: string;
  status: SellerStatus;
  rating: number;
  totalSales: number;
  totalEarnings: number;
  balance: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeOrders: number;
  totalEarnings: number;
  pendingProducts: number;
  sellerRating: number;
  accountStatus: SellerStatus;
}

export interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  transactions: EarningTransaction[];
}

export interface EarningTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: 'USD' | 'USDT';
  type: 'sale' | 'withdrawal' | 'refund' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
