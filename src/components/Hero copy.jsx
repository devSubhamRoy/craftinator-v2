import React from 'react';
import { ArrowRight, Sparkles, Star, Heart, Award, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Hero({ onShopClick, onArtisansClick }) {
  const { t } = useLanguage();

  return (
    <section className="hero-section" id="hero">
      <div className="container hero-container">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="hero-content">
          <span className="eyebrow">{t('hero_badge')}</span>
          
          <h1 className="hero-heading">
            {t('hero_title')}
          </h1>

          <p className="paragraph-lg hero-description">
            {t('hero_subtitle')}
          </p>

          <div className="hero-actions">
            <a href="#trending-products" className="btn btn-primary hero-btn-main" onClick={onShopClick}>
              {t('hero_cta_shop')} <ArrowRight size={18} />
            </a>
            <a href="#meet-makers" className="btn btn-secondary hero-btn-sub" onClick={onArtisansClick}>
              {t('hero_cta_makers')}
            </a>
          </div>

          <div className="hero-slogan-strip">
            <span className="slogan-dot" />
            <span className="slogan-text">Artisans. Community. Connections.</span>
          </div>
        </div>

        {/* Right Column: Premium Studio Showcase Stage */}
        <div className="hero-visual">
          <div className="hero-stage-backdrop" />

          <div className="hero-showcase-stage">
            
            {/* Main Stage Focal Image: Potter Studio */}
            <div className="showcase-main-frame">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1000&auto=format&fit=crop"
                alt="Master artisan shaping clay vase on pottery wheel"
                className="showcase-img img-cover"
                loading="eager"
                fetchpriority="high"
              />
              <div className="showcase-img-overlay" />

              {/* Main Badge */}
              <div className="showcase-main-badge">
                <Sparkles size={15} className="badge-sparkle-icon" />
                <span>{t('hero_badge')}</span>
              </div>
            </div>

            {/* Floating Card 1: Top-Right Artisan Profile Highlight */}
            <div className="showcase-float-card card-artisan-profile">
              <div className="float-card-header">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
                  alt="Maya Sharma"
                  className="float-avatar"
                />
                <div className="float-artist-info">
                  <strong>Maya Sharma</strong>
                  <span><MapPin size={12} inline="true" /> Jaipur, Rajasthan</span>
                </div>
              </div>
              <div className="float-card-body">
                <div className="float-rating flex items-center gap-1">
                  <Star size={13} fill="#A85838" color="#A85838" />
                  <Star size={13} fill="#A85838" color="#A85838" />
                  <Star size={13} fill="#A85838" color="#A85838" />
                  <Star size={13} fill="#A85838" color="#A85838" />
                  <Star size={13} fill="#A85838" color="#A85838" />
                  <strong style={{ fontSize: '0.78rem', marginLeft: '4px' }}>5.0</strong>
                </div>
                <span className="float-tag">{t('master_craftsperson')}</span>
              </div>
            </div>

            {/* Floating Card 2: Bottom-Left Product Showcase Card */}
            <div className="showcase-float-card card-product-highlight">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop"
                alt="Base Botanical Earrings"
                className="float-prod-img"
              />
              <div className="float-prod-info">
                <strong>Base Botanical Earrings</strong>
                <div className="float-prod-footer">
                  <span className="float-price">₹3,995</span>
                  <span className="float-craft-badge">925 Silver</span>
                </div>
              </div>
            </div>

            {/* Floating Pill: Community Counter */}
            <div className="showcase-community-pill">
              <div className="pill-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Maker" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Artisan" />
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Collector" />
              </div>
              <div className="pill-text">
                <strong>12.4k Craft Lovers</strong>
                <span>{t('community_title')}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
