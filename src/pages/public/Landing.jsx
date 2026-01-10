import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function Landing() {
  return (
    <>
      <SEO title="Home" description="Digital services marketplace" />
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Shah Marketplace</h1>
          <p className="text-xl mb-8">Your trusted platform for digital services</p>
          <div className="space-x-4">
            <Link to="/browse" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Browse Services
            </Link>
            <Link to="/signup/seller" className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600">
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Escrow</h3>
            <p className="text-gray-600">Your money is protected until you confirm delivery</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Verified Sellers</h3>
            <p className="text-gray-600">All sellers are manually approved</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
            <p className="text-gray-600">Get commission through our referral program</p>
          </div>
        </div>
      </div>
    </>
  );
}
