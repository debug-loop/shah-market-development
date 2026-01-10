import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Shah Marketplace
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/browse" className="text-gray-700 hover:text-primary">Browse</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === 'buyer' && (
                  <Link to="/buyer/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
                )}
                {user.role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
                )}
                {(user.role === 'admin' || user.role === 'super-admin') && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary">Admin</Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center text-gray-700 hover:text-primary"
                  >
                    <span>{user.fullName}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link to="/wallet" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Wallet
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
