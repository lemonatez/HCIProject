import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star } from 'lucide-react';

export function AllReviews() {
  const { orders } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<number | null>(null);

  const reviewedOrders = orders.filter(o => o.review);

  const filteredReviews = filter
    ? reviewedOrders.filter(o => o.review?.rating === filter)
    : reviewedOrders;

  const averageRating = reviewedOrders.length > 0
    ? reviewedOrders.reduce((sum, o) => sum + (o.review?.rating || 0), 0) / reviewedOrders.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviewedOrders.filter(o => o.review?.rating === rating).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Reviews</h1>
              <p className="text-sm text-gray-600">{reviewedOrders.length} reviews</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? 'fill-orange-500 text-orange-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviewedOrders.length} reviews</p>
          </div>

          <div className="space-y-2">
            {ratingCounts.map(({ rating, count }) => {
              const percentage = reviewedOrders.length > 0 ? (count / reviewedOrders.length) * 100 : 0;
              return (
                <button
                  key={rating}
                  onClick={() => setFilter(filter === rating ? null : rating)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    filter === rating ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className="font-semibold text-gray-900">{rating}</span>
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </button>
              );
            })}
          </div>

          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-600">
                {filter ? `No ${filter}-star reviews yet` : 'No reviews yet'}
              </p>
            </div>
          ) : (
            filteredReviews.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (order.review?.rating || 0)
                            ? 'fill-orange-500 text-orange-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {order.review?.feedback && (
                  <p className="text-gray-700 mb-3">{order.review.feedback}</p>
                )}

                {order.review?.tags && order.review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
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

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Queue #{order.queueNumber.toString().padStart(3, '0')} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
