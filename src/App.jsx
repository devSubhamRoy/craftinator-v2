import React, { useState, useMemo, lazy, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

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
import './styles/ArtisanDetailsPage.css';
import './styles/CommunityPage.css';
import './styles/ProfilePage.css';
import './styles/SettingsPage.css';
import './styles/AuthPage.css';
import './styles/SectionSkeleton.css';
import './styles/CartPage.css';

import {
  Header,
  MobileDrawer,
  Footer,
  ToastNotification,
  ScrollToTop,
  LoadingScreen,
  CartDrawer,
  WishlistDrawer,
  CartSkeleton
} from './components';

/* Lazy-Loaded Route Pages (Code Splitting) */
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const MeetMakersPage = lazy(() => import('./pages/MeetMakersPage'));
const ArtisanDetailsPage = lazy(() => import('./pages/ArtisanDetailsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

/* Lazy-Loaded Heavy Overlays */
const ProductModal = lazy(() => import('./components/overlays/ProductModal'));
const ArtisanModal = lazy(() => import('./components/overlays/ArtisanModal'));
const AuthModal = lazy(() => import('./components/overlays/AuthModal'));
const SearchModal = lazy(() => import('./components/overlays/SearchModal'));

/* Lightweight Route Transition Fallback */
function RouteLoadingFallback({ path }) {
  if (path === '/cart') {
    return (
      <main className="cart-page-root animate-fade-in" id="cart-content">
        <div className="container">
          <CartSkeleton />
        </div>
      </main>
    );
  }

  return (
    <div className="route-loading-fallback animate-fade-in" aria-busy="true">
      <div className="route-loading-bar" />
      <div className="route-loading-placeholder">
        <div className="skel-block" style={{ width: 'min(380px, 70%)', height: '32px', margin: '3rem auto 1rem', borderRadius: '8px' }} />
        <div className="skel-block" style={{ width: 'min(520px, 85%)', height: '16px', margin: '0 auto 2.5rem', borderRadius: '6px', opacity: 0.7 }} />
        <div className="skel-grid-layout">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`route-skel-${i}`} className="skel-card-box">
              <div className="skel-block skel-card-media" />
              <div className="skel-block skel-card-line-1" />
              <div className="skel-block skel-card-line-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Datasets */
import { products } from './data/products';
import { artisans } from './data/artisans';

function AppContent() {
  const { t } = useLanguage();
  const { currentPath, navigate, goBack } = useNavigation();

  /* App & Route Loading State */
  const [isAppLoading, setIsAppLoading] = useState(true);

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

  /* Extract Artisan ID if on /artisan or /maker route */
  const currentArtisanId = useMemo(() => {
    if (!currentPath.startsWith('/artisan') && !currentPath.startsWith('/maker')) return null;
    if (currentPath.includes('?')) {
      const queryPart = currentPath.split('?')[1];
      const params = new URLSearchParams(queryPart);
      if (params.get('id')) return params.get('id');
    }
    const segments = currentPath.split('/');
    if (segments.length >= 3 && segments[2]) {
      return segments[2].split('?')[0];
    }
    return artisans[0]?.id || null;
  }, [currentPath]);

  /* Forward Navigation Handler */
  const handleNavigate = (path, options = {}) => {
    navigate(path, options);
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedArtisanModal, setSelectedArtisanModal] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'signup' | null

  /* Persistent Demo Authentication State */
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('craft_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    try {
      localStorage.setItem('craft_auth_user', JSON.stringify(user));
    } catch (e) {}
    setAuthModalMode(null);
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem('craft_auth_user');
    } catch (e) {}
    showToast(t('auth_logged_out', 'Signed out successfully. Come back soon!'));
  };

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

  const handleUpdateCartQuantity = (productId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showToast(t('cart_item_removed', 'Item removed from cart'));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    showToast(t('checkout_initiated', 'Proceeding to secure checkout...'));
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
    handleNavigate(`/product?id=${prodId}`, { targetId: `product-card-${prodId}` });
  };

  /* Artisan Navigation Handler - Direct to Artisan Details Page */
  const handleArtisanClick = (artisan) => {
    if (!artisan) return;
    const artId = typeof artisan === 'string' ? artisan : (artisan.id || artisan.name);
    setSelectedProductModal(null);
    setSelectedArtisanModal(null);
    setIsMobileMenuOpen(false);
    handleNavigate(`/artisan?id=${artId}`, { targetId: `artisan-card-${artId}` });
  };

  return (
    <div className="app-root">
      {/* 0. Artisan Initial Loading Screen */}
      {isAppLoading && (
        <LoadingScreen
          minDuration={800}
          onComplete={() => {
            setIsAppLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
        />
      )}
      
      {/* 1. Reusable Global Header Navigation */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentPath={currentPath}
        authUser={authUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuth={(mode) => {
          if (mode === 'signup') handleNavigate('/signup');
          else handleNavigate('/login');
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenChat={() => {
          showToast('Artisan Chat: Chat directly with master craftspeople');
        }}
        onOpenNotifications={() => {
          showToast('Notifications: 2 new artisan craft drops & restocks');
        }}
      />

      {/* 2. Main Page View Architecture */}
      <main id="main-content">
        <Suspense fallback={<RouteLoadingFallback path={currentPath} />}>
          {(currentPath === '/login' || currentPath === '/signup' || currentPath.startsWith('/auth')) ? (
            /* Dedicated Independent Demo Auth Page (/login, /signup, /auth) */
            <AuthPage
              initialMode={currentPath === '/signup' ? 'signup' : 'login'}
              onNavigate={handleNavigate}
              onGoBack={goBack}
              onAuthSuccess={handleAuthSuccess}
              showToast={showToast}
            />
          ) : currentPath.startsWith('/product') ? (
            /* Dedicated Independent Product Details Page (/product?id=...) */
            <ProductDetailsPage
              productId={currentProductId}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenArtisanModal={handleArtisanClick}
              onOpenProductModal={handleProductClick}
              onNavigate={handleNavigate}
              onGoBack={goBack}
            />
          ) : (currentPath.startsWith('/artisan') || currentPath.startsWith('/maker')) ? (
            /* Dedicated Independent Artisan Details Page (/artisan?id=...) */
            <ArtisanDetailsPage
              artisanId={currentArtisanId}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenProductModal={handleProductClick}
              onOpenArtisanModal={handleArtisanClick}
              onNavigate={handleNavigate}
              onGoBack={goBack}
              showToast={showToast}
            />
          ) : currentPath === '/shop' ? (
            /* Dedicated Independent Shop Page (/shop) */
            <ShopPage
              wishlist={wishlist}
              initialSearchQuery={shopSearchQuery}
              onToggleWishlist={handleToggleWishlist}
              onOpenProductModal={handleProductClick}
              onAddToCart={handleAddToCart}
              onOpenArtisanModal={handleArtisanClick}
              onNavigateHome={() => handleNavigate('/')}
              onNavigate={handleNavigate}
            />
          ) : (currentPath === '/makers' || currentPath === '/meet-makers') ? (
            /* Dedicated Independent Meet the Makers Page (/makers) */
            <MeetMakersPage
              onOpenArtisanModal={handleArtisanClick}
              onOpenProductModal={handleProductClick}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          ) : currentPath.startsWith('/community') ? (
            /* Dedicated Independent Community Social Feed Page (/community) */
            <CommunityPage
              onOpenArtisanModal={handleArtisanClick}
              onOpenProductModal={handleProductClick}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          ) : currentPath === '/profile' ? (
            /* Dedicated Independent Profile Page (/profile) */
            <ProfilePage
              wishlist={wishlist}
              authUser={authUser}
              onLogout={handleLogout}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenProductModal={handleProductClick}
              onOpenArtisanModal={handleArtisanClick}
              onNavigate={handleNavigate}
              onGoBack={goBack}
              showToast={showToast}
            />
          ) : currentPath === '/settings' ? (
            /* Dedicated Independent Settings Page (/settings) */
            <SettingsPage
              onNavigate={handleNavigate}
              onGoBack={goBack}
              showToast={showToast}
            />
          ) : currentPath === '/cart' ? (
            /* Dedicated Independent Cart Page (/cart) */
            <CartPage
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onAddToCart={handleAddToCart}
              onCheckout={handleCheckout}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onOpenProductModal={handleProductClick}
              onOpenArtisanModal={handleArtisanClick}
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
              onOpenArtisanModal={handleArtisanClick}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}
        </Suspense>
      </main>

      {/* 3. Reusable Global Footer (Hidden on /community, /login, /signup for full immersive experience) */}
      {!currentPath.startsWith('/community') && !currentPath.startsWith('/login') && !currentPath.startsWith('/signup') && !currentPath.startsWith('/auth') && <Footer />}

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={(mode) => {
          setIsMobileMenuOpen(false);
          if (mode === 'signup') handleNavigate('/signup');
          else handleNavigate('/login');
        }}
        onNavigate={handleNavigate}
        authUser={authUser}
        onLogout={handleLogout}
        currentPath={currentPath}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Interactive Cart Slide-in Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        onNavigate={handleNavigate}
      />

      {/* Interactive Wishlist Slide-in Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductModal={handleProductClick}
      />

      {/* Product Quick-View Details Modal */}
      {selectedProductModal && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProductModal}
            wishlist={wishlist}
            onClose={() => setSelectedProductModal(null)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}

      {/* Artisan Profile Modal */}
      {selectedArtisanModal && (
        <Suspense fallback={null}>
          <ArtisanModal
            artisan={selectedArtisanModal}
            isOpen={true}
            onClose={() => setSelectedArtisanModal(null)}
            onOpenProductModal={handleProductClick}
            onNavigateToArtisan={() => handleArtisanClick(selectedArtisanModal)}
          />
        </Suspense>
      )}

      {/* Authentication Modal */}
      {authModalMode && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={Boolean(authModalMode)}
            mode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onAuthSuccess={(user) => {
              handleAuthSuccess(user);
              showToast(`Welcome back, ${user.name || 'Artisan Friend'}!`);
            }}
          />
        </Suspense>
      )}

      {/* Interactive Global Search Overlay Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

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
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </LanguageProvider>
  );
}
