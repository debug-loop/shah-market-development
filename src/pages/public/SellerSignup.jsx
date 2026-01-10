import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, categoryService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

export default function SellerSignup() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', telegram: '', country: '', referralCode: '',
    sellerType: 'Personal', selectedCategories: [], dailySupplyQuantity: '',
    yearsOfExperience: '', workDescription: '', portfolioLinks: ['']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data.data.categories);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryName) => {
    const current = [...formData.selectedCategories];
    const index = current.indexOf(categoryName);
    if (index > -1) {
      current.splice(index, 1);
    } else if (current.length < 10) {
      current.push(categoryName);
    }
    setFormData({ ...formData, selectedCategories: current });
  };

  const handlePortfolioChange = (index, value) => {
    const links = [...formData.portfolioLinks];
    links[index] = value;
    setFormData({ ...formData, portfolioLinks: links });
  };

  const addPortfolioLink = () => {
    if (formData.portfolioLinks.length < 5) {
      setFormData({ ...formData, portfolioLinks: [...formData.portfolioLinks, ''] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        portfolioLinks: formData.portfolioLinks.filter(link => link.trim() !== '')
      };
      const response = await authService.signupSeller(submitData);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Seller Signup" />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-center mb-6">Become a Seller</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700">Telegram *</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Seller Type *</label>
                <select required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.sellerType} onChange={(e) => setFormData({ ...formData, sellerType: e.target.value })}>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Daily Supply Quantity *</label>
                <input type="number" required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.dailySupplyQuantity} onChange={(e) => setFormData({ ...formData, dailySupplyQuantity: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience *</label>
                <input type="number" required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.yearsOfExperience} onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Categories * (up to 10)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={formData.selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)} disabled={formData.selectedCategories.length >= 10 && !formData.selectedCategories.includes(cat.name)} />
                    <span>{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Work Description * (min 50 characters)</label>
              <textarea required minLength={50} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.workDescription} onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Links (optional)</label>
              {formData.portfolioLinks.map((link, index) => (
                <input key={index} type="url" placeholder="https://example.com" className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={link} onChange={(e) => handlePortfolioChange(index, e.target.value)} />
              ))}
              {formData.portfolioLinks.length < 5 && (
                <button type="button" onClick={addPortfolioLink} className="mt-2 text-primary hover:underline">+ Add Another Link</button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Code (optional)</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Submitting Application...' : 'Submit Seller Application'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
