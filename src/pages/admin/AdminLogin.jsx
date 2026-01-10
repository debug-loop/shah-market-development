import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminService.login(formData);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
