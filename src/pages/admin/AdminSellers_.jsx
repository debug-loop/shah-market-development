import { useState, useEffect } from 'react';
import { adminService } from '../../api/services';
import SEO from '../../components/SEO';

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await adminService.getPendingSellers();
      setSellers(res.data.data.sellers);
    } catch (err) {
      console.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    if (!confirm('Approve this seller?')) return;

    try {
      await adminService.approveSeller(sellerId);
      alert('Seller approved!');
      fetchSellers();
    } catch (err) {
      alert('Failed to approve seller');
    }
  };

  const handleReject = async (sellerId) => {
    if (!rejectionReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    try {
      await adminService.rejectSeller(sellerId, { rejectionReason });
      alert('Seller rejected');
      setSelectedSeller(null);
      setRejectionReason('');
      fetchSellers();
    } catch (err) {
      alert('Failed to reject seller');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Pending Sellers" />
      <div>
        <h1 className="text-3xl font-bold mb-6">Pending Seller Applications</h1>

        {sellers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No pending seller applications</div>
        ) : (
          <div className="space-y-6">
            {sellers.map((seller) => (
              <div key={seller._id} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium">{seller.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{seller.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Seller Type</p>
                    <p className="font-medium">{seller.sellerType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Experience</p>
                    <p className="font-medium">{seller.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Daily Supply</p>
                    <p className="font-medium">{seller.dailySupplyQuantity} units</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Categories</p>
                    <p className="font-medium">{seller.selectedCategories?.join(', ')}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-1">Work Description</p>
                  <p className="text-sm">{seller.workDescription}</p>
                </div>

                {seller.portfolioLinks?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-1">Portfolio Links</p>
                    {seller.portfolioLinks.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm block hover:underline">
                        {link}
                      </a>
                    ))}
                  </div>
                )}

                {selectedSeller === seller._id ? (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                    <textarea rows={3} className="w-full px-3 py-2 border rounded mb-2"
                      value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(seller._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Confirm Rejection
                      </button>
                      <button onClick={() => setSelectedSeller(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(seller._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Approve
                    </button>
                    <button onClick={() => setSelectedSeller(seller._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
