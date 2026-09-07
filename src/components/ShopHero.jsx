import React from 'react';
import { ArrowDown, Sparkles, Flame, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import '../styles/ShopHero.css';

export default function ShopHero({ onNavigateHome, onExploreProductsClick }) {
  const { t } = useLanguage();

  const handleScrollToProducts = () => {
    const el = document.getElementById('explore-all-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (onExploreProductsClick) onExploreProductsClick();
  };

  const handleScrollToTrending = () => {
    const el = document.getElementById('shop-trending');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="shop-hero-section" id="shop-hero">
      <div className="container">
        
        {/* Breadcrumb Navigation - ALWAYS AT THE VERY TOP ACROSS ALL MODES */}
        <nav className="shop-hero-breadcrumb" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={onNavigateHome}>{t('nav_home')}</button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{t('nav_shop')}</span>
        </nav>

        <div className="shop-hero-container">
          
          {/* Visual Showcase Deck (Displays first on Tablet/Mobile below breadcrumbs) */}
          <div className="shop-hero-visual">
            <div className="shop-showcase-stage">
              
              {/* Floating Card 1: Top-Right Trending Item */}
              <div 
                className="shop-float-card-top"
                onClick={handleScrollToProducts}
                role="button"
                tabIndex={0}
              >
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop"
                  alt="Hammered Brass Urn"
                  className="float-card-thumb"
                />
                <div className="float-card-content">
                  <span className="float-card-tag">
                    <Flame size={12} />
                    Trending Item
                  </span>
                  <strong className="float-card-title">Hammered Brass Urn</strong>
                  <span className="float-card-price">$52.00 • In Studio</span>
                </div>
              </div>

              {/* Main Featured Centerpiece Product Card */}
              <div 
                className="shop-spotlight-card"
                onClick={handleScrollToProducts}
                role="button"
                tabIndex={0}
              >
                <div className="shop-spotlight-media">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"
                    alt="Jaipur Fluted Terracotta Amphora Vase"
                    className="shop-spotlight-img"
                    loading="eager"
                  />
                  <span className="shop-spotlight-badge">
                    <Sparkles size={12} />
                    Maker Spotlight • Small Batch
                  </span>
                  <span className="shop-spotlight-price-tag">$68.00</span>
                </div>

                <div className="shop-spotlight-body">
                  <div className="shop-spotlight-maker-row">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
                      alt="Maya Sharma"
                      className="shop-spotlight-avatar"
                    />
                    <div className="shop-spotlight-maker-info">
                      <span className="shop-spotlight-maker-name">Maya Sharma Studio</span>
                      <span className="shop-spotlight-maker-location">Jaipur, Rajasthan</span>
                    </div>
                  </div>

                  <div className="shop-spotlight-title-row">
                    <h3 className="shop-spotlight-title">Jaipur Fluted Terracotta Vase</h3>
                    <div className="shop-spotlight-rating">
                      <Star size={13} fill="#B26A00" color="#B26A00" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Bottom-Left Artisan Specialty */}
              <div 
                className="shop-float-card-bottom"
                onClick={handleScrollToProducts}
                role="button"
                tabIndex={0}
              >
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=300&auto=format&fit=crop"
                  alt="Wild Fig & Pure Beeswax Candle"
                  className="float-card-thumb"
                />
                <div className="float-card-content">
                  <span className="float-card-bottom-tag">🌿 Hand-Poured Soy</span>
                  <strong className="float-card-bottom-title">Wild Fig Candle</strong>
                  <span className="float-card-bottom-price">$34.00 • Rohan Gupta</span>
                </div>
              </div>

            </div>
          </div>

          {/* Headline, Eyebrow & Marketplace Actions */}
          <div className="shop-hero-content">
            <span className="shop-hero-eyebrow">
              <Sparkles size={13} />
              {t('shop_hero_badge')}
            </span>
            
            <h1 className="shop-hero-heading">
              {t('shop_hero_title')} <br />
              <span className="shop-hero-heading-italic">{t('shop_hero_title_italic')}</span>
            </h1>

            <p className="shop-hero-description">
              {t('shop_hero_desc')}
            </p>

            <div className="shop-hero-actions">
              <button
                type="button"
                className="shop-btn-primary"
                onClick={handleScrollToProducts}
              >
                <span>{t('shop_btn_explore')}</span>
                <ArrowDown size={17} />
              </button>

              <button 
                type="button"
                className="shop-btn-secondary"
                onClick={handleScrollToTrending}
              >
                <Flame size={16} style={{ color: '#A85838' }} />
                <span>{t('shop_btn_trending')}</span>
              </button>
            </div>

            {/* Live Studio Status Pill */}
            <div className="shop-live-pulse-pill">
              <span className="live-pulse-dot" />
              <span>{t('shop_live_studios')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
