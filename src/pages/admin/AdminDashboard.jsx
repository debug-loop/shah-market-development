import { useState, useEffect } from 'react';
import { adminService } from '../../api/services';
import SEO from '../../components/SEO';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data.data.stats);
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
      <SEO title="Admin Dashboard" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
            <div className="text-sm text-gray-500 mt-2">
              Buyers: {stats?.totalBuyers || 0} | Sellers: {stats?.totalSellers || 0}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Pending Sellers</div>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pendingSellers || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Products</div>
            <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
            <div className="text-sm text-gray-500 mt-2">Pending: {stats?.pendingProducts || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Orders</div>
            <div className="text-3xl font-bold">{stats?.totalOrders || 0}</div>
            <div className="text-sm text-gray-500 mt-2">Completed: {stats?.completedOrders || 0}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <div className="text-gray-500 text-sm mb-2">Platform Revenue</div>
            <div className="text-3xl font-bold text-green-600">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      </div>
    </>
  );
}
