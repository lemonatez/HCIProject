import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export function AdminOrderDetail() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useApp();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    updateOrderStatus(order.id, 'completed');
    navigate('/admin');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(order.id, 'cancelled');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600">
                Queue #{order.queueNumber.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                #{order.queueNumber.toString().padStart(3, '0')}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Order Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900 capitalize">
                {order.paymentMethod || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
              <p className="font-semibold text-gray-900">
                {order.estimatedTime ? `${order.estimatedTime} minutes` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} · Spice: {item.spiceLevel}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Add-ons: {item.addons.join(', ')}
                    </p>
                  )}
                  {item.specialRequests && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <span className="font-semibold">Special Request:</span> {item.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${(order.total + (order.discount || 0)).toFixed(2)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({order.couponCode})</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-orange-500">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {order.review && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Customer Review</h3>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= order.review!.rating ? 'text-orange-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {order.review.feedback && (
              <p className="text-gray-700 mb-3">{order.review.feedback}</p>
            )}
            {order.review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {order.review.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <div className="flex gap-4">
            <Button onClick={handleComplete} size="lg" className="flex-1">
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Order
            </Button>
            <Button onClick={handleCancel} variant="danger" size="lg" className="flex-1">
              <XCircle className="w-5 h-5 mr-2" />
              Cancel Order
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
