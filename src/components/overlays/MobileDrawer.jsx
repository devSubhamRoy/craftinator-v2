import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Heart, 
  Users, 
  Rss, 
  Bookmark, 
  MessageCircle, 
  User, 
  Settings as SettingsIcon, 
  ChevronDown, 
  ChevronRight, 
  LogIn, 
  UserPlus 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  onOpenAuth, 
  onNavigate,
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

  // Single active accordion section (auto-closes others when one opens)
  const [activeAccordion, setActiveAccordion] = useState(() => {
    if (currentPath.startsWith('/shop')) return 'shop';
    if (currentPath.startsWith('/community')) return 'community';
    return null;
  });

  // Auto-sync active section when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (currentPath.startsWith('/shop')) {
        setActiveAccordion('shop');
      } else if (currentPath.startsWith('/community')) {
        setActiveAccordion('community');
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
  const isShopActive = currentPath.startsWith('/shop');
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
                <ChevronRight size={16} className="mobile-link-arrow" />
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
                <div className="mobile-accordion-chevron">
                  <ChevronDown 
                    size={18} 
                    className={`accordion-chevron-icon ${activeAccordion === 'shop' ? 'rotated' : ''}`} 
                  />
                </div>
              </button>

              {/* Shop Sub-items Collapsible Panel */}
              <div className={`mobile-accordion-panel ${activeAccordion === 'shop' ? 'open' : ''}`}>
                <ul className="mobile-subnav-list">
                  
                  {/* All Shop Products */}
                  <li className="mobile-subnav-item">
                    <button
                      type="button"
                      className={`mobile-subnav-link ${currentPath === '/shop' ? 'active' : ''}`}
                      onClick={() => handleNav('/shop')}
                    >
                      <span className="subnav-bullet">•</span>
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
                      <Heart size={15} className="mobile-sublink-icon icon-wishlist" />
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
                      className="mobile-subnav-link"
                      onClick={() => {
                        onClose();
                        if (onOpenCart) onOpenCart();
                      }}
                    >
                      <ShoppingBag size={15} className="mobile-sublink-icon icon-cart" />
                      <span className="mobile-sublink-text">{t('cart_title', 'Add to Cart')}</span>
                      {cartCount > 0 && (
                        <span className="mobile-subnav-badge badge-warm">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </li>

                </ul>
              </div>
            </li>

            {/* 3. COMMUNITY (Accordion Section) */}
            <li className={`mobile-nav-root-item ${activeAccordion === 'community' ? 'is-expanded' : ''}`}>
              <button
                type="button"
                className={`mobile-drawer-link mobile-accordion-trigger ${isCommunityActive ? 'active-parent' : ''} ${activeAccordion === 'community' ? 'open-trigger' : ''}`}
                onClick={() => toggleSection('community')}
                aria-expanded={activeAccordion === 'community'}
              >
                <div className="mobile-link-left">
                  <Users size={19} className="mobile-link-icon" />
                  <span className="mobile-link-text">{t('nav_community', 'Community')}</span>
                </div>
                <div className="mobile-accordion-chevron">
                  <ChevronDown 
                    size={18} 
                    className={`accordion-chevron-icon ${activeAccordion === 'community' ? 'rotated' : ''}`} 
                  />
                </div>
              </button>

              {/* Community Sub-items Collapsible Panel */}
              <div className={`mobile-accordion-panel ${activeAccordion === 'community' ? 'open' : ''}`}>
                <ul className="mobile-subnav-list">
                  
                  {/* Feed */}
                  <li className="mobile-subnav-item">
                    <button
                      type="button"
                      className={`mobile-subnav-link ${currentPath === '/community' || currentPath.includes('tab=feed') ? 'active' : ''}`}
                      onClick={() => handleNav('/community?tab=feed')}
                    >
                      <Rss size={15} className="mobile-sublink-icon" />
                      <span className="mobile-sublink-text">Feed</span>
                    </button>
                  </li>

                  {/* Saved */}
                  <li className="mobile-subnav-item">
                    <button
                      type="button"
                      className={`mobile-subnav-link ${currentPath.includes('tab=saved') || currentPath.includes('tab=favorites') ? 'active' : ''}`}
                      onClick={() => handleNav('/community?tab=saved')}
                    >
                      <Bookmark size={15} className="mobile-sublink-icon" />
                      <span className="mobile-sublink-text">Saved</span>
                    </button>
                  </li>

                  {/* Liked */}
                  <li className="mobile-subnav-item">
                    <button
                      type="button"
                      className={`mobile-subnav-link ${currentPath.includes('tab=liked') ? 'active' : ''}`}
                      onClick={() => handleNav('/community?tab=liked')}
                    >
                      <Heart size={15} className="mobile-sublink-icon icon-wishlist" />
                      <span className="mobile-sublink-text">Liked</span>
                    </button>
                  </li>

                  {/* Comment */}
                  <li className="mobile-subnav-item">
                    <button
                      type="button"
                      className={`mobile-subnav-link ${currentPath.includes('tab=comment') ? 'active' : ''}`}
                      onClick={() => handleNav('/community?tab=comments')}
                    >
                      <MessageCircle size={15} className="mobile-sublink-icon" />
                      <span className="mobile-sublink-text">Comment</span>
                    </button>
                  </li>

                </ul>
              </div>
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
                <ChevronRight size={16} className="mobile-link-arrow" />
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
                <ChevronRight size={16} className="mobile-link-arrow" />
              </button>
            </li>

          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="mobile-drawer-auth">
          <button
            type="button"
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
            type="button"
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
