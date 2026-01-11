export type UserRole = 'buyer' | 'seller' | 'freelancer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  role: UserRole;
  userId: string;
  status: 'active' | 'inactive' | 'suspended';
  memberSince: string;
  isEmailVerified: boolean;
}

export interface Order {
  id: string;
  serviceName: string;
  sellerName: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  orderDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'payment' | 'refund' | 'referral';
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  totalSpent: number;
}

export interface ReferralData {
  referralLink: string;
  totalReferrals: number;
  totalEarnings: number;
  withdrawableBalance: number;
}

export interface Stats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  availableBalance: number;
  referralEarnings: number;
}