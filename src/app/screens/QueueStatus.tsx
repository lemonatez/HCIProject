import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Clock, CheckCircle, ChefHat, Star } from 'lucide-react';

export function QueueStatus() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useApp();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (!order) return;

    const timer1 = setTimeout(() => {
      if (order.status === 'pending') {
        updateOrderStatus(order.id, 'cooking');
      }
    }, 3000);

    const timer2 = setTimeout(() => {
      if (order.status === 'cooking' || order.status === 'pending') {
        updateOrderStatus(order.id, 'ready');
      }
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order?.id, order?.status]);

  if (!order) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Order not found
          </h2>
          <button
            onClick={() => navigate('/menu')}
            style={{
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white', border: 'none', borderRadius: '1rem',
              fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer'
            }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, label: 'Waiting', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
    cooking: { icon: ChefHat, label: 'Cooking', color: '#ea580c', bg: 'rgba(249,115,22,0.08)' },
    ready: { icon: CheckCircle, label: 'Ready!', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
    completed: { icon: CheckCircle, label: 'Completed', color: '#475569', bg: 'rgba(100,116,139,0.08)' },
    cancelled: { icon: Clock, label: 'Cancelled', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  };

  const cfg = statusConfig[order.status];
  const Icon = cfg.icon;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: '1.5rem',
        width: '100%', maxWidth: '420px',
        overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Status banner */}
        <div style={{
          background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`,
          padding: '2rem 1.5rem', textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '1.25rem',
            background: cfg.bg, border: `2px solid ${cfg.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Icon size={36} color={cfg.color} />
          </div>
          <h1 style={{
            fontSize: '4.5rem', fontWeight: '900', color: 'var(--text-primary)',
            letterSpacing: '-0.02em', lineHeight: '1', marginBottom: '0.75rem'
          }}>
            #{order.queueNumber.toString().padStart(3, '0')}
          </h1>
          <StatusBadge status={order.status} />
        </div>

        {/* Status details */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Estimated time */}
          {order.estimatedTime && order.status !== 'ready' && order.status !== 'completed' && (
            <div style={{
              padding: '0.875rem 1rem', background: 'var(--bg-elevated)',
              borderRadius: '0.875rem', textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated wait time</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>
                {order.estimatedTime} minutes
              </p>
            </div>
          )}

          {/* Auto-update notice */}
          {(order.status === 'pending' || order.status === 'cooking') && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)',
              borderRadius: '0.75rem', fontSize: '0.8rem', color: '#1d4ed8', textAlign: 'center'
            }}>
              🔄 Status updates automatically (demo: 3s → cooking, 8s → ready)
            </div>
          )}

          {/* Ready notice */}
          {order.status === 'ready' && (
            <div style={{
              padding: '1rem',
              background: 'rgba(22,163,74,0.08)', border: '1.5px solid rgba(22,163,74,0.25)',
              borderRadius: '0.875rem', textAlign: 'center'
            }}>
              <p style={{ fontWeight: '700', color: '#16a34a', fontSize: '1rem' }}>
                🎉 Your order is ready for pickup!
              </p>
              <p style={{ fontSize: 0.8 + 'rem', color: '#15803d', marginTop: '0.25rem' }}>
                Please collect at the counter
              </p>
            </div>
          )}

          {/* Order items */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '0.875rem', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Order Items</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderBottom: index < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity}{item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                    </p>
                  </div>
                  <p style={{ fontWeight: '700', color: 'var(--brand)', fontSize: '0.875rem' }}>
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div style={{
              padding: '0.875rem 1rem', borderTop: '1.5px solid var(--border-medium)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '900', color: 'var(--brand)' }}>
                ฿{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {order.status === 'ready' && !order.review && (
              <button
                onClick={() => navigate(`/review/${order.id}`)}
                id="btn-leave-review"
                style={{
                  width: '100%', padding: '1rem',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: 'white', border: 'none', borderRadius: '1rem',
                  fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(249,115,22,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <Star size={16} /> Leave a Review
              </button>
            )}
            <button
              onClick={() => navigate('/new-order')}
              style={{
                width: '100%', padding: '0.875rem',
                background: 'var(--bg-elevated)', border: '1.5px solid var(--border-medium)',
                borderRadius: '1rem', fontSize: '0.9375rem', fontWeight: '600',
                color: 'var(--text-primary)', cursor: 'pointer'
              }}
              id="btn-order-more"
            >
              Order More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
