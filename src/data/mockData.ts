import { User, Order, Transaction, WalletData, ReferralData, Stats } from '@/types/dashboard';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 234 567 8900',
  country: 'United States',
  avatar: '',
  role: 'buyer',
  userId: 'BX-10245',
  status: 'active',
  memberSince: '12 Dec 2025',
  isEmailVerified: true,
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    serviceName: 'Logo Design',
    sellerName: 'Design Studio Pro',
    price: 150.00,
    status: 'completed',
    orderDate: '2025-01-08',
  },
  {
    id: 'ORD-002',
    serviceName: 'Website Development',
    sellerName: 'WebDev Masters',
    price: 500.00,
    status: 'in_progress',
    orderDate: '2025-01-05',
  },
  {
    id: 'ORD-003',
    serviceName: 'SEO Optimization',
    sellerName: 'SEO Experts',
    price: 200.00,
    status: 'pending',
    orderDate: '2025-01-10',
  },
  {
    id: 'ORD-004',
    serviceName: 'Content Writing',
    sellerName: 'Content Creators',
    price: 75.00,
    status: 'cancelled',
    orderDate: '2024-12-28',
  },
  {
    id: 'ORD-005',
    serviceName: 'Video Editing',
    sellerName: 'Video Pro',
    price: 300.00,
    status: 'completed',
    orderDate: '2024-12-20',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TRX-001',
    date: '2025-01-10',
    type: 'deposit',
    amount: 500.00,
    paymentMethod: 'USDT',
    status: 'completed',
  },
  {
    id: 'TRX-002',
    date: '2025-01-08',
    type: 'payment',
    amount: -150.00,
    paymentMethod: 'Wallet',
    status: 'completed',
  },
  {
    id: 'TRX-003',
    date: '2025-01-05',
    type: 'referral',
    amount: 15.00,
    paymentMethod: 'Referral Bonus',
    status: 'completed',
  },
  {
    id: 'TRX-004',
    date: '2025-01-02',
    type: 'withdraw',
    amount: -100.00,
    paymentMethod: 'USDT',
    status: 'pending',
  },
  {
    id: 'TRX-005',
    date: '2024-12-28',
    type: 'refund',
    amount: 75.00,
    paymentMethod: 'Wallet',
    status: 'completed',
  },
];

export const mockWallet: WalletData = {
  availableBalance: 120.50,
  pendingBalance: 30.00,
  totalSpent: 540.00,
};

export const mockReferral: ReferralData = {
  referralLink: 'https://shah-freelance.vercel.app/ref/johndoe',
  totalReferrals: 8,
  totalEarnings: 45.00,
  withdrawableBalance: 30.00,
};

export const mockStats: Stats = {
  totalOrders: 15,
  activeOrders: 2,
  completedOrders: 12,
  cancelledOrders: 1,
  availableBalance: 120.50,
  referralEarnings: 45.00,
};