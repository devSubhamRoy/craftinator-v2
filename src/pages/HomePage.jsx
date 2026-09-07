import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/* Global Section Components */
import Hero from '../components/Hero';
import BrandValues from '../components/BrandValues';
import ShopByCategory from '../components/ShopByCategory';
import TrendingProducts from '../components/TrendingProducts';
import MeetMakers from '../components/MeetMakers';
import CommunitySection from '../components/CommunitySection';
import StoryBanner from '../components/StoryBanner';
import PersonalizedDiscovery from '../components/PersonalizedDiscovery';
import SellerCTA from '../components/SellerCTA';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

/* Datasets */
import { artisans } from '../data/artisans';

export default function HomePage({
  wishlist,
  onToggleWishlist,
  onOpenProductModal,
  onAddToCart,
  onOpenArtisanModal,
  onNavigate,
  showToast
}) {
  const { t } = useLanguage();

  return (
    <div className="homepage-root">
      {/* 1. Hero Section */}
      <Hero
        onShopClick={() => onNavigate && onNavigate('/shop')}
        onArtisansClick={() => {
          const el = document.getElementById('meet-makers');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Brand Core Values */}
      <BrandValues />

      {/* 3. Shop by Category Carousel */}
      <ShopByCategory
        onSelectCategory={(category) => {
          onNavigate && onNavigate('/shop');
        }}
      />

      {/* 4. Curated Trending Products Grid */}
      <TrendingProducts
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        onOpenProductModal={onOpenProductModal}
        onAddToCart={onAddToCart}
        onExploreAllClick={() => onNavigate && onNavigate('/shop')}
      />

      {/* 5. Meet the Makers / Artisan Grid */}
      <MeetMakers
        onOpenArtisanModal={onOpenArtisanModal}
      />

      {/* 6. Maker Community Interactive Feed */}
      <CommunitySection
        onExploreClick={() => onNavigate && onNavigate('/shop')}
      />

      {/* 7. Craft Heritage Story Banner */}
      <StoryBanner
        onOpenStoryModal={() => showToast && showToast(t('story_modal_title'))}
      />

      {/* 8. Personalized Style Aesthetic Discovery */}
      <PersonalizedDiscovery
        onFilterByStyle={(style) => {
          onNavigate && onNavigate('/shop');
        }}
      />

      {/* 9. Artisan Seller Onboarding CTA */}
      <SellerCTA
        onStartSelling={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
      />

      {/* 10. Customer Community Testimonials */}
      <Testimonials />

      {/* 11. Craftinator Community Newsletter */}
      <Newsletter
        onSubscribe={(email) => showToast && showToast(`Subscribed ${email} to Craftinator Community`)}
      />
    </div>
  );
}
