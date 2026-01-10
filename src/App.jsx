import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import SignupChoice from './pages/public/SignupChoice';
import BuyerSignup from './pages/public/BuyerSignup';
import SellerSignup from './pages/public/SellerSignup';
import Browse from './pages/public/Browse';
import ProductDetail from './pages/public/ProductDetail';
import NotFound from './pages/public/NotFound';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerOrders from './pages/buyer/BuyerOrders';
import OrderDetail from './pages/buyer/OrderDetail';
import Wallet from './pages/buyer/Wallet';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddProduct from './pages/seller/AddProduct';
import SellerOrders from './pages/seller/SellerOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-choice" element={<SignupChoice />} />
          <Route path="/signup/buyer" element={<BuyerSignup />} />
          <Route path="/signup/seller" element={<SellerSignup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Buyer Routes */}
          <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><DashboardLayout role="buyer" /></ProtectedRoute>}>
            <Route path="dashboard" element={<BuyerDashboard />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>

          {/* Seller Routes */}
          <Route path="/seller" element={<ProtectedRoute roles={['seller']}><DashboardLayout role="seller" /></ProtectedRoute>}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute><DashboardLayout role="admin" /></AdminProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
