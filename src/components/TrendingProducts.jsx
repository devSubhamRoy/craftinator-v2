import React, { useState } from 'react';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function TrendingProducts({
  wishlist,
  onToggleWishlist,
  onOpenProductModal,
  onAddToCart,
  onExploreAllClick
}) {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const filterTabs = ['All', 'Pottery & Ceramics', 'Jewelry', 'Woodcraft', 'Textiles', 'Candles'];

  const handleFilterChange = (tab) => {
    if (tab === selectedFilter) return;
    setIsLoading(true);
    setSelectedFilter(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 280);
  };

  const filteredProducts = (
    selectedFilter === 'All'
      ? products.filter(p => p.isTrending)
      : products.filter(p => p.category === selectedFilter)
  ).slice(0, 8);

  return (
    <section className="trending-section" id="trending-products">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">{t('nav_trending')}</span>
          <h2 className="heading-lg section-title">{t('trending_title')}</h2>
          <p className="paragraph-lg section-subtitle">
            {t('trending_subtitle')}
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="product-filter-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              className={`filter-chip ${selectedFilter === tab ? 'active' : ''}`}
              onClick={() => handleFilterChange(tab)}
            >
              {tab === 'All' ? t('nav_explore') : tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={`trending-skeleton-${idx}`} />
            ))
          ) : (
            filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                  onOpenProductModal={onOpenProductModal}
                  onAddToCart={onAddToCart}
                />
              );
            })
          )}
        </div>

        {/* Bottom CTA Button navigating to /shop */}
        <div className="text-center trending-bottom-cta">
          <button
            className="btn btn-primary btn-explore-all"
            onClick={() => onExploreAllClick ? onExploreAllClick() : setSelectedFilter('All')}
          >
            {t('hero_cta_shop')} <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
