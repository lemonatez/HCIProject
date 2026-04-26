import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';

export function Home() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 0%, rgba(249,115,22,0.10) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(249,115,22,0.07) 0%, transparent 50%), var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient circles */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '320px', height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '100px', left: '-60px',
        width: '240px', height: '240px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main content — centered */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem 6rem',
      }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '360px' }} className="anim-fade-in-up">

          {/* Brand Logo */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px', height: '72px',
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 8px 32px rgba(249,115,22,0.30)',
              marginBottom: '1.5rem',
              fontSize: '2rem'
            }}>
              🍽️
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '3.5rem',
              fontWeight: '900',
              color: 'var(--text-primary)',
              lineHeight: '1',
              marginBottom: '0.25rem',
              letterSpacing: '-0.02em'
            }}>
              THE
            </h1>

            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '4.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1',
                letterSpacing: '-0.02em',
              }}>
                ORDER
              </h2>
              {/* Underline glow */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '0',
                right: '0',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
                borderRadius: '2px',
              }} />
            </div>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              marginTop: '1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '500'
            }}>
              Order food easily & quickly
            </p>
          </div>

          {/* Welcome back */}
          {user && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.18)',
              borderRadius: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.1rem' }}>👋</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Welcome back, <strong style={{ color: 'var(--brand)' }}>{user.username}</strong>
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <button
              id="btn-new-order"
              onClick={() => navigate('/new-order')}
              style={{
                width: '100%',
                padding: '1.125rem 1.5rem',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                border: 'none',
                borderRadius: '1.125rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(249,115,22,0.30)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(249,115,22,0.40)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(249,115,22,0.30)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🛒</span>
              New Order
            </button>

            <button
              id="btn-menu"
              onClick={() => navigate('/menu')}
              style={{
                width: '100%',
                padding: '1.125rem 1.5rem',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: '1.125rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                letterSpacing: '0.02em',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(249,115,22,0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>📋</span>
              Browse Menu
            </button>
          </div>

          {/* Info tag */}
          <p style={{
            marginTop: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}>
            {user ? '' : 'Order as guest — no login required ·'} <button
              onClick={() => navigate('/login')}
              style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', padding: 0 }}
            >
              {user ? '' : 'Login for exclusive benefits'}
            </button>
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
