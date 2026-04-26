import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { OrderStepper } from '../components/OrderStepper';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { OrderItem } from '../context/AppContext';

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
      [id]: {
        quantity: 1,
        spiceLevel: 'Mild' as const,
        noVegetables: false,
        specialRequests: ''
      }
    }), {})
  );

  const updateCustomization = (itemId: string, field: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleOrder = () => {
    clearCart();
    selectedMenuItems.forEach(item => {
      const custom = customizations[item.id];
      const orderItem: OrderItem = {
        ...item,
        quantity: custom.quantity,
        spiceLevel: custom.spiceLevel,
        specialRequests: (custom.noVegetables ? 'No vegetables. ' : '') + custom.specialRequests
      };
      addToCart(orderItem);
    });
    navigate('/order-summary');
  };

  if (selectedMenuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No items selected</h2>
          <Button onClick={() => navigate('/new-order')}>Select Items</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/new-order')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Customize Order</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <OrderStepper currentStep={2} steps={['Select', 'Customize', 'Payment']} />

        <div className="space-y-6">
          {selectedMenuItems.map(item => {
            const custom = customizations[item.id];
            return (
              <div key={item.id} className="bg-white rounded-2xl p-6">
                <div className="flex gap-4 mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-3">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateCustomization(item.id, 'quantity', Math.max(1, custom.quantity - 1))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{custom.quantity}</span>
                      <button
                        onClick={() => updateCustomization(item.id, 'quantity', custom.quantity + 1)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-3">Spice Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Mild', 'Medium', 'Spicy'] as const).map(level => (
                        <button
                          key={level}
                          onClick={() => updateCustomization(item.id, 'spiceLevel', level)}
                          className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                            custom.spiceLevel === level
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={custom.noVegetables}
                        onChange={(e) => updateCustomization(item.id, 'noVegetables', e.target.checked)}
                        className="w-5 h-5 rounded accent-orange-500"
                      />
                      <span className="font-medium text-gray-900">No Vegetables</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-3">Special Requests</label>
                    <textarea
                      value={custom.specialRequests}
                      onChange={(e) => updateCustomization(item.id, 'specialRequests', e.target.value)}
                      placeholder="Any special instructions? (e.g., extra sauce, less salt)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <Button onClick={handleOrder} fullWidth size="lg">
            Order Now
          </Button>
        </div>
      </main>
    </div>
  );
}
