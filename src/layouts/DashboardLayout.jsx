import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const buyerLinks = [
    { to: '/buyer/dashboard', label: 'Dashboard' },
    { to: '/buyer/orders', label: 'My Orders' },
    { to: '/buyer/wallet', label: 'Wallet' },
    { to: '/buyer/referrals', label: 'Referrals' },
  ];

  const sellerLinks = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products', label: 'Products' },
    { to: '/seller/orders', label: 'Orders' },
    { to: '/seller/earnings', label: 'Earnings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/sellers', label: 'Sellers' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/disputes', label: 'Disputes' },
    { to: '/admin/withdrawals', label: 'Withdrawals' },
    { to: '/admin/settings', label: 'Settings' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'seller' ? sellerLinks : buyerLinks;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">
            {role === 'admin' ? 'Admin' : role === 'seller' ? 'Seller' : 'Buyer'} Panel
          </h2>
        </div>
        <nav className="mt-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </aside> */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
