import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

/* Styles */
import './index.css';
import './styles/Header.css';
import './styles/MobileDrawer.css';
import './styles/Hero.css';
import './styles/BrandValues.css';
import './styles/ShopByCategory.css';
import './styles/TrendingProducts.css';
import './styles/MeetMakers.css';
import './styles/CommunitySection.css';
import './styles/StoryBanner.css';
import './styles/PersonalizedDiscovery.css';
import './styles/SellerCTA.css';
import './styles/Testimonials.css';
import './styles/Newsletter.css';
import './styles/Footer.css';
import './styles/LanguageSelector.css';
import './styles/ShopPage.css';
import './styles/Modals.css';
import './styles/SearchModal.css';
import './styles/LoadingScreen.css';
import './styles/ProductDetailsPage.css';
import './styles/ProductAccordion.css';
import './styles/MeetMakersPage.css';
import './styles/CommunityPage.css';

import {
  Header,
  MobileDrawer,
  Footer,
  ToastNotification,
  ProductModal,
  ArtisanModal,
  AuthModal,
  ScrollToTop,
  LoadingScreen,
  CartDrawer,
  WishlistDrawer,
  SearchModal
} from './components';

/* Pages */
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import MeetMakersPage from './pages/MeetMakersPage';
import CommunityPage from './pages/CommunityPage';

/* Datasets */
import { products } from './data/products';

