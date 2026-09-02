import React, { useState } from 'react';
import { products } from '../data/products';
import { Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function TrendingProducts({
  wishlist,
  onToggleWishlist,
  onOpenProductModal,
  onAddToCart
}) {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = ['All', 'Pottery & Ceramics', 'Jewelry', 'Woodcraft', 'Textiles', 'Candles'];

  const filteredProducts = selectedFilter === 'All'
    ? products
    : products.filter(p => p.category === selectedFilter);

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
              onClick={() => setSelectedFilter(tab)}
            >
              {tab === 'All' ? t('nav_explore') : tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div key={product.id} className="product-card">
                
                {/* Card Top Media Container */}
                <div className="product-media" onClick={() => onOpenProductModal(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img img-cover"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className="product-card-badge">{product.badge}</span>
                  )}

                  {/* Heart Wishlist Icon */}
                  <button
                    className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isWishlisted ? '#A85838' : 'none'} />
                  </button>

                  {/* Quick Add Overlay Button */}
                  <button
                    className="product-quick-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <ShoppingBag size={15} />
                    <span>{t('add_to_cart')}</span>
                  </button>
                </div>

                {/* Card Body Information */}
                <div className="product-info" onClick={() => onOpenProductModal(product)}>
                  <div className="product-meta">
                    <span className="product-maker-name">{t('by')} {product.artisan}</span>
                    <div className="product-rating">
                      <Star size={13} fill="#A85838" color="#A85838" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="product-title">{product.name}</h3>

                  <div className="product-footer">
                    <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="product-location">{product.artisanCity}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center trending-bottom-cta">
          <button className="btn btn-primary btn-explore-all" onClick={() => setSelectedFilter('All')}>
            {t('hero_cta_shop')} <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
