import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';

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
import './styles/CartDrawer.css';
import './styles/Modals.css';
import './styles/LanguageSelector.css';

/* Components */
import Header from './components/Header';
import MobileDrawer from './components/MobileDrawer';
import Hero from './components/Hero';
import BrandValues from './components/BrandValues';
import ShopByCategory from './components/ShopByCategory';
import TrendingProducts from './components/TrendingProducts';
import MeetMakers from './components/MeetMakers';
import CommunitySection from './components/CommunitySection';
import StoryBanner from './components/StoryBanner';
import PersonalizedDiscovery from './components/PersonalizedDiscovery';
import SellerCTA from './components/SellerCTA';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

/* Drawers & Modals */
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductModal from './components/ProductModal';
import ArtisanModal from './components/ArtisanModal';
import StoryModal from './components/StoryModal';
import AuthModal from './components/AuthModal';
import ToastNotification from './components/ToastNotification';

/* Datasets */
import { products } from './data/products';

function AppContent() {
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

  /* UI Drawers & Modals Control */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeArtisanModal, setActiveArtisanModal] = useState(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'login' });

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

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Removed item from cart');
  };

  /* Wishlist Handlers */
  const handleToggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Item removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Saved to your wishlist');
    }
  };

  /* Checkout Handler */
  const handleCheckout = () => {
    setIsCartOpen(false);
    showToast('Thank you! Your artisan order has been placed.');
    setCartItems([]);
  };

  return (
    <div className="app-root">
      
      {/* 1. Header Navigation */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenSearch={() => showToast('Search modal ready: type pottery, candles, jewelry...')}
      />

      {/* 2. Hero Section */}
      <main id="main-content">
        <Hero
          onShopClick={() => {
            const el = document.getElementById('trending-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onArtisansClick={() => {
            const el = document.getElementById('meet-makers');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Brand Value Strip */}
        <BrandValues />

        {/* 4. Shop by Category */}
        <ShopByCategory
          onSelectCategory={(category) => {
            showToast(`Filter applied: ${category.name}`);
            const el = document.getElementById('trending-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Trending Handmade Products */}
        <TrendingProducts
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenProductModal={(product) => setActiveProductModal(product)}
          onAddToCart={handleAddToCart}
        />

        {/* 6. Meet the Hands Behind the Craft */}
        <MeetMakers
          onOpenArtisanModal={(artisan) => setActiveArtisanModal(artisan)}
        />

        {/* 7. Community Section */}
        <CommunitySection
          onExploreClick={() => {
            const el = document.getElementById('trending-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 8. Behind Every Piece Is a Story */}
        <StoryBanner
          onOpenStoryModal={() => setIsStoryModalOpen(true)}
        />

        {/* 9. Personalized Discovery */}
        <PersonalizedDiscovery
          onFilterByStyle={(style) => {
            showToast(`Showing recommendations for ${style} style`);
            const el = document.getElementById('trending-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 10. Seller / Artisan CTA */}
        <SellerCTA
          onStartSelling={() => setAuthModalConfig({ isOpen: true, mode: 'signup' })}
        />

        {/* 11. Customer Testimonials */}
        <Testimonials />

        {/* 12. Newsletter */}
        <Newsletter
          onSubscribe={(email) => showToast(`Subscribed ${email} to Craftinator Community`)}
        />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductModal={(product) => {
          setIsWishlistOpen(false);
          setActiveProductModal(product);
        }}
      />

      <ProductModal
        product={activeProductModal}
        isOpen={!!activeProductModal}
        onClose={() => setActiveProductModal(null)}
        isWishlisted={activeProductModal ? wishlist.includes(activeProductModal.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <ArtisanModal
        artisan={activeArtisanModal}
        isOpen={!!activeArtisanModal}
        onClose={() => setActiveArtisanModal(null)}
        onAddToCart={handleAddToCart}
        onOpenProductModal={(product) => {
          setActiveArtisanModal(null);
          setActiveProductModal(product);
        }}
      />

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalConfig.isOpen}
        mode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })}
        onAuthSuccess={(msg) => showToast(msg)}
      />

      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />

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
