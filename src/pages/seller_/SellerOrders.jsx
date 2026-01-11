import { useState, useEffect } from 'react';
import { orderService } from '../../api/services';
import SEO from '../../components/SEO';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryData, setDeliveryData] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getSellerOrders();
        setOrders(res.data.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    if (!deliveryData.trim()) {
      alert('Please enter delivery data');
      return;
    }

    try {
      await orderService.markAsDelivered(orderId, { deliveryData });
      alert('Order marked as delivered!');
      setSelectedOrder(null);
      setDeliveryData('');
      const res = await orderService.getSellerOrders();
      setOrders(res.data.data.orders);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deliver order');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Seller Orders" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders yet</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.productId?.productName}</h3>
                    <p className="text-sm text-gray-500">{order.orderId}</p>
                    <p className="text-sm text-gray-500">Buyer: {order.buyerId?.fullName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{order.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <span className="ml-2 font-medium">{order.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-medium">${order.totalAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Your Earnings:</span>
                    <span className="ml-2 font-medium text-green-600">${order.sellerEarnings}</span>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <>
                    {selectedOrder === order._id ? (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Delivery Data</label>
                        <textarea rows={3} className="w-full px-3 py-2 border rounded mb-2"
                          value={deliveryData} onChange={(e) => setDeliveryData(e.target.value)}
                          placeholder="Enter delivery information (login credentials, download link, etc.)" />
                        <div className="flex gap-2">
                          <button onClick={() => handleDeliver(order._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Confirm Delivery
                          </button>
                          <button onClick={() => setSelectedOrder(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedOrder(order._id)} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                        Mark as Delivered
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
