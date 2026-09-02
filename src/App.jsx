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

  /* Mobile Drawer Control */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      showToast('Item removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Saved to your wishlist');
    }
  };

  return (
    <div className="app-root">
      
      {/* 1. Header Navigation */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => showToast(`Cart contains ${cartItems.length} items`)}
        onOpenWishlist={() => showToast(`Wishlist contains ${wishlist.length} items`)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuth={(mode) => showToast(`${mode === 'login' ? 'Log In' : 'Sign Up'} clicked`)}
        onOpenSearch={() => showToast('Search ready: type pottery, candles, jewelry...')}
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
          onOpenProductModal={(product) => showToast(`Selected product: ${product.name}`)}
          onAddToCart={handleAddToCart}
        />

        {/* 6. Meet the Hands Behind the Craft */}
        <MeetMakers
          onOpenArtisanModal={(artisan) => showToast(`Artisan profile: ${artisan.name}`)}
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
          onOpenStoryModal={() => showToast('Artisan craft story loaded')}
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
          onStartSelling={() => showToast('Artisan signup clicked')}
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

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={(mode) => showToast(`${mode === 'login' ? 'Log In' : 'Sign Up'} clicked`)}
      />

      {/* Toast Notification */}
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
