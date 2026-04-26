import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Home as HomeIcon, User } from 'lucide-react';

export function Home() {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate('/new-order');
  };

  const handleMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>
              THE
            </h1>
            <h2 className="text-6xl font-bold text-gray-900" style={{ fontFamily: 'serif', textDecoration: 'underline', textDecorationThickness: '4px', textUnderlineOffset: '12px' }}>
              ORDER
            </h2>
          </div>

          <div className="space-y-4">
            <Button onClick={handleNewOrder} fullWidth size="lg">
              New Order
            </Button>
            <Button onClick={handleMenu} variant="secondary" fullWidth size="lg">
              Menu
            </Button>
          </div>

          {user && (
            <p className="mt-6 text-gray-600">
              Welcome back, <span className="font-semibold">{user.username}</span>
            </p>
          )}
        </div>
      </main>

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
