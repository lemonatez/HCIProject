import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { User, Home } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  return (
    <div className="bottom-nav">
      {/* Profile — Bottom Left */}
      <button
        onClick={() => navigate('/profile')}
        className={`bottom-nav-btn ${isProfile ? 'active' : ''}`}
        aria-label="Profile"
        id="bottom-nav-profile"
      >
        <User size={22} />
        <span>Profile</span>
      </button>

      {/* Home — Bottom Right */}
      <button
        onClick={() => navigate('/')}
        className={`bottom-nav-btn ${isHome ? 'active' : ''}`}
        aria-label="Home"
        id="bottom-nav-home"
      >
        <Home size={22} />
        <span>Home</span>
      </button>
    </div>
  );
}
