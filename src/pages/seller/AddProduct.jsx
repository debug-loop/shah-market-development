import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../../api/services';
import SEO from '../../components/SEO';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productName: '', description: '', categoryId: '', price: '',
    inventoryType: 'unlimited', quantity: '', deliveryType: 'instant',
    customDeliveryTime: '', replacementAvailable: false, replacementDuration: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await productService.create(formDataToSend);
      alert('Product created and submitted for approval!');
      navigate('/seller/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Add Product" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" required className="w-full px-3 py-2 border rounded"
                value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required className="w-full px-3 py-2 border rounded"
                value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" required min="0.01" step="0.01" className="w-full px-3 py-2 border rounded"
                value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Type *</label>
              <select className="w-full px-3 py-2 border rounded"
                value={formData.inventoryType} onChange={(e) => setFormData({ ...formData, inventoryType: e.target.value })}>
                <option value="unlimited">Unlimited</option>
                <option value="limited">Limited</option>
              </select>
            </div>

            {formData.inventoryType === 'limited' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="number" required min="1" className="w-full px-3 py-2 border rounded"
                  value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time *</label>
              <select className="w-full px-3 py-2 border rounded"
                value={formData.deliveryType} onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}>
                <option value="instant">Instant</option>
                <option value="1-6h">1-6 hours</option>
                <option value="12h">12 hours</option>
                <option value="24h">24 hours</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description * (min 20 characters)</label>
            <textarea required minLength={20} rows={4} className="w-full px-3 py-2 border rounded"
              value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (max 5)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
            {images.length > 0 && <p className="text-sm text-gray-500 mt-1">{images.length} image(s) selected</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="replacement" checked={formData.replacementAvailable}
              onChange={(e) => setFormData({ ...formData, replacementAvailable: e.target.checked })} />
            <label htmlFor="replacement" className="ml-2 text-sm">Offer replacement guarantee</label>
          </div>

          {formData.replacementAvailable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Duration (days)</label>
              <input type="number" min="1" className="w-full px-3 py-2 border rounded"
                value={formData.replacementDuration} onChange={(e) => setFormData({ ...formData, replacementDuration: e.target.value })} />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </>
  );
}
