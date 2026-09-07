import React, { useState, useEffect, useMemo } from 'react';
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
import './styles/LoadingScreen.css';
import './styles/ProductDetailsPage.css';

/* Global Components */
import Header from './components/Header';
import MobileDrawer from './components/MobileDrawer';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import ProductModal from './components/ProductModal';
import ArtisanModal from './components/ArtisanModal';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

/* Pages */
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

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
    if (path === '/home') return '/home';
    return '/';
  });

  /* App & Route Loading State */
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadingKey, setLoadingKey] = useState(0);

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

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const search = window.location.search;
      let nextPath = '/';
      if (pathname.startsWith('/product')) {
        nextPath = pathname + search;
      } else if (pathname === '/shop') {
        nextPath = '/shop';
      } else if (pathname === '/home') {
        nextPath = '/home';
      }

      const normalize = (p) => (p === '/home' || p === '') ? '/' : p;
      if (normalize(nextPath) !== normalize(currentPath)) {
        setLoadingKey((prev) => prev + 1);
        setIsAppLoading(true);
      }
      setCurrentPath(nextPath);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  /* Always scroll to top whenever the page/route redirects */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  const handleNavigate = (path) => {
    const normalize = (p) => (p === '/home' || p === '') ? '/' : p;
    if (normalize(path) === normalize(currentPath)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    // Trigger loading screen during redirect between /home and /shop
    setLoadingKey((prev) => prev + 1);
    setIsAppLoading(true);
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
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

  /* Product Navigation Handler - Direct to Product Details Page */
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
          minDuration={loadingKey === 0 ? 1100 : 750}
          onComplete={() => setIsAppLoading(false)}
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
        onOpenSearch={() => showToast(t('search_placeholder'))}
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
            onToggleWishlist={handleToggleWishlist}
            onOpenProductModal={handleProductClick}
            onAddToCart={handleAddToCart}
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onNavigateHome={() => handleNavigate('/')}
            onNavigate={handleNavigate}
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

      {/* 3. Reusable Global Footer */}
      <Footer />

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
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Global Toast Notifications */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

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
