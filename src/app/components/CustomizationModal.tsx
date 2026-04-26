import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { MenuItem, OrderItem } from '../context/AppContext';
import { Button } from './Button';

interface CustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (customizedItem: OrderItem) => void;
}

export function CustomizationModal({ item, onClose, onConfirm }: CustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Mild');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const addons = [
    { id: 'extra-cheese', name: 'Extra Cheese', price: 1.50 },
    { id: 'bacon', name: 'Bacon', price: 2.00 },
    { id: 'avocado', name: 'Avocado', price: 1.75 },
    { id: 'jalapeños', name: 'Jalapeños', price: 0.75 }
  ];

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleConfirm = () => {
    const customizedItem: OrderItem = {
      ...item,
      quantity,
      spiceLevel,
      addons: selectedAddons,
      specialRequests: specialRequests || undefined
    };
    onConfirm(customizedItem);
    onClose();
  };

  const totalPrice = item.price * quantity +
    selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Customize Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-lg font-bold text-orange-500 mt-2">${item.price.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
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
                  onClick={() => setSpiceLevel(level)}
                  className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                    spiceLevel === level
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
            <label className="block font-semibold text-gray-900 mb-3">Add-ons</label>
            <div className="space-y-2">
              {addons.map(addon => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="w-5 h-5 rounded accent-orange-500"
                    />
                    <span className="font-medium text-gray-900">{addon.name}</span>
                  </div>
                  <span className="text-gray-600">+${addon.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-3">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special instructions?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-orange-500">${totalPrice.toFixed(2)}</span>
          </div>
          <Button onClick={handleConfirm} fullWidth size="lg">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
