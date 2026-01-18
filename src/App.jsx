import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { SellerLayout } from './layouts/SellerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Public Pages
import Index from "./pages/Index";
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import SignupChoice from './pages/public/SignupChoice';
import BuyerSignup from './pages/public/BuyerSignup';
import SellerSignup from './pages/public/SellerSignup';
import Browse from "./pages/Browse";
import ProductDetail from './pages/public/ProductDetail';
import NotFound from './pages/public/NotFound';

// Marketplace Pages
import Marketplace from './pages/marketplace/Marketplace';
import SectionView from './pages/marketplace/SectionView';
import ProductListing from './pages/marketplace/ProductListing';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerOrders from './pages/buyer/BuyerOrders';
import OrderDetail from './pages/buyer/OrderDetail';
import Wallet from './pages/buyer/Wallet';
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilePage from "./pages/dashboard/ProfilePage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import WalletPage from "./pages/dashboard/WalletPage";
import ReferralPage from "./pages/dashboard/ReferralPage";
import SecurityPage from "./pages/dashboard/SecurityPage";
import SupportPage from "./pages/dashboard/SupportPage";

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from "./pages/seller/AddProduct";
import MyProducts from "./pages/seller/MyProducts";
import Orders from "./pages/seller/Orders";
import Earnings from "./pages/seller/Earnings";
import Messages from "./pages/seller/Messages";
import Profile from "./pages/seller/Profile";
import Support from "./pages/seller/Support";

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
          <Route path="/" element={<Index />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-choice" element={<SignupChoice />} />
          <Route path="/signup/buyer" element={<BuyerSignup />} />
          <Route path="/signup/seller" element={<SellerSignup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:sectionSlug" element={<SectionView />} />
          <Route path="/marketplace/:sectionSlug/:categorySlug" element={<ProductListing />} />

          {/* Buyer Routes */}
          <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><DashboardLayout role="buyer" /></ProtectedRoute>}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="referral" element={<ReferralPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="support" element={<SupportPage />} />
            {/* <Route path="orders" element={<BuyerOrders />} /> */}
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>

          {/* Seller Routes */}
          <Route path="/seller" element={<ProtectedRoute roles={['seller']}><SellerLayout role="seller" /></ProtectedRoute>}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products/approved" element={<MyProducts />} />
            <Route path="products/pending" element={<MyProducts />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
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
