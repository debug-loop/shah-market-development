import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '../../components/SEO';

export default function BuyerSignup() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', telegram: '', country: '', referralCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.signupBuyer(formData);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
      <SEO title="Buyer Signup" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-center mb-6">Buyer Signup</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input type="password" required minLength={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telegram (optional)</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Code (optional)</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
