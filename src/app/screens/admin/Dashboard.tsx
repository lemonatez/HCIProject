import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import { LogOut, DollarSign, Menu as MenuIcon, ChevronRight, Star, Store } from 'lucide-react';

export function AdminDashboard() {
  const { orders, updateOrderStatus, logout, user } = useApp();
  const navigate = useNavigate();

  const activeOrders = orders.filter(o =>
    o.status === 'pending' || o.status === 'cooking' || o.status === 'ready'
  );

  const reviewedOrders = orders.filter(o => o.review);
  const averageRating = reviewedOrders.length > 0
    ? reviewedOrders.reduce((sum, o) => sum + (o.review?.rating || 0), 0) / reviewedOrders.length
    : 0;

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'cooking');
    } else if (currentStatus === 'cooking') {
      updateOrderStatus(orderId, 'ready');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">The Order Restaurant</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="ml-1 font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">({reviewedOrders.length} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/admin/analytics')}
                variant="secondary"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Analytics
              </Button>
              <Button
                onClick={() => navigate('/admin/menu')}
                variant="secondary"
              >
                <MenuIcon className="w-5 h-5 mr-2" />
                Menu
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl font-semibold bg-orange-500 text-white"
            >
              Orders
            </button>
            <button
              onClick={() => navigate('/admin/menu')}
              className="px-4 py-2 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Menu
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="px-4 py-2 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Income
            </button>
            <button
              onClick={() => navigate('/reviews')}
              className="px-4 py-2 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Reviews
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Active Orders</p>
            <p className="text-3xl font-bold text-gray-900">{activeOrders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders Today</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Revenue Today</p>
            <p className="text-3xl font-bold text-green-600">
              ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Orders</h2>

          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No active orders at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          #{order.queueNumber.toString().padStart(3, '0')}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-xl font-bold text-orange-500">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.quantity}x {item.name}
                          {item.specialRequests && (
                            <span className="text-orange-600 ml-2">
                              (Note: {item.specialRequests})
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {order.status !== 'ready' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                        size="sm"
                      >
                        {order.status === 'pending' && 'Start Cooking'}
                        {order.status === 'cooking' && 'Mark as Ready'}
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      variant="secondary"
                      size="sm"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}
