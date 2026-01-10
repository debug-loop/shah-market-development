import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function SignupChoice() {
  return (
    <>
      <SEO title="Sign Up" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Join Shah Marketplace</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/signup/buyer" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-5xl mb-4 text-center">🛒</div>
              <h3 className="text-2xl font-bold text-center mb-4">I'm a Buyer</h3>
              <p className="text-gray-600 text-center">Browse and purchase digital services</p>
            </Link>

            <Link to="/signup/seller" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-5xl mb-4 text-center">💼</div>
              <h3 className="text-2xl font-bold text-center mb-4">I'm a Seller</h3>
              <p className="text-gray-600 text-center">Offer your services and earn money</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