function AppContent() {
  const { t } = useLanguage();

  /* Route State */
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.startsWith('/product')) return path + search;
    if (path === '/shop') return '/shop';
    if (path === '/makers' || path === '/meet-makers') return '/makers';
    if (path === '/community') return '/community';
    if (path === '/home') return '/home';
    return '/';
  });

  /* App & Route Loading State */
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadingKey, setLoadingKey] = useState(0);

  /* Scroll Restoration and Position Registry */
  const scrollPositionsRef = useRef({});
  const isPopStateNav = useRef(false);
  const pendingScrollY = useRef(null);

  // Enable manual browser scroll restoration so we control exact coordinates
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record active page scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!isPopStateNav.current) {
        const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        scrollPositionsRef.current[currentPath] = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  /* Extract Product ID if on /product route */
  const currentProductId = useMemo(() => {
    if (!currentPath.startsWith('/product')) return null;
    if (currentPath.includes('?')) {
      const queryPart = currentPath.split('?')[1];
      const params = new URLSearchParams(queryPart);
      if (params.get('id')) return params.get('id');
    }
    const segments = currentPath.split('/');
    if (segments.length >= 3 && segments[2]) {
      return segments[2].split('?')[0];
    }
    return products[0]?.id || null;
  }, [currentPath]);

  /* Browser Back / Forward (popstate) Handler */
  useEffect(() => {
    const handlePopState = (event) => {
      const pathname = window.location.pathname;
      const search = window.location.search;
      let nextPath = '/';
      if (pathname.startsWith('/product')) {
        nextPath = pathname + search;
      } else if (pathname === '/shop') {
        nextPath = '/shop';
      } else if (pathname === '/makers' || pathname === '/meet-makers') {
        nextPath = '/makers';
      } else if (pathname === '/community') {
        nextPath = '/community';
      } else if (pathname === '/home') {
        nextPath = '/home';
      }

      // Mark this navigation as Back / Forward (PopState)
      isPopStateNav.current = true;

      // Retrieve saved scroll position
      let targetY = 0;
      if (event && event.state && typeof event.state.scrollY === 'number') {
        targetY = event.state.scrollY;
      } else if (typeof scrollPositionsRef.current[nextPath] === 'number') {
        targetY = scrollPositionsRef.current[nextPath];
      } else {
        try {
          const cached = sessionStorage.getItem('craft_scroll_' + nextPath);
          if (cached) targetY = parseInt(cached, 10) || 0;
        } catch (e) {}
      }
      pendingScrollY.current = targetY;

      setCurrentPath(nextPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* Scroll Positioning Effect on Route Changes */
  useEffect(() => {
    if (isPopStateNav.current) {
      // BROWSER BACK: Restore previous exact scroll position
      const targetY = pendingScrollY.current ?? (scrollPositionsRef.current[currentPath] || 0);

      // Multi-pass execution ensures DOM layout calculations are completed
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          isPopStateNav.current = false;
          pendingScrollY.current = null;
        }, 50);
      });
    } else {
      // FORWARD NAVIGATION / PAGE REDIRECT / REFRESH: Always start at TOP (0)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentPath]);

  /* Forward Navigation Handler (Option click, Product Card click, Link click) */
  const handleNavigate = (path) => {
    const normalize = (p) => (p === '/home' || p === '') ? '/' : p;
    if (normalize(path) === normalize(currentPath)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    // 1. Save scroll position of current page before leaving
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    scrollPositionsRef.current[currentPath] = currentScrollY;
    try {
      sessionStorage.setItem('craft_scroll_' + currentPath, String(currentScrollY));
      window.history.replaceState({ path: currentPath, scrollY: currentScrollY }, '');
    } catch (e) {}

    // 2. Mark this navigation as forward (New Page -> Always Top)
    isPopStateNav.current = false;
    pendingScrollY.current = 0;

    // 3. Trigger transition loading
    setLoadingKey((prev) => prev + 1);
    setIsAppLoading(true);

    // 4. Update route & history
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({ path, scrollY: 0 }, '', path);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  /* Cart State */
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 1 }
  ]);

  /* Wishlist State */
  const [wishlist, setWishlist] = useState([
    'nordicness-ceramic-vase',
    'base-botanical-earrings',
    'scented-fig-candle'
  ]);

  /* Modals Control State */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedArtisanModal, setSelectedArtisanModal] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'signup' | null

  /* Toast Notification */
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /* Cart Handlers */
  const handleAddToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: qty }];
    });

    showToast(`Added "${product.name}" to your cart`);
  };

  /* Wishlist Handlers */
  const handleToggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast(t('toast_wishlist_removed'));
    } else {
      setWishlist([...wishlist, productId]);
      showToast(t('toast_wishlist_added'));
    }
  };

  /* Product Navigation Handler - Direct to Product Details Page (Opens at TOP) */
  const handleProductClick = (product) => {
    if (!product) return;
    const prodId = typeof product === 'string' ? product : product.id;
    setSelectedProductModal(null);
    setSelectedArtisanModal(null);
    setIsMobileMenuOpen(false);
    handleNavigate(`/product?id=${prodId}`);
  };

  return (
    <div className="app-root">
      {/* 0. Artisan Initial & Route Redirect Loading Screen */}
      {isAppLoading && (
        <LoadingScreen
          key={`app-loading-${loadingKey}`}
          minDuration={loadingKey === 0 ? 1000 : 650}
          onComplete={() => {
            setIsAppLoading(false);
            if (!isPopStateNav.current) {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }
          }}
        />
      )}
      
      {/* 1. Reusable Global Header Navigation */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenCart={() => showToast(`Cart contains ${cartItems.length} items`)}
        onOpenWishlist={() => showToast(`Wishlist contains ${wishlist.length} items`)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Page View Architecture */}
      <main id="main-content">
        {currentPath.startsWith('/product') ? (
          /* Dedicated Independent Product Details Page (/product?id=...) */
          <ProductDetailsPage
            productId={currentProductId}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onOpenProductModal={handleProductClick}
            onNavigate={handleNavigate}
          />
        ) : currentPath === '/shop' ? (
          /* Dedicated Independent Shop Page (/shop) */
          <ShopPage
            wishlist={wishlist}
            initialSearchQuery={shopSearchQuery}
            onToggleWishlist={handleToggleWishlist}
            onOpenProductModal={handleProductClick}
            onAddToCart={handleAddToCart}
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onNavigateHome={() => handleNavigate('/')}
            onNavigate={handleNavigate}
          />
        ) : (currentPath === '/makers' || currentPath === '/meet-makers') ? (
          /* Dedicated Independent Meet the Makers Page (/makers) */
          <MeetMakersPage
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onOpenProductModal={handleProductClick}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        ) : currentPath === '/community' ? (
          /* Dedicated Independent Community Social Feed Page (/community) */
          <CommunityPage
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onOpenProductModal={handleProductClick}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        ) : (
          /* Dedicated Homepage (/ and /home) */
          <HomePage
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenProductModal={handleProductClick}
            onAddToCart={handleAddToCart}
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}
      </main>

      {/* 3. Reusable Global Footer (Hidden on /community for full social media app experience) */}
      {currentPath !== '/community' && <Footer />}

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onNavigate={handleNavigate}
      />

      {/* Product Quick-View Details Modal */}
      {selectedProductModal && (
        <ProductModal
          product={selectedProductModal}
          wishlist={wishlist}
          onClose={() => setSelectedProductModal(null)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      )}

      {/* Artisan Profile Modal */}
      {selectedArtisanModal && (
        <ArtisanModal
          artisan={selectedArtisanModal}
          onClose={() => setSelectedArtisanModal(null)}
          onOpenProductModal={handleProductClick}
        />
      )}

      {/* Authentication Modal */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={(user) => {
            showToast(`Welcome back, ${user.name || 'Artisan Friend'}!`);
            setAuthModalMode(null);
          }}
        />
      )}

      {/* Interactive Global Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenProductModal={handleProductClick}
        onNavigateToShop={(searchQuery) => {
          setIsSearchOpen(false);
          setShopSearchQuery(searchQuery);
          handleNavigate('/shop');
        }}
      />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Global Interactive Toast Notification */}
      {toast && (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
