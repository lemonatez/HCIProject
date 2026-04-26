import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, ArrowLeft, Lock, User } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (login(username, password)) {
      if (username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleForgotPassword = () => {
    alert('A password reset link will be sent to your email. (Demo only)');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% -20%, rgba(249,115,22,0.10) 0%, transparent 60%), var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '1.25rem', left: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600'
        }}
        id="btn-back-home"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }} className="anim-fade-in-up">

        {/* Header */}
        <div style={{
          background: 'linear-gradient(160deg, #fff7ed 0%, #fafaf8 100%)',
          padding: '2rem 2rem 1.5rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '1.125rem',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            boxShadow: '0 6px 24px rgba(249,115,22,0.30)',
            marginBottom: '1rem', fontSize: '1.625rem'
          }}>
            🍽️
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>THE</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: '900',
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              lineHeight: '1', letterSpacing: '-0.02em'
            }}>ORDER</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.625rem' }}>
            {showSignUp ? 'Create a new account' : 'Sign in for exclusive member benefits'}
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '1.75rem 2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  id="input-username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  required
                  id="input-password"
                  autoComplete={showSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0, display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--error-bg)',
                border: '1px solid rgba(220,38,38,0.20)',
                borderRadius: '0.75rem',
                fontSize: '0.8125rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            {/* Forgot password */}
            {!showSignUp && (
              <div style={{ textAlign: 'right', marginTop: '-0.25rem' }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--brand)', fontSize: '0.8125rem', fontWeight: '600'
                  }}
                  id="btn-forgot-password"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="btn-submit-login"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                border: 'none',
                borderRadius: '0.875rem',
                fontSize: '0.9375rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(249,115,22,0.30)',
                transition: 'all 0.2s ease',
                marginTop: '0.25rem'
              }}
            >
              {showSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle sign in / sign up */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {showSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => { setShowSignUp(!showSignUp); setError(''); }}
              id="btn-toggle-signup"
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: '0.875rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {showSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Continue as guest */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              id="btn-guest"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500',
                textDecoration: 'underline', textDecorationStyle: 'dotted'
              }}
            >
              Continue as guest →
            </button>
          </div>

          {/* Demo hint */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            background: 'rgba(249,115,22,0.06)',
            border: '1px solid rgba(249,115,22,0.15)',
            borderRadius: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo credentials:</strong>{' '}
            Use <code style={{ color: 'var(--brand)' }}>admin / admin</code> for Admin panel<br />
            Or any username like <code style={{ color: 'var(--gold)' }}>golduser</code> / <code style={{ color: 'var(--platinum)' }}>platuser</code> for member tiers
          </div>
        </div>
      </div>

      {/* Bottom home nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '64px',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: '0 1rem 0.25rem',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
            padding: '0.5rem 1.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', borderRadius: '0.75rem', minWidth: '64px'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Home</span>
        </button>
      </div>
    </div>
  );
}
