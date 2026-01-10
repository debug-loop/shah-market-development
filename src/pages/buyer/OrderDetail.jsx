import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, reviewService } from '../../api/services';
import SEO from '../../components/SEO';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getById(id);
        setOrder(res.data.data.order);
      } catch (err) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleConfirmReceipt = async () => {
    if (!confirm('Confirm receipt? This will release payment to seller.')) return;

    try {
      await orderService.confirmReceipt(id);
      alert('Order completed! Payment released to seller.');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create({ orderId: id, ...reviewData });
      alert('Review submitted successfully!');
      setShowReview(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleOpenDispute = async (e) => {
    e.preventDefault();
    try {
      await orderService.openDispute(id, { reason: disputeReason });
      alert('Dispute opened. Admin will review your case.');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to open dispute');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <>
      <SEO title={`Order ${order.orderId}`} />
      <div>
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-bold">{order.orderId}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-bold capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Product</p>
              <p className="font-bold">{order.productId?.productName}</p>
            </div>
            <div>
              <p className="text-gray-500">Seller</p>
              <p className="font-bold">{order.sellerId?.fullName}</p>
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-bold">{order.quantity}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-bold text-lg text-primary">${order.totalAmount}</p>
            </div>
          </div>

          {order.deliveryData && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-500 mb-2">Delivery Data:</p>
              <p className="font-mono text-sm">{order.deliveryData}</p>
            </div>
          )}

          <div className="flex gap-4">
            {order.status === 'delivered' && (
              <>
                <button onClick={handleConfirmReceipt} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                  Confirm Receipt
                </button>
                <button onClick={() => setShowDispute(true)} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
                  Open Dispute
                </button>
              </>
            )}
            {order.status === 'completed' && (
              <button onClick={() => setShowReview(true)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Leave Review
              </button>
            )}
          </div>
        </div>

        {showReview && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <select value={reviewData.rating} onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Comment</label>
                <textarea rows={4} value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-3 py-2 border rounded" />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">Submit Review</button>
            </form>
          </div>
        )}

        {showDispute && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Open Dispute</h2>
            <form onSubmit={handleOpenDispute}>
              <div className="mb-4">
                <label className="block mb-2">Reason for Dispute</label>
                <textarea required rows={4} value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded" minLength={10} />
              </div>
              <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">Submit Dispute</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
