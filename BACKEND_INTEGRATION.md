# Backend Integration Guide

## Overview
This frontend is integrated with the Shah Market Development Backend API.

**Backend Repository:** https://github.com/debug-loop/shaf-market-development-backend

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the backend API URL in `.env`:

```env
# For local development
VITE_API_URL=http://localhost:5000/api

# For production
# VITE_API_URL=https://your-backend-domain.com/api
```

### 2. Backend Setup

Clone and run the backend:

```bash
git clone https://github.com/debug-loop/shaf-market-development-backend.git
cd shaf-market-development-backend
npm install
```

Create backend `.env` file with:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `PORT` - Backend port (default: 5000)

Run the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Install dependencies and run:

```bash
npm install
npm run dev
```

## API Integration Status

### ✅ Fully Integrated Endpoints

#### Authentication (`/api/auth`)
- `POST /auth/signup/buyer` - Buyer registration
- `POST /auth/signup/seller` - Seller registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

#### Products (`/api/products`)
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `GET /products/seller` - Get seller's products
- `POST /products` - Create product (seller only)
- `PUT /products/:id` - Update product (seller only)
- `DELETE /products/:id` - Delete product (seller only)
- `GET /categories` - Get all categories

#### Orders (`/api/orders`)
- `POST /orders` - Create order (buyer only)
- `GET /orders/buyer` - Get buyer's orders
- `GET /orders/seller` - Get seller's orders
- `GET /orders/:id` - Get order details
- `POST /orders/:id/deliver` - Mark as delivered (seller only)
- `POST /orders/:id/confirm` - Confirm receipt (buyer only)
- `POST /orders/:id/dispute` - Open dispute (buyer only)

#### Wallet (`/api/wallet`)
- `GET /wallet` - Get wallet info
- `POST /wallet/deposit` - Deposit funds
- `POST /wallet/withdraw` - Withdraw funds
- `GET /wallet/transactions` - Get transaction history

#### Buyer Dashboard (`/api/buyer`)
- `GET /buyer/dashboard` - Get buyer dashboard stats

#### Reviews (`/api/reviews`)
- `POST /reviews` - Create review (buyer only)
- `GET /reviews/product/:productId` - Get product reviews
- `GET /reviews/seller/:sellerId` - Get seller reviews
- `DELETE /reviews/:id` - Delete review

#### Referrals (`/api/referrals`)
- `GET /referrals` - Get referral info
- `POST /referrals/withdraw` - Withdraw referral earnings

#### Notifications (`/api/notifications`)
- `GET /notifications` - Get all notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## Authentication

The frontend uses JWT authentication with automatic token management:

- **Token Storage:** `localStorage.getItem('token')`
- **Auto Injection:** Axios interceptor adds `Authorization: Bearer <token>` header
- **Auto Logout:** 401 responses automatically clear token and redirect to login

## API Client Configuration

**Location:** `src/api/axios.js`

Features:
- Automatic JWT token injection
- 401 unauthorized handling
- Base URL configuration from environment
- Request/response interceptors

## Testing

### Default Admin Credentials (Backend)
⚠️ **Change immediately in production!**
- Email: `admin@shahmarket.com`
- Password: `Admin@123456`

### Health Check
Test backend connectivity:
```bash
curl http://localhost:5000/api/health
```

## Troubleshooting

### CORS Issues
Ensure backend `.env` has:
```env
FRONTEND_URL=http://localhost:3000
```

### 401 Unauthorized
- Check if backend is running
- Verify JWT token in localStorage
- Check token expiration

### Network Errors
- Verify `VITE_API_URL` in frontend `.env`
- Confirm backend is running on correct port
- Check firewall/network settings

## File Structure

```
src/
├── api/
│   ├── axios.js           # Axios configuration & interceptors
│   └── services.js        # All API service methods
├── components/
│   └── dashboard/         # Buyer portal components
├── pages/
│   ├── dashboard/         # Buyer dashboard pages
│   └── ...
└── ...
```

## Next Steps

1. ✅ Environment variables configured
2. ✅ API endpoints integrated
3. ✅ Authentication setup complete
4. 🔄 Start backend server
5. 🔄 Test authentication flow
6. 🔄 Test buyer portal functionality
7. 🔄 Deploy to production

## Support

For backend issues, refer to:
- Backend README: https://github.com/debug-loop/shaf-market-development-backend
- Backend API documentation in backend repository

---

**Integration Status:** ✅ Complete and Ready
**Last Updated:** 2026-01-18
