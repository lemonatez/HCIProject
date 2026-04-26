import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CreditCard, Wallet, QrCode, Tag, Award, Trash2, Check } from 'lucide-react';

export function Payment() {
  const { cart, user, createOrder, removeFromCart } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showQRDemo, setShowQRDemo] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let discount = 0;
  if (appliedCoupon === 'SAVE10') {
    discount = subtotal * 0.1;
  } else if (appliedCoupon === 'GOLD20') {
    discount = subtotal * 0.2;
  } else if (appliedCoupon === 'PLATINUM30') {
    discount = subtotal * 0.3;
  }

  const total = subtotal - discount;
  const tierColor = user?.membershipTier === 'PLATINUM' ? 'var(--platinum)' :
                    user?.membershipTier === 'GOLD' ? 'var(--gold)' : 'var(--silver)';

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon(code);
    } else if (code === 'GOLD20' && (user?.membershipTier === 'GOLD' || user?.membershipTier === 'PLATINUM')) {
      setAppliedCoupon(code);
    } else if (code === 'PLATINUM30' && user?.membershipTier === 'PLATINUM') {
      setAppliedCoupon(code);
    } else {
      setCouponError('Invalid coupon code or not eligible for your membership tier.');
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'qr') {
      setShowQRDemo(true);
      return;
    }
    const order = createOrder(paymentMethod, appliedCoupon);
    navigate('/profile', { state: { newOrderId: order.id } });
  };

  const confirmQRPayment = () => {
    setShowQRDemo(false);
    const order = createOrder('qr', appliedCoupon);
    navigate('/profile', { state: { newOrderId: order.id } });
  };

  if (cart.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Your cart is empty
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
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '2rem' }}>

      {/* QR Demo Modal */}
      {showQRDemo && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '1.5rem',
            width: '100%', maxWidth: '340px', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)', animation: 'fadeInUp 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              padding: '1.5rem', textAlign: 'center', color: 'white'
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', opacity: 0.9, marginBottom: '0.25rem' }}>QR Payment Demo</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>฿{total.toLocaleString()}</p>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              {/* Fake QR code visual */}
              <div style={{
                width: '160px', height: '160px', margin: '0 auto 1rem',
                display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '2px', position: 'relative'
              }}>
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} style={{
                    backgroundColor: Math.random() > 0.5 ? '#1a1107' : 'transparent',
                    borderRadius: '1px'
                  }} />
                ))}
                {/* QR corner markers */}
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '3px solid #1a1107', borderRadius: '4px',
                  pointerEvents: 'none'
                }} />
              </div>
              {/* Scan line animation */}
              <div style={{
                width: '160px', height: '2px', background: 'var(--brand)',
                margin: '-165px auto 145px', opacity: 0.8,
                animation: 'qr-scan 2s ease-in-out infinite'
              }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Scan with your banking app to pay
              </p>
              <button
                onClick={confirmQRPayment}
                id="btn-confirm-qr"
                style={{
                  width: '100%', padding: '1rem',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white', border: 'none', borderRadius: '0.875rem',
                  fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer',
                  marginBottom: '0.75rem', boxShadow: '0 4px 16px rgba(22,163,74,0.25)'
                }}
              >
                ✓ Confirm Payment (Demo)
              </button>
              <button
                onClick={() => setShowQRDemo(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-subtle)', padding: '1rem',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', maxWidth: '640px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/order-summary')}
            style={{
              width: '36px', height: '36px', borderRadius: '0.75rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Payment</h1>
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Order Summary Card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Order Summary</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                display: 'flex', gap: '0.875rem', padding: '0.875rem 1rem',
                borderBottom: index < cart.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                alignItems: 'center'
              }}>
                <img src={item.image} alt={item.name}
                  style={{ width: '56px', height: '56px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity}{item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontWeight: '700', color: 'var(--brand)', fontSize: '0.9375rem' }}>
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: 'rgba(220,38,38,0.08)', border: 'none',
                      borderRadius: '0.5rem', padding: '0.375rem', cursor: 'pointer',
                      display: 'flex', color: '#dc2626'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Card */}
        {user && user.role === 'customer' && (
          <div style={{
            borderRadius: '1.25rem', overflow: 'hidden',
            background: `linear-gradient(135deg, ${tierColor}22, ${tierColor}11)`,
            border: `1.5px solid ${tierColor}40`,
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: `${tierColor}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Award size={22} color={tierColor} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{user.username}</p>
              <p style={{ fontSize: '1rem', fontWeight: '800', color: tierColor }}>
                {user.membershipTier} Member
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Points</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '900', color: tierColor }}>{user.rewardPoints}</p>
            </div>
          </div>
        )}

        {/* Coupon Code */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>Coupon Code</h2>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Tag size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value); setCouponError(''); }}
                placeholder="Enter coupon code"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                id="input-coupon"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              style={{
                padding: '0 1.25rem',
                background: 'var(--bg-elevated)', border: '1.5px solid var(--border-medium)',
                borderRadius: '0.875rem', fontWeight: '700', fontSize: '0.875rem',
                color: 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
              id="btn-apply-coupon"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.5rem' }}>{couponError}</p>
          )}

          {appliedCoupon && (
            <div style={{
              marginTop: '0.75rem', padding: '0.75rem 1rem',
              background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.20)',
              borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Check size={16} color="#16a34a" />
              <p style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: '600' }}>
                Coupon <strong>{appliedCoupon}</strong> applied! Saving ฿{discount.toLocaleString()}
              </p>
            </div>
          )}

          <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Available coupons:</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• <code style={{ background: 'var(--bg-elevated)', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>SAVE10</code> — 10% off for everyone</p>
            {(user?.membershipTier === 'GOLD' || user?.membershipTier === 'PLATINUM') && (
              <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: '600' }}>• <code style={{ background: 'rgba(217,119,6,0.10)', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>GOLD20</code> — 20% off (Your exclusive coupon!)</p>
            )}
            {user?.membershipTier === 'PLATINUM' && (
              <p style={{ fontSize: '0.8rem', color: 'var(--platinum)', fontWeight: '600' }}>• <code style={{ background: 'rgba(124,58,237,0.10)', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>PLATINUM30</code> — 30% off (Your exclusive coupon!)</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>Payment Method</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {([
              { id: 'cash', icon: Wallet, label: 'Cash' },
              { id: 'card', icon: CreditCard, label: 'Card' },
              { id: 'qr', icon: QrCode, label: 'QR Pay' },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                id={`payment-${id}`}
                style={{
                  padding: '1rem 0.5rem',
                  borderRadius: '1rem',
                  border: paymentMethod === id ? '2px solid var(--brand)' : '1.5px solid var(--border-medium)',
                  background: paymentMethod === id ? 'rgba(249,115,22,0.06)' : 'var(--bg-elevated)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Icon size={22} color={paymentMethod === id ? 'var(--brand)' : 'var(--text-muted)'} />
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === id ? 'var(--brand)' : 'var(--text-secondary)' }}>{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary & Pay */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.9rem', fontWeight: '600' }}>
                <span>Discount ({appliedCoupon})</span>
                <span>-฿{discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ paddingTop: '0.75rem', borderTop: '1.5px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--brand)' }}>฿{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            id="btn-confirm-payment"
            style={{
              width: '100%', padding: '1.125rem',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white', border: 'none', borderRadius: '1.125rem',
              fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(249,115,22,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            {paymentMethod === 'qr' ? '📱' : paymentMethod === 'card' ? '💳' : '💵'}
            {paymentMethod === 'qr' ? 'Pay with QR' : paymentMethod === 'card' ? 'Pay with Card' : 'Pay with Cash'}
          </button>
        </div>
      </main>
    </div>
  );
}
