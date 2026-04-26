import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      const redirect = searchParams.get('redirect');
      if (username === 'admin') {
        navigate('/admin');
      } else if (redirect) {
        navigate(redirect);
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (login(username, password)) {
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email. (Demo only)');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'serif' }}>
              THE
            </h1>
            <h2 className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'serif', textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '8px' }}>
              ORDER
            </h2>
          </div>
          <p className="text-gray-600">Sign in to order delicious food</p>
        </div>

        <form onSubmit={showSignUp ? handleSignUp : handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              required
            />
          </div>

          {username === 'admin' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button type="submit" fullWidth size="lg">
            {showSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          {!showSignUp && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Forgot Password?
            </button>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            {showSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <Button
            onClick={() => setShowSignUp(!showSignUp)}
            variant="secondary"
            fullWidth
          >
            {showSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-center text-sm text-gray-600">
            Demo: Use <span className="font-semibold">admin/admin</span> for admin or any username/password for customer
          </p>
        </div>
      </div>
    </div>
  );
}
