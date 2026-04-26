import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Award, Clock, LogOut } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { BottomNav } from '../components/BottomNav';

export function Profile() {
  const { user, orders, logout, guestOrderIds } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const newOrderId = (location.state as any)?.newOrderId;

  // Get user orders or guest orders
  const userOrders = user
    ? orders.filter(o => o.customerId === user.id)
    : orders.filter(o => guestOrderIds.includes(o.id));

  const tierProgress = user ? ((user.rewardPoints || 0) / 1000) * 100 : 0;
  const tierColor = user?.membershipTier === 'PLATINUM' ? 'var(--platinum)' :
                    user?.membershipTier === 'GOLD' ? 'var(--gold)' : 'var(--silver)';

  useEffect(() => {
    if (newOrderId) {
      window.scrollTo(0, 0);
    }
  }, [newOrderId]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '80px' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-subtle)', padding: '1rem',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '36px', height: '36px', borderRadius: '0.75rem',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-primary)'
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {user ? 'My Profile' : 'My Orders'}
            </h1>
          </div>
          {user && (
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                borderRadius: '0.75rem', cursor: 'pointer',
                color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: '600'
              }}
              id="btn-logout"
            >
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Membership / Login Card */}
        {user && user.role === 'customer' ? (
          <div style={{
            borderRadius: '1.5rem', overflow: 'hidden',
            background: `linear-gradient(135deg, ${tierColor}18, ${tierColor}08)`,
            border: `1.5px solid ${tierColor}30`,
            padding: '1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: `${tierColor}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Award size={28} color={tierColor} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Member</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{user.username}</h2>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.875rem', color: tierColor }}>
                  {user.membershipTier} TIER
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {user.rewardPoints} / 1000 pts
                </span>
              </div>
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.08)', borderRadius: '9999px', height: '10px' }}>
                <div style={{
                  width: `${tierProgress}%`, background: tierColor,
                  borderRadius: '9999px', height: '10px', transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Membership coupon chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                background: 'rgba(0,0,0,0.06)', border: '1.5px dashed rgba(0,0,0,0.15)',
                fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-secondary)'
              }}>
                🎟️ SAVE10 (10% off)
              </div>
              {(user.membershipTier === 'GOLD' || user.membershipTier === 'PLATINUM') && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                  background: 'rgba(217,119,6,0.10)', border: '1.5px dashed rgba(217,119,6,0.40)',
                  fontSize: '0.8125rem', fontWeight: '700', color: 'var(--gold)'
                }}>
                  🌟 GOLD20 (20% off)
                </div>
              )}
              {user.membershipTier === 'PLATINUM' && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                  background: 'rgba(124,58,237,0.10)', border: '1.5px dashed rgba(124,58,237,0.40)',
                  fontSize: '0.8125rem', fontWeight: '700', color: 'var(--platinum)'
                }}>
                  💎 PLATINUM30 (30% off)
                </div>
              )}
            </div>
          </div>
        ) : !user ? (
          <div style={{
            borderRadius: '1.5rem', padding: '2rem', textAlign: 'center',
            background: 'rgba(249,115,22,0.05)', border: '1.5px solid rgba(249,115,22,0.15)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Award size={48} color="var(--brand)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Members Get More
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              Login to access membership benefits, exclusive coupons, and order history
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white', border: 'none', borderRadius: '1rem',
                fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(249,115,22,0.25)'
              }}
              id="btn-login-now"
            >
              Login Now
            </button>
          </div>
        ) : null}

        {/* Orders section */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {user ? 'My Orders' : 'Recent Orders (Guest)'}
          </h2>

          {userOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No orders yet</p>
              <button
                onClick={() => navigate('/new-order')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--bg-elevated)', border: '1.5px solid var(--border-medium)',
                  borderRadius: '0.875rem', fontWeight: '600', color: 'var(--text-primary)',
                  cursor: 'pointer', fontSize: '0.875rem'
                }}
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {userOrders.slice(-5).reverse().map(order => {
                const isNewOrder = order.id === newOrderId;
                return (
                  <div
                    key={order.id}
                    style={{
                      border: isNewOrder ? '2px solid var(--brand)' : '1.5px solid var(--border-subtle)',
                      borderRadius: '1rem', padding: '1rem',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      background: isNewOrder ? 'rgba(249,115,22,0.04)' : 'var(--bg-card)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onClick={() => navigate(`/queue/${order.id}`)}
                  >
                    {isNewOrder && (
                      <div style={{
                        marginBottom: '0.75rem', padding: '0.5rem 0.75rem',
                        background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.20)',
                        borderRadius: '0.625rem'
                      }}>
                        <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>✓ Payment Successful!</p>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.125rem' }}>
                          Queue #{order.queueNumber.toString().padStart(3, '0')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <StatusBadge status={order.status} />
                        {order.status === 'cooking' && order.estimatedTime && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <Clock size={12} /> ~{order.estimatedTime} min
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--brand)' }}>
                        ฿{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
