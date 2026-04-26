import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { CustomizationModal } from '../components/CustomizationModal';
import { MenuFilter, FilterOptions } from '../components/MenuFilter';
import { Button } from '../components/Button';
import { MenuItem, OrderItem } from '../context/AppContext';
import { ShoppingCart, ArrowLeft, Filter, User, Home as HomeIcon } from 'lucide-react';

export function Menu() {
  const { menuItems, cart, addToCart, user } = useApp();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    spicy: false,
    veggie: false,
    allergies: { diary: false, seafood: false, peanut: false },
    other: ''
  });
  const navigate = useNavigate();

  const handleQuickAdd = (item: MenuItem) => {
    const orderItem: OrderItem = {
      ...item,
      quantity: 1,
      spiceLevel: 'Mild'
    };
    addToCart(orderItem);
  };

  const handleCustomAdd = (customizedItem: OrderItem) => {
    addToCart(customizedItem);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
                {user && <p className="text-sm text-gray-600">Welcome, {user.username}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowFilter(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Filter menu"
              >
                <Filter className="w-5 h-5" />
              </button>
              {cart.length > 0 && (
                <Button onClick={() => navigate('/payment')}>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="hidden sm:inline">{cartItemCount} items · </span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={() => handleQuickAdd(item)}
              onShowDetails={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </main>

      {selectedItem && (
        <CustomizationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleCustomAdd}
        />
      )}

      <MenuFilter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button onClick={() => navigate('/payment')} fullWidth size="lg">
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount} items
              </span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <User className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-gray-600">Profile</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <HomeIcon className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
