import React, { useRef } from 'react';
import { X, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export default function MobileDrawer({ isOpen, onClose, onOpenAuth, onNavigate }) {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  useBodyScrollLock(isOpen, {
    containerRef,
    backdropRef,
    onClose,
  });

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Home', path: '/', tag: 'Main' },
    { label: 'Shop', path: '/shop', tag: 'Handmade' },
    { label: 'Artisans', path: '/#meet-makers', anchor: 'meet-makers', tag: 'Artisans' },
    { label: 'Community', path: '/#community-section', anchor: 'community-section', tag: 'Community' },
    { label: 'Stories', path: '/#story-banner', anchor: 'story-banner', tag: 'Craft' }
  ];

  const handleItemClick = (e, item) => {
    e.preventDefault();
    onClose();
    if (item.path === '/shop') {
      onNavigate && onNavigate('/shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.path === '/') {
      onNavigate && onNavigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.anchor) {
      onNavigate && onNavigate('/');
      setTimeout(() => {
        const el = document.getElementById(item.anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="mobile-drawer-backdrop"
      onClick={onClose}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        className="mobile-drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <span className="brand-logo-text">Craftinator</span>
          <button className="mobile-drawer-close" onClick={onClose} aria-label="Close navigation">
            <X size={22} />
          </button>
        </div>

        {/* Brand Tagline Strip */}
        <div className="mobile-drawer-tagline">
          <span>Artisans</span> • <span>Community</span> • <span>Connections</span>
        </div>

        {/* Language Selector in Mobile Drawer */}
        <div style={{ padding: '0.75rem 0' }}>
          <LanguageSelector isMobile={true} />
        </div>

        {/* Menu Links */}
        <nav className="mobile-drawer-nav">
          <ul>
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.path}
                  className="mobile-drawer-link"
                  onClick={(e) => handleItemClick(e, item)}
                >
                  <span className="mobile-link-text">{item.label}</span>
                  {item.tag && <span className="mobile-link-tag">{item.tag}</span>}
                  <ChevronRight size={16} className="mobile-link-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="mobile-drawer-auth">
          <button
            className="btn btn-secondary mobile-auth-btn"
            onClick={() => {
              onClose();
              onOpenAuth('login');
            }}
          >
            <LogIn size={18} />
            {t('login')}
          </button>
          <button
            className="btn btn-primary mobile-auth-btn"
            onClick={() => {
              onClose();
              onOpenAuth('signup');
            }}
          >
            <UserPlus size={18} />
            {t('signup')}
          </button>
        </div>

      </div>
    </div>
  );
}
