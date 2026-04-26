import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import { ArrowLeft, TrendingUp, CreditCard, Wallet, QrCode } from 'lucide-react';

export function AdminAnalytics() {
  const { orders, transactions } = useApp();
  const navigate = useNavigate();

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const paymentMethods = {
    cash: transactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.amount, 0),
    card: transactions.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.amount, 0),
    qr: transactions.filter(t => t.paymentMethod === 'qr').reduce((sum, t) => sum + t.amount, 0)
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Income</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-green-100">Total Revenue</p>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
            <p className="text-green-100 text-sm mt-2">{transactions.length} transactions</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-blue-100">Completed Orders</p>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">{completedOrders}</p>
            <p className="text-blue-100 text-sm mt-2">out of {orders.length} total</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-purple-100">Avg Order Value</p>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">${avgOrderValue.toFixed(2)}</p>
            <p className="text-purple-100 text-sm mt-2">per completed order</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue by Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Cash</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${paymentMethods.cash.toFixed(2)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Card</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${paymentMethods.card.toFixed(2)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <QrCode className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">QR Pay</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${paymentMethods.qr.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Method</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {transaction.id.slice(0, 12)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 capitalize">
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        ${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}
