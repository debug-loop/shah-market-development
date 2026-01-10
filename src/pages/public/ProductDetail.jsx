import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, orderService, reviewService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productService.getById(id),
          reviewService.getProductReviews(id)
        ]);
        setProduct(productRes.data.data.product);
        setReviews(reviewsRes.data.data.reviews);
      } catch (err) {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      await orderService.create({ productId: id, quantity });
      alert('Order created successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <>
      <SEO title={product.productName} description={product.description} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.images[0] || '/placeholder.png'} alt={product.productName} className="w-full rounded-lg shadow-lg" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-yellow-500">
                ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </div>
              <div className="text-gray-500">
                Sold: {product.soldCount}
              </div>
            </div>

            <div className="text-4xl font-bold text-primary mb-6">${product.price}</div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Delivery: {product.deliveryType}</p>
              {product.replacementAvailable && (
                <p className="text-sm text-gray-600">Replacement: {product.replacementDuration} days</p>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.inventoryType === 'limited' ? product.quantity : 100}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing || !product.isActive}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {purchasing ? 'Processing...' : 'Purchase Now'}
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-yellow-500">{'⭐'.repeat(review.rating)}</div>
                    <span className="font-medium">{review.buyerId?.fullName}</span>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
