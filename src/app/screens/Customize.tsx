import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { OrderItem } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';

const spiceLevels: { value: 'Mild' | 'Medium' | 'Spicy'; emoji: string; label: string }[] = [
  { value: 'Mild', emoji: '😊', label: 'Mild' },
  { value: 'Medium', emoji: '🌶️', label: 'Medium' },
  { value: 'Spicy', emoji: '🔥', label: 'Spicy' },
];

// Step indicator
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

export function Customize() {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItems, addToCart, clearCart } = useApp();

  const selectedItemIds = (location.state?.selectedItemIds || []) as string[];
  const selectedMenuItems = menuItems.filter(item => selectedItemIds.includes(item.id));

  const [customizations, setCustomizations] = useState<Record<string, {
    quantity: number;
    spiceLevel: 'Mild' | 'Medium' | 'Spicy';
    noVegetables: boolean;
    specialRequests: string;
  }>>(
    selectedItemIds.reduce((acc, id) => ({
      ...acc,
      [id]: { quantity: 1, spiceLevel: 'Mild' as const, noVegetables: false, specialRequests: '' }
    }), {})
  );

  const update = (itemId: string, field: string, value: any) => {
    setCustomizations(prev => ({ ...prev, [itemId]: { ...prev[itemId], [field]: value } }));
  };

  const handleOrder = () => {
    clearCart();
    selectedMenuItems.forEach(item => {
      const c = customizations[item.id];
      const orderItem: OrderItem = {
        ...item,
        quantity: c.quantity,
        spiceLevel: c.spiceLevel,
        specialRequests: (c.noVegetables ? 'No vegetables. ' : '') + c.specialRequests
      };
      addToCart(orderItem);
    });
    navigate('/order-summary');
  };

  const totalPrice = selectedMenuItems.reduce((sum, item) => {
    return sum + item.price * (customizations[item.id]?.quantity || 1);
  }, 0);

  if (selectedMenuItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            No items selected
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
            Choose Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <button
            onClick={() => navigate('/new-order')}
            style={{
              width: '36px', height: '36px', borderRadius: '0.75rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)', flexShrink: 0
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Customize Order</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedMenuItems.length} item{selectedMenuItems.length > 1 ? 's' : ''}</p>
          </div>
        </div>
      </header>

      <main style={{ padding: '1.25rem 1rem 9rem' }}>
        <StepBar current={2} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {selectedMenuItems.map(item => {
            const c = customizations[item.id];
            return (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }} className="anim-fade-in-up">

                {/* Item header */}
                <div style={{
                  display: 'flex', gap: '0.875rem', padding: '1rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '72px', height: '72px', borderRadius: '0.75rem', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>{item.description}</p>
                    <span style={{ fontWeight: '800', color: 'var(--brand)', fontSize: '1rem' }}>
                      ฿{(item.price * c.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Quantity */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Quantity
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <button
                        onClick={() => update(item.id, 'quantity', Math.max(1, c.quantity - 1))}
                        style={{
                          width: '40px', height: '40px', borderRadius: '0.75rem',
                          background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--text-primary)'
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{
                        fontSize: '1.375rem', fontWeight: '800',
                        color: 'var(--text-primary)', minWidth: '2rem', textAlign: 'center'
                      }}>
                        {c.quantity}
                      </span>
                      <button
                        onClick={() => update(item.id, 'quantity', c.quantity + 1)}
                        style={{
                          width: '40px', height: '40px', borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'white',
                          boxShadow: '0 2px 8px rgba(249,115,22,0.25)'
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Spice Level */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Spice Level
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {spiceLevels.map(sl => (
                        <button
                          key={sl.value}
                          onClick={() => update(item.id, 'spiceLevel', sl.value)}
                          style={{
                            padding: '0.75rem 0.5rem',
                            borderRadius: '0.875rem',
                            border: c.spiceLevel === sl.value ? '2px solid var(--brand)' : '1.5px solid var(--border-medium)',
                            background: c.spiceLevel === sl.value ? 'rgba(249,115,22,0.08)' : 'var(--bg-elevated)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{sl.emoji}</span>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: '700',
                            color: c.spiceLevel === sl.value ? 'var(--brand)' : 'var(--text-muted)'
                          }}>{sl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* No Vegetables toggle */}
                  <button
                    onClick={() => update(item.id, 'noVegetables', !c.noVegetables)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.875rem 1rem',
                      background: c.noVegetables ? 'rgba(249,115,22,0.06)' : 'var(--bg-elevated)',
                      border: c.noVegetables ? '1.5px solid var(--brand)' : '1.5px solid var(--border-medium)',
                      borderRadius: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🥦</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>No Vegetables</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skip all vegetables in this item</p>
                    </div>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: c.noVegetables ? 'var(--brand)' : 'transparent',
                      border: c.noVegetables ? 'none' : '2px solid var(--border-medium)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {c.noVegetables && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="13" height="13">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Special Requests */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                      Special Requests (optional)
                    </label>
                    <textarea
                      value={c.specialRequests}
                      onChange={e => update(item.id, 'specialRequests', e.target.value)}
                      placeholder="e.g. No oil, extra sauce, less salt..."
                      className="input-field"
                      rows={3}
                      style={{ resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fixed Order Button */}
      <div style={{
        position: 'fixed', bottom: '64px', left: 0, right: 0,
        padding: '0.875rem 1rem',
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
      }}>
        <button
          onClick={handleOrder}
          id="btn-place-order"
          style={{
            width: '100%', padding: '1rem',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white', border: 'none', borderRadius: '1rem',
            fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(249,115,22,0.30)',
            display: 'flex',
            alignItems: 'center', justifyContent: 'space-between'
          }}
        >
          <span>🛍️ Review Order</span>
          <span>฿{totalPrice.toLocaleString()}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
