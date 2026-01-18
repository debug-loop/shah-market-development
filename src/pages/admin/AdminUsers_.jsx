import { useState, useEffect } from 'react';
import { adminService } from '../../api/services';
import SEO from '../../components/SEO';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', status: '' });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers(filter);
      setUsers(res.data.data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async (userId) => {
    if (!confirm('Freeze this user account?')) return;

    try {
      await adminService.freezeUser(userId);
      fetchUsers();
    } catch (err) {
      alert('Failed to freeze user');
    }
  };

  const handleUnfreeze = async (userId) => {
    try {
      await adminService.unfreezeUser(userId);
      fetchUsers();
    } catch (err) {
      alert('Failed to unfreeze user');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Manage Users" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        <div className="mb-6 flex gap-4">
          <select value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            className="px-4 py-2 border rounded">
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>

          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border rounded">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.accountStatus === 'active' ? (
                      <button onClick={() => handleFreeze(user._id)} className="text-red-600 hover:text-red-800">Freeze</button>
                    ) : (
                      <button onClick={() => handleUnfreeze(user._id)} className="text-green-600 hover:text-green-800">Unfreeze</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
