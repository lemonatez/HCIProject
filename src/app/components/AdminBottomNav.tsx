import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ClipboardList, UtensilsCrossed, DollarSign } from 'lucide-react';

export function AdminBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: ClipboardList, label: 'Orders', path: '/admin' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/admin/menu' },
    { icon: DollarSign, label: 'Income', path: '/admin/analytics' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
