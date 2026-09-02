import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenMobileMenu,
  onOpenAuth,
  onOpenSearch
}) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav_explore'), href: '#' },
    { id: 'shop', label: t('nav_trending'), href: '#trending-products' },
    { id: 'artisans', label: t('nav_makers'), href: '#meet-makers' },
    { id: 'community', label: t('nav_community'), href: '#community-section' },
    { id: 'stories', label: t('nav_story'), href: '#story-banner' }
  ];

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
        <a href="#" className="brand-logo-text" aria-label="Craftinator Homepage">
          Craftinator
        </a>

        {/* Center Desktop Navigation */}
        <nav className="header-nav-desktop" aria-label="Main Navigation">
          <ul className="header-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`header-nav-link ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  {item.label}
                  {activeNav === item.id && <span className="nav-active-indicator" />}
                </a>
              </li>
            ))}
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
