import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, MessageSquare, Bell, User, LogOut } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageSelector from '../ui/LanguageSelector';

export default function Header({
  cartCount,
  wishlistCount,
  currentPath,
  authUser,
  onLogout,
  onNavigate,
  onOpenCart,
  onOpenWishlist,
  onOpenMobileMenu,
  onOpenAuth,
  onOpenSearch,
  onOpenChat,
  onOpenNotifications
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
    { id: 'home', label: t('nav_home', 'Home'), path: '/' },
    { id: 'shop', label: t('nav_shop', 'Shop'), path: '/shop' },
    // { id: 'makers', label: t('nav_makers', 'Meet the Makers'), path: '/makers' },
    { id: 'community', label: t('nav_community', 'Community'), path: '/community' },
    // { id: 'stories', label: t('nav_story', 'Heritage Stories'), path: '/#story-banner', anchor: 'story-banner' }
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (item.path === '/shop' || item.path === '/makers' || item.path === '/community') {
      onNavigate && onNavigate(item.path);
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

  const isShopActive = currentPath === '/shop' || currentPath.startsWith('/shop');
  const isMakersActive = currentPath === '/makers' || currentPath === '/meet-makers' || currentPath.startsWith('/makers');
  const isCommunityActive = Boolean(currentPath && currentPath.startsWith('/community'));
  const isHomeActive = currentPath === '/' || currentPath === '/home';

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
              const isActive = item.id === 'shop'
                ? isShopActive
                : (item.id === 'makers'
                  ? isMakersActive
                  : (item.id === 'community'
                    ? isCommunityActive
                    : (item.id === 'home' && isHomeActive)));

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
          {/* i18n Language Selector Dropdown (Desktop Only - Mobile/Tablet has it in Drawer) */}
          <div className="header-desktop-only">
            <LanguageSelector />
          </div>

          {/* 1. Search Button (Always visible on Mobile, Tablet & Desktop) */}
          <button
            className="header-icon-btn"
            onClick={onOpenSearch}
            aria-label={t('search_placeholder')}
            title={t('search_placeholder')}
          >
            <Search size={19} />
          </button>

          {/* 2. Chat Button (Available across Mobile, Tablet & Desktop) */}
          <button
            className={`header-icon-btn chat-btn ${currentPath === '/chat' || currentPath.startsWith('/chat') ? 'active' : ''}`}
            onClick={() => {
              if (onNavigate) {
                onNavigate('/chat');
              } else if (onOpenChat) {
                onOpenChat();
              }
            }}
            aria-label={t('nav_chat', 'Artisan Studio Chat')}
            title={t('nav_chat', 'Artisan Studio Chat')}
          >
            <MessageSquare size={19} />
          </button>

          {/* 3. Action Icon: Notification Button on Community Page, Cart Button on all other pages */}
          {isCommunityActive ? (
            <button
              className="header-icon-btn notification-btn"
              onClick={() => {
                if (onOpenNotifications) onOpenNotifications();
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
              <span className="header-badge badge-terracotta">2</span>
            </button>
          ) : (
            <button
              className="header-icon-btn cart-btn"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/cart');
                } else {
                  if (onOpenCart) onOpenCart();
                }
              }}
              aria-label={`${t('cart')} (${cartCount})`}
              title={t('cart')}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="header-badge badge-terracotta">{cartCount}</span>}
            </button>
          )}

          {/* Desktop Auth Actions (Desktop Only) */}
          <div className="header-auth-desktop header-desktop-only">
            {authUser ? (
              <div className="header-user-menu">
                <button
                  type="button"
                  className="header-user-pill"
                  onClick={() => onNavigate && onNavigate('/profile')}
                  title={`Signed in as ${authUser.name}`}
                >
                  <img src={authUser.avatar} alt={authUser.name} className="header-user-avatar" />
                  <span className="header-user-name">{authUser.name.split(' ')[0]}</span>
                </button>
                <button
                  type="button"
                  className="header-logout-btn"
                  onClick={onLogout}
                  title={t('auth_logout', 'Sign Out')}
                  aria-label={t('auth_logout', 'Sign Out')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="header-login-btn"
                  onClick={() => (onNavigate ? onNavigate('/login') : onOpenAuth('login'))}
                >
                  {t('login')}
                </button>
                <button
                  className="btn btn-primary header-signup-btn"
                  onClick={() => (onNavigate ? onNavigate('/signup') : onOpenAuth('signup'))}
                >
                  {t('signup')}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
