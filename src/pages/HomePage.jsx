import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

import {
  Hero,
  BrandValues,
  ShopByCategory,
  TrendingProducts,
  MeetMakers,
  CommunitySection,
  StoryBanner,
  PersonalizedDiscovery,
  SellerCTA,
  Testimonials,
  Newsletter,
  LazySection,
  SectionSkeleton
} from '../components';

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
      {/* 1. Hero Section (Immediate - Above the Fold) */}
      <Hero
        onShopClick={() => onNavigate && onNavigate('/shop')}
        onArtisansClick={() => {
          const el = document.getElementById('meet-makers');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Brand Core Values (Immediate - Above the Fold) */}
      <BrandValues />

      {/* 3. Shop by Category Carousel (Lazy Section) */}
      <LazySection
        skeletonVariant="carousel"
        minHeight="360px"
        placeholder={<SectionSkeleton variant="carousel" minHeight="360px" />}
      >
        <ShopByCategory
          onSelectCategory={(category) => {
            onNavigate && onNavigate('/shop');
          }}
        />
      </LazySection>

      {/* 4. Curated Trending Products Grid (Lazy Section) */}
      <LazySection
        skeletonVariant="grid"
        minHeight="540px"
        placeholder={<SectionSkeleton variant="grid" minHeight="540px" />}
      >
        <TrendingProducts
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onOpenProductModal={onOpenProductModal}
          onAddToCart={onAddToCart}
          onExploreAllClick={() => onNavigate && onNavigate('/shop')}
        />
      </LazySection>

      {/* 5. Meet the Makers / Artisan Grid (Lazy Section) */}
      <LazySection
        skeletonVariant="grid"
        minHeight="520px"
        placeholder={<SectionSkeleton variant="grid" minHeight="520px" />}
      >
        <MeetMakers
          onOpenArtisanModal={onOpenArtisanModal}
          onNavigate={onNavigate}
        />
      </LazySection>

      {/* 6. Maker Community Interactive Feed (Lazy Section) */}
      <LazySection
        skeletonVariant="grid"
        minHeight="520px"
        placeholder={<SectionSkeleton variant="grid" minHeight="520px" />}
      >
        <CommunitySection
          onExploreClick={() => onNavigate && onNavigate('/shop')}
        />
      </LazySection>

      {/* 7. Craft Heritage Story Banner (Lazy Section) */}
      <LazySection
        skeletonVariant="banner"
        minHeight="300px"
        placeholder={<SectionSkeleton variant="banner" minHeight="300px" showHeader={false} />}
      >
        <StoryBanner
          onOpenStoryModal={() => showToast && showToast(t('story_modal_title'))}
        />
      </LazySection>

      {/* 8. Personalized Style Aesthetic Discovery (Lazy Section) */}
      <LazySection
        skeletonVariant="grid"
        minHeight="420px"
        placeholder={<SectionSkeleton variant="grid" minHeight="420px" />}
      >
        <PersonalizedDiscovery
          onFilterByStyle={(style) => {
            onNavigate && onNavigate('/shop');
          }}
        />
      </LazySection>

      {/* 9. Artisan Seller Onboarding CTA (Lazy Section) */}
      <LazySection
        skeletonVariant="banner"
        minHeight="280px"
        placeholder={<SectionSkeleton variant="banner" minHeight="280px" showHeader={false} />}
      >
        <SellerCTA
          onStartSelling={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
        />
      </LazySection>

      {/* 10. Customer Community Testimonials (Lazy Section) */}
      <LazySection
        skeletonVariant="banner"
        minHeight="320px"
        placeholder={<SectionSkeleton variant="banner" minHeight="320px" showHeader={false} />}
      >
        <Testimonials />
      </LazySection>

      {/* 11. Craftinator Community Newsletter (Lazy Section) */}
      <LazySection
        skeletonVariant="banner"
        minHeight="240px"
        placeholder={<SectionSkeleton variant="banner" minHeight="240px" showHeader={false} />}
      >
        <Newsletter
          onSubscribe={(email) => showToast && showToast(`Subscribed ${email} to Craftinator Community`)}
        />
      </LazySection>
    </div>
  );
}
