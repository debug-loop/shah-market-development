import { useState, useEffect } from 'react';
import { sellerService } from '../../api/services';
import SEO from '../../components/SEO';

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await sellerService.getDashboard();
        setData(res.data.data.stats);
      } catch (err) {
        console.error('Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Seller Dashboard" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Products</div>
            <div className="text-3xl font-bold">{data?.totalProducts || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Active Products</div>
            <div className="text-3xl font-bold text-green-600">{data?.activeProducts || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Pending Orders</div>
            <div className="text-3xl font-bold text-yellow-600">{data?.pendingOrders || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Completed Orders</div>
            <div className="text-3xl font-bold">{data?.completedOrders || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Earnings</div>
            <div className="text-3xl font-bold text-purple-600">${data?.totalEarnings?.toFixed(2) || '0.00'}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-green-600">${data?.availableBalance?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      </div>
    </>
  );
}
