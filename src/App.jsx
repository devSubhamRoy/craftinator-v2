import React, { useState, useEffect } from 'react';
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

/* Global Components */
import Header from './components/Header';
import MobileDrawer from './components/MobileDrawer';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import ProductModal from './components/ProductModal';
import ArtisanModal from './components/ArtisanModal';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';

/* Pages */
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';

/* Datasets */
import { products } from './data/products';

function AppContent() {
  const { t } = useLanguage();

  /* Route State */
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' && window.location.pathname === '/shop'
      ? '/shop'
      : (window.location.pathname === '/home' ? '/home' : '/')
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(
        window.location.pathname === '/shop'
          ? '/shop'
          : (window.location.pathname === '/home' ? '/home' : '/')
      );
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* Always scroll to top whenever the page/route redirects */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  const handleNavigate = (path) => {
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

  return (
    <div className="app-root">
      
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
        {currentPath === '/shop' ? (
          /* Dedicated Independent Shop Page (/shop) */
          <ShopPage
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenProductModal={(product) => setSelectedProductModal(product)}
            onAddToCart={handleAddToCart}
            onOpenArtisanModal={(artisan) => setSelectedArtisanModal(artisan)}
            onNavigateHome={() => handleNavigate('/')}
          />
        ) : (
          /* Dedicated Homepage (/ and /home) */
          <HomePage
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenProductModal={(product) => setSelectedProductModal(product)}
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
        />
      )}

      {/* Artisan Profile Modal */}
      {selectedArtisanModal && (
        <ArtisanModal
          artisan={selectedArtisanModal}
          onClose={() => setSelectedArtisanModal(null)}
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
