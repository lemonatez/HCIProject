import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

function StepBar({ current }: { current: number }) {
  const steps = ['Choose', 'Customize', 'Summary'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '1.5rem', gap: 0 }}>
      {steps.map((label, idx) => {
        const num = idx + 1;
        const isActive = num === current;
        const isDone = num < current;
        return (
          <React.Fragment key={num}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: '0 0 auto' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8125rem', fontWeight: '700',
                background: isActive || isDone ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--bg-elevated)',
                color: isActive || isDone ? 'white' : 'var(--text-muted)',
                border: isActive || isDone ? 'none' : '2px solid var(--border-medium)',
                boxShadow: isActive ? '0 0 0 4px rgba(249,115,22,0.15)' : 'none'
              }}>
                {isDone ? '✓' : num}
              </div>
              <span style={{
                fontSize: '0.675rem', fontWeight: '600',
                color: isActive ? 'var(--brand)' : 'var(--text-muted)',
                letterSpacing: '0.02em', whiteSpace: 'nowrap'
              }}>{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{
                flex: 1, height: '2px', marginTop: '17px', minWidth: '24px',
                background: isDone ? 'var(--brand)' : 'var(--border-medium)'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function OrderSummary() {
  const { cart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
            onClick={() => navigate('/new-order')}
            style={{
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white', border: 'none', borderRadius: '1rem',
              fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer'
            }}
          >
            Start Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-subtle)', padding: '1rem',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <button
            onClick={() => navigate('/customize')}
            style={{
              width: '36px', height: '36px', borderRadius: '0.75rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Order Summary</h1>
        </div>
      </header>

      <main style={{ padding: '1.25rem 1rem 9rem', maxWidth: '600px', margin: '0 auto' }}>
        <StepBar current={3} />

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ padding: '1rem 1rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', paddingBottom: '0.875rem' }}>
              Items Ordered
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                display: 'flex', gap: '0.875rem', padding: '0.875rem 1rem',
                borderBottom: index < cart.length - 1 ? '1px solid var(--border-subtle)' : 'none'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{item.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        x{item.quantity}
                        {item.spiceLevel && ` · ${item.spiceLevel === 'Mild' ? '😊' : item.spiceLevel === 'Medium' ? '🌶️' : '🔥'} ${item.spiceLevel}`}
                      </p>
                      {item.specialRequests && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--brand)', marginTop: '0.25rem' }}>
                          📝 {item.specialRequests}
                        </p>
                      )}
                    </div>
                    <span style={{ fontWeight: '800', color: 'var(--brand)', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(249,115,22,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Subtotal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand)' }}>
                ฿{subtotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Info notes */}
        <div style={{
          padding: '0.875rem 1rem',
          background: 'rgba(37,99,235,0.06)',
          border: '1px solid rgba(37,99,235,0.15)',
          borderRadius: '0.875rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: '#1d4ed8',
          lineHeight: '1.6'
        }}>
          💡 You can apply coupon codes in the payment step
        </div>

        <button
          onClick={() => navigate('/payment')}
          id="btn-to-payment"
          style={{
            width: '100%', padding: '1.125rem',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white', border: 'none', borderRadius: '1.125rem',
            fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(249,115,22,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <span>💳</span> Proceed to Payment
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
