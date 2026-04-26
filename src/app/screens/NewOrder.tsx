import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { MenuItem } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';

const allergyLabels: Record<string, { emoji: string; label: string; cls: string }> = {
  dairy:   { emoji: '🥛', label: 'Dairy', cls: 'allergy-dairy' },
  seafood: { emoji: '🦞', label: 'Seafood', cls: 'allergy-seafood' },
  peanut:  { emoji: '🥜', label: 'Peanut', cls: 'allergy-peanut' },
  gluten:  { emoji: '🌾', label: 'Gluten', cls: 'allergy-gluten' },
  egg:     { emoji: '🥚', label: 'Egg', cls: 'allergy-egg' },
};

function AllergyBadges({ allergies }: { allergies?: string[] }) {
  if (!allergies || allergies.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.4rem' }}>
      {allergies.map(a => {
        const info = allergyLabels[a];
        if (!info) return null;
        return (
          <span key={a} className={`allergy-badge ${info.cls}`}>
            {info.emoji} {info.label}
          </span>
        );
      })}
    </div>
  );
}

function MenuItemCard({ item, isSelected, onToggle }: {
  item: MenuItem; isSelected: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      id={`menu-item-${item.id}`}
      style={{
        width: '100%', textAlign: 'left',
        border: isSelected ? '2px solid var(--brand)' : '1.5px solid var(--border-subtle)',
        borderRadius: '1rem',
        background: isSelected ? 'rgba(249,115,22,0.06)' : 'var(--bg-card)',
        padding: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 2px 12px rgba(249,115,22,0.15)' : 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', gap: '0.875rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '80px', height: '80px',
              borderRadius: '0.75rem',
              objectFit: 'cover',
              border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border-subtle)'
            }}
            loading="lazy"
          />
          {item.bestSeller && (
            <span style={{
              position: 'absolute', top: '-6px', left: '-6px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '0.375rem',
              fontSize: '0.6rem', fontWeight: '700',
              color: 'white', padding: '0.15rem 0.35rem',
              letterSpacing: '0.04em', boxShadow: '0 2px 6px rgba(245,158,11,0.40)'
            }}>
              🔥 Best Seller
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontWeight: '700', fontSize: '0.9375rem',
                color: 'var(--text-primary)',
                marginBottom: '0.2rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{item.name}</h3>
              <p style={{
                fontSize: '0.8rem', color: 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{item.description}</p>
              <AllergyBadges allergies={item.allergies} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              <span style={{
                fontWeight: '800', fontSize: '0.9375rem',
                color: 'var(--brand)',
                whiteSpace: 'nowrap'
              }}>฿{item.price}</span>
              <div style={{
                width: '24px', height: '24px',
                borderRadius: '6px',
                border: isSelected ? 'none' : '2px solid var(--border-medium)',
                background: isSelected ? 'var(--brand)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}>
                {isSelected && <Check size={14} color="white" strokeWidth={3} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

const CATEGORIES = ['All', 'Pizza', 'Appetizer', 'Main', 'Asian', 'Seafood', 'Salad', 'Dessert', 'Beverage'];

export function NewOrder() {
  const { menuItems } = useApp();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleNext = () => {
    if (selectedItems.size === 0) return;
    navigate('/customize', { state: { selectedItemIds: Array.from(selectedItems) } });
  };

  const bestSellers = menuItems.filter(i => i.bestSeller);
  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory);

  const otherItems = activeCategory === 'All'
    ? menuItems.filter(i => !i.bestSeller)
    : filtered;

  const showBestSellers = activeCategory === 'All';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 1rem 0.875rem',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '0.75rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              cursor: 'pointer', color: 'var(--text-primary)', flexShrink: 0
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Choose Items
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tap to select{selectedItems.size > 0 ? ` · ${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''} selected` : ''}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', gap: '0.5rem',
          overflowX: 'auto', paddingBottom: '0.25rem',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '0.375rem 0.875rem',
                borderRadius: '2rem',
                border: activeCategory === cat ? '1.5px solid var(--brand)' : '1.5px solid var(--border-medium)',
                background: activeCategory === cat ? 'rgba(249,115,22,0.08)' : 'var(--bg-card)',
                color: activeCategory === cat ? 'var(--brand)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: activeCategory === cat ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main style={{ padding: '1rem 1rem 9rem' }}>

        {/* Allergy Warning */}
        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          padding: '0.875rem 1rem',
          background: 'rgba(217,119,6,0.07)',
          border: '1px solid rgba(217,119,6,0.20)',
          borderRadius: '0.875rem',
          marginBottom: '1.25rem'
        }}>
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <p style={{ fontWeight: '700', fontSize: '0.875rem', color: '#d97706', marginBottom: '0.25rem' }}>
              ⚠️ Allergy Warning
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Some items may contain allergens: 🥛Dairy · 🦞Seafood · 🥜Peanut · 🌾Gluten · 🥚Egg.
              Please note any allergies in the customization step.
            </p>
          </div>
        </div>

        {/* Best Sellers */}
        {showBestSellers && bestSellers.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '1.125rem' }}>🔥</span>
              <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Best Sellers
              </h2>
              <div style={{
                flex: 1, height: '1px',
                background: 'linear-gradient(90deg, rgba(217,119,6,0.3), transparent)'
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }} className="stagger">
              {bestSellers.map(item => (
                <div key={item.id} className="anim-fade-in-up">
                  <MenuItemCard
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All / Filtered items */}
        {(!showBestSellers || otherItems.length > 0) && (
          <div>
            {showBestSellers && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  All Items
                </h2>
                <div style={{
                  flex: 1, height: '1px', background: 'var(--border-subtle)'
                }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {(showBestSellers ? otherItems : filtered).map(item => (
                <div key={item.id} className="anim-fade-in-up">
                  <MenuItemCard
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fixed Next Button */}
      <div style={{
        position: 'fixed', bottom: '64px', left: 0, right: 0,
        padding: '0.875rem 1rem',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
      }}>
        <button
          onClick={handleNext}
          disabled={selectedItems.size === 0}
          id="btn-next-customize"
          style={{
            width: '100%',
            padding: '1rem',
            background: selectedItems.size === 0
              ? 'var(--bg-elevated)'
              : 'linear-gradient(135deg, #f97316, #ea580c)',
            color: selectedItems.size === 0 ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: selectedItems.size === 0 ? 'not-allowed' : 'pointer',
            boxShadow: selectedItems.size === 0 ? 'none' : '0 4px 20px rgba(249,115,22,0.30)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          {selectedItems.size === 0
            ? 'Select at least 1 item'
            : `Next · ${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''} selected →`}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
