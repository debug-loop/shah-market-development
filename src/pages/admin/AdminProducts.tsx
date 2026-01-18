
import { useState, useEffect } from 'react';
import { adminService } from '../../api/services';
import SEO from '../../components/SEO';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminService.getPendingProducts();
      setProducts(res.data.data.products);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    if (!confirm('Approve this product?')) return;

    try {
      await adminService.approveProduct(productId);
      alert('Product approved!');
      fetchProducts();
    } catch (err) {
      alert('Failed to approve product');
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    try {
      await adminService.rejectProduct(productId, { rejectionReason });
      alert('Product rejected');
      setSelectedProduct(null);
      setRejectionReason('');
      fetchProducts();
    } catch (err) {
      alert('Failed to reject product');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Pending Products" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Pending Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No pending products</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow">
                <img src={product.images[0] || '/placeholder.png'} alt={product.productName} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div><span className="text-gray-500">Price:</span> ${product.price}</div>
                    <div><span className="text-gray-500">Category:</span> {product.categoryId?.name}</div>
                    <div><span className="text-gray-500">Seller:</span> {product.sellerId?.fullName}</div>
                    <div><span className="text-gray-500">Delivery:</span> {product.deliveryType}</div>
                  </div>

                  {selectedProduct === product._id ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                      <textarea rows={2} className="w-full px-3 py-2 border rounded mb-2 text-sm"
                        value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                      <div className="flex gap-2">
                        <button onClick={() => handleReject(product._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                          Confirm Rejection
                        </button>
                        <button onClick={() => setSelectedProduct(null)} className="bg-gray-300 px-3 py-1 rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(product._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                        Approve
                      </button>
                      <button onClick={() => setSelectedProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
