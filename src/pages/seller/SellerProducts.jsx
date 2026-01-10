import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/services';
import SEO from '../../components/SEO';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getSellerProducts();
        setProducts(res.data.data.products);
      } catch (err) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;

    try {
      await productService.delete(id);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted');
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="My Products" />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Link to="/seller/products/add" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No products yet</p>
            <Link to="/seller/products/add" className="text-primary hover:underline mt-2 inline-block">Create your first product</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow">
                <img src={product.images[0] || '/placeholder.png'} alt={product.productName} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{product.productName}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(product.status)}`}>{product.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 text-sm">
                      Delete
                    </button>
                  </div>
                  {product.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded">
                      {product.rejectionReason}
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
