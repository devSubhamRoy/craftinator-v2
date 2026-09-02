import React, { useEffect } from 'react';
import { X, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function MobileDrawer({ isOpen, onClose, onOpenAuth }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: t('nav_explore'), href: '#', tag: 'Main' },
    { label: t('nav_trending'), href: '#trending-products', tag: 'Handmade' },
    { label: t('nav_makers'), href: '#meet-makers', tag: 'Artisans' },
    { label: t('nav_community'), href: '#community-section', tag: 'Community' },
    { label: t('nav_story'), href: '#story-banner', tag: 'Craft' },
    { label: t('wishlist'), href: '#trending-products' },
    { label: t('seller_cta'), href: '#seller-cta', isHighlight: true }
  ];

  return (
    <div
      className="mobile-drawer-backdrop"
      onClick={onClose}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
        
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
                  href={item.href}
                  className={`mobile-drawer-link ${item.isHighlight ? 'highlight' : ''}`}
                  onClick={onClose}
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
