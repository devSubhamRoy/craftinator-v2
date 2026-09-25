import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Heart, 
  Users, 
  User, 
  Settings as SettingsIcon, 
  ChevronDown, 
  Package, 
  LogIn, 
  UserPlus, 
  LogOut 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  onOpenAuth, 
  onNavigate,
  authUser,
  onLogout,
  currentPath = '/',
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist
}) {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  useBodyScrollLock(isOpen, {
    containerRef,
    backdropRef,
    onClose,
  });

  // Single active accordion section (for Shop categories/sub-items)
  const [activeAccordion, setActiveAccordion] = useState(() => {
    if (currentPath.startsWith('/shop') || currentPath === '/cart') return 'shop';
    return null;
  });

  // Auto-sync active section when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (currentPath.startsWith('/shop') || currentPath === '/cart') {
        setActiveAccordion('shop');
      } else {
        setActiveAccordion(null);
      }
    }
  }, [isOpen, currentPath]);

  if (!isOpen) return null;

  const toggleSection = (sectionKey) => {
    setActiveAccordion(prev => (prev === sectionKey ? null : sectionKey));
  };

  const handleNav = (path) => {
    onClose();
    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHomeActive = currentPath === '/' || currentPath === '/home';
  const isShopActive = currentPath.startsWith('/shop') || currentPath === '/cart';
  const isCommunityActive = currentPath.startsWith('/community');
  const isProfileActive = currentPath === '/profile';
  const isSettingsActive = currentPath === '/settings';

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
        
        {/* Fixed Header */}
        <div className="mobile-drawer-header">
          <span className="brand-logo-text">Craftinator</span>
          <button className="mobile-drawer-close" onClick={onClose} aria-label="Close navigation">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Middle Body (Tagline, Language Selector, and Nav) */}
        <div className="mobile-drawer-body">
          {/* Brand Tagline Strip */}
          <div className="mobile-drawer-tagline">
            <span>Artisans</span> • <span>Community</span> • <span>Connections</span>
          </div>

          {/* Language Selector in Mobile Drawer */}
          <div className="mobile-drawer-lang-wrapper">
            <LanguageSelector isMobile={true} />
          </div>

          {/* Hierarchical Navigation Tree */}
          <nav className="mobile-drawer-nav" aria-label="Mobile Navigation">
          <ul className="mobile-nav-root-list">
            
            {/* 1. HOME */}
            <li className="mobile-nav-root-item">
              <button
                type="button"
                className={`mobile-drawer-link ${isHomeActive ? 'active' : ''}`}
                onClick={() => handleNav('/')}
              >
                <div className="mobile-link-left">
                  <Home size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('nav_home', 'Home')}</span>
                </div>
              </button>
            </li>

            {/* 2. SHOP (Accordion Section) */}
            <li className={`mobile-nav-root-item ${activeAccordion === 'shop' ? 'is-expanded' : ''}`}>
              <button
                type="button"
                className={`mobile-drawer-link mobile-accordion-trigger ${isShopActive ? 'active-parent' : ''} ${activeAccordion === 'shop' ? 'open-trigger' : ''}`}
                onClick={() => toggleSection('shop')}
                aria-expanded={activeAccordion === 'shop'}
              >
                <div className="mobile-link-left">
                  <ShoppingBag size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('nav_shop', 'Shop')}</span>
                  {(wishlistCount > 0 || cartCount > 0) && (
                    <span className="mobile-link-dot-indicator" title="Items in cart or wishlist" />
                  )}
                </div>
                <ChevronDown 
                  size={18} 
                  className={`accordion-chevron-icon ${activeAccordion === 'shop' ? 'rotated' : ''}`} 
                />
              </button>

              {/* Shop Sub-items Collapsible Panel */}
              <div className={`mobile-accordion-panel ${activeAccordion === 'shop' ? 'open' : ''}`}>
                <div className="mobile-accordion-inner">
                  <ul className="mobile-subnav-list">
                    
                    {/* All Shop Products */}
                    <li className="mobile-subnav-item">
                      <button
                        type="button"
                        className={`mobile-subnav-link ${currentPath === '/shop' ? 'active' : ''}`}
                        onClick={() => handleNav('/shop')}
                      >
                        <Package size={16} className="mobile-sublink-icon" />
                        <span className="mobile-sublink-text">{t('all_products', 'All Products')}</span>
                      </button>
                    </li>

                    {/* Wishlist Sub-Item */}
                    <li className="mobile-subnav-item">
                      <button
                        type="button"
                        className="mobile-subnav-link"
                        onClick={() => {
                          onClose();
                          if (onOpenWishlist) onOpenWishlist();
                        }}
                      >
                        <Heart size={16} className="mobile-sublink-icon icon-wishlist" />
                        <span className="mobile-sublink-text">{t('wishlist_title', 'Wishlist')}</span>
                        {wishlistCount > 0 && (
                          <span className="mobile-subnav-badge badge-terracotta">
                            {wishlistCount}
                          </span>
                        )}
                      </button>
                    </li>

                    {/* Add to Cart / Cart Sub-Item */}
                    <li className="mobile-subnav-item">
                      <button
                        type="button"
                        className={`mobile-subnav-link ${currentPath === '/cart' ? 'active' : ''}`}
                        onClick={() => handleNav('/cart')}
                        aria-current={currentPath === '/cart' ? 'page' : undefined}
                        aria-label={`${t('cart_title', 'Shopping Cart')}${cartCount > 0 ? ` (${cartCount})` : ''}`}
                      >
                        <ShoppingBag size={16} className="mobile-sublink-icon icon-cart" />
                        <span className="mobile-sublink-text">{t('cart_title', 'Shopping Cart')}</span>
                        {cartCount > 0 && (
                          <span className="mobile-subnav-badge badge-warm">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </li>

                  </ul>
                </div>
              </div>
            </li>

            {/* 3. COMMUNITY */}
            <li className="mobile-nav-root-item">
              <button
                type="button"
                className={`mobile-drawer-link ${isCommunityActive ? 'active' : ''}`}
                onClick={() => handleNav('/community')}
              >
                <div className="mobile-link-left">
                  <Users size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('nav_community', 'Community')}</span>
                </div>
              </button>
            </li>

            {/* 4. PROFILE */}
            <li className="mobile-nav-root-item">
              <button
                type="button"
                className={`mobile-drawer-link ${isProfileActive ? 'active' : ''}`}
                onClick={() => handleNav('/profile')}
              >
                <div className="mobile-link-left">
                  <User size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('profile', 'Profile')}</span>
                </div>
              </button>
            </li>

            {/* 5. SETTINGS */}
            <li className="mobile-nav-root-item">
              <button
                type="button"
                className={`mobile-drawer-link ${isSettingsActive ? 'active' : ''}`}
                onClick={() => handleNav('/settings')}
              >
                <div className="mobile-link-left">
                  <SettingsIcon size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('settings', 'Settings')}</span>
                </div>
              </button>
            </li>

          </ul>
        </nav>
      </div>

      {/* Fixed Auth Buttons */}
      <div className="mobile-drawer-auth">
          {authUser ? (
            <div className="mobile-drawer-user-box">
              <button
                type="button"
                className="mobile-user-card"
                onClick={() => handleNav('/profile')}
              >
                <img src={authUser.avatar} alt={authUser.name} className="mobile-user-avatar" />
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{authUser.name}</span>
                  <span className="mobile-user-role">{authUser.role || 'Artisan Guild Member'}</span>
                </div>
              </button>
              <button
                type="button"
                className="btn btn-secondary mobile-logout-btn"
                onClick={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
              >
                <LogOut size={16} />
                {t('auth_logout', 'Sign Out')}
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary mobile-auth-btn"
                onClick={() => handleNav('/login')}
              >
                <LogIn size={18} />
                {t('login')}
              </button>
              <button
                type="button"
                className="btn btn-primary mobile-auth-btn"
                onClick={() => handleNav('/signup')}
              >
                <UserPlus size={18} />
                {t('signup')}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
