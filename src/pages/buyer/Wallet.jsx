import { useState, useEffect } from 'react';
import { walletService } from '../../api/services';
import SEO from '../../components/SEO';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositData, setDepositData] = useState({ amount: '', paymentMethod: 'bank' });
  const [withdrawData, setWithdrawData] = useState({ amount: '', paymentMethod: 'bank', paymentDetails: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, transRes] = await Promise.all([
        walletService.getWallet(),
        walletService.getTransactions()
      ]);
      setWallet(walletRes.data.data.wallet);
      setTransactions(transRes.data.data.transactions);
    } catch (err) {
      console.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await walletService.deposit(depositData);
      alert('Deposit successful!');
      setShowDeposit(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await walletService.withdraw(withdrawData);
      alert('Withdrawal request submitted!');
      setShowWithdraw(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Wallet" />
      <div>
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-green-600">${wallet?.availableBalance?.toFixed(2) || '0.00'}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Escrow Balance</div>
            <div className="text-3xl font-bold text-blue-600">${wallet?.escrowBalance?.toFixed(2) || '0.00'}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-2">Total Earnings</div>
            <div className="text-3xl font-bold text-purple-600">${wallet?.totalEarnings?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setShowDeposit(true)} className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
            Deposit Money
          </button>
          <button onClick={() => setShowWithdraw(true)} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            Withdraw Money
          </button>
        </div>

        {showDeposit && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Deposit Money</h2>
            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label className="block mb-2">Amount ($)</label>
                <input type="number" required min="1" step="0.01" value={depositData.amount} 
                  onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Method</label>
                <select value={depositData.paymentMethod} onChange={(e) => setDepositData({ ...depositData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded">
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Confirm Deposit</button>
            </form>
          </div>
        )}

        {showWithdraw && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Withdraw Money</h2>
            <form onSubmit={handleWithdraw}>
              <div className="mb-4">
                <label className="block mb-2">Amount ($)</label>
                <input type="number" required min="10" step="0.01" value={withdrawData.amount}
                  onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Method</label>
                <select value={withdrawData.paymentMethod} onChange={(e) => setWithdrawData({ ...withdrawData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded">
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Details</label>
                <textarea required rows={3} value={withdrawData.paymentDetails}
                  onChange={(e) => setWithdrawData({ ...withdrawData, paymentDetails: e.target.value })}
                  className="w-full px-3 py-2 border rounded" placeholder="Enter your account details" />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Request Withdrawal</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Transaction History</h2>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions yet</div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx._id} className="flex justify-between items-center p-3 border-b">
                    <div>
                      <div className="font-medium">{tx.type.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-500">{tx.description}</div>
                      <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</div>
                    </div>
                    <div className={`font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount >= 0 ? '+' : ''} ${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
