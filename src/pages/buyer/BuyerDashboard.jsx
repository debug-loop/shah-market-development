import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buyerService } from '../../api/services';
import SEO from '../../components/SEO';

export default function BuyerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await buyerService.getDashboard();
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Buyer Dashboard" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Orders</div>
            <div className="text-3xl font-bold">{data?.stats?.totalOrders || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Active Orders</div>
            <div className="text-3xl font-bold">{data?.stats?.activeOrders || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Wallet Balance</div>
            <div className="text-3xl font-bold text-green-600">${data?.stats?.balance?.toFixed(2) || '0.00'}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">In Escrow</div>
            <div className="text-3xl font-bold text-blue-600">${data?.stats?.escrow?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="p-6">
            {data?.recentOrders?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No orders yet</p>
                <Link to="/browse" className="text-primary hover:underline mt-2 inline-block">Browse Products</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.recentOrders?.map((order) => (
                  <Link
                    key={order._id}
                    to={`/buyer/orders/${order._id}`}
                    className="block p-4 border rounded hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{order.productId?.productName}</div>
                        <div className="text-sm text-gray-500">{order.orderId}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${order.totalAmount}</div>
                        <div className="text-sm text-gray-500">{order.status}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
