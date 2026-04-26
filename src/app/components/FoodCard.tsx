import React from 'react';
import { MenuItem } from '../context/AppContext';
import { Plus, Info } from 'lucide-react';
import { Button } from './Button';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: () => void;
  onShowDetails: () => void;
}

export function FoodCard({ item, onAddToCart, onShowDetails }: FoodCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
          <div className="flex gap-2">
            <button
              onClick={onShowDetails}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Show details"
            >
              <Info className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onAddToCart}
              className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors"
              aria-label="Add to cart"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
