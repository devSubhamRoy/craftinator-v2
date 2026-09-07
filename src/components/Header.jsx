import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header({
  cartCount,
  wishlistCount,
  currentPath,
  onNavigate,
  onOpenCart,
  onOpenWishlist,
  onOpenMobileMenu,
  onOpenAuth,
  onOpenSearch
}) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav_home'), path: '/' },
    { id: 'shop', label: t('nav_shop'), path: '/shop' },
    { id: 'artisans', label: t('nav_makers'), path: '/#meet-makers', anchor: 'meet-makers' },
    { id: 'community', label: t('nav_community'), path: '/#community-section', anchor: 'community-section' },
    { id: 'stories', label: t('nav_story'), path: '/#story-banner', anchor: 'story-banner' }
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
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

  const isShopActive = currentPath === '/shop';

  return (
    <header className={`header-root ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        
        {/* Mobile Menu Toggle Button */}
        <button
          className="header-mobile-toggle"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Brand Text Logo */}
        <a
          href="/"
          className="brand-logo-text"
          aria-label="Craftinator Homepage"
          onClick={(e) => {
            e.preventDefault();
            onNavigate && onNavigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Craftinator
        </a>

        {/* Center Desktop Navigation */}
        <nav className="header-nav-desktop" aria-label="Main Navigation">
          <ul className="header-nav-list">
            {navItems.map((item) => {
              const isActive = item.id === 'shop' ? isShopActive : (!isShopActive && item.id === 'home');

              return (
                <li key={item.id}>
                  <a
                    href={item.path}
                    className={`header-nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item.label}
                    {isActive && <span className="nav-active-indicator" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* i18n Language Selector Dropdown */}
          <LanguageSelector />

          {/* Search Button */}
          <button
            className="header-icon-btn"
            onClick={onOpenSearch}
            aria-label={t('search_placeholder')}
            title={t('search_placeholder')}
          >
            <Search size={19} />
          </button>

          {/* Wishlist Button */}
          <button
            className="header-icon-btn wishlist-btn"
            onClick={onOpenWishlist}
            aria-label={`${t('wishlist')} (${wishlistCount})`}
            title={t('wishlist')}
          >
            <Heart size={19} />
            {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
          </button>

          {/* Cart Button */}
          <button
            className="header-icon-btn cart-btn"
            onClick={onOpenCart}
            aria-label={`${t('cart')} (${cartCount})`}
            title={t('cart')}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="header-badge badge-terracotta">{cartCount}</span>}
          </button>

          {/* Desktop Auth Actions */}
          <div className="header-auth-desktop">
            <button
              className="header-login-btn"
              onClick={() => onOpenAuth('login')}
            >
              {t('login')}
            </button>
            <button
              className="btn btn-primary header-signup-btn"
              onClick={() => onOpenAuth('signup')}
            >
              {t('signup')}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
