import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ShopHero({ onNavigateHome, onExploreProductsClick }) {
  const { t } = useLanguage();

  return (
    <section className="hero-section shop-hero-override" id="shop-hero">
      <div className="container hero-container">
        
        {/* Photo Collage Visual (Placed first in HTML so it appears first on mobile/tablet) */}
        <div className="hero-visual">
          <div className="hero-collage-grid">
            
            {/* Tile 1: Top Pottery Crafting */}
            <div className="collage-tile tile-pottery">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop"
                alt="Potter shaping handmade clay vase on pottery wheel"
                className="img-cover"
                loading="eager"
                fetchpriority="high"
              />
              <div className="collage-badge badge-top">
                <Sparkles size={14} className="badge-icon" />
                <span>Craftinator Collection</span>
              </div>
            </div>

            {/* Tile 2: Top Right Necklace & Jewelry */}
            <div className="collage-tile tile-jewelry">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop"
                alt="Handcrafted gold and silver botanical pendant necklace"
                className="img-cover"
                loading="eager"
              />
              <div className="collage-badge badge-right">
                <span>Handmade</span>
              </div>
            </div>

            {/* Tile 3: Floating Community Discovery Pill */}
            <div className="collage-floating-pill">
              <div className="pill-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Maker" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Artisan" />
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="Collector" />
              </div>
              <div className="pill-text">
                <strong>12.4k pieces</strong>
                <span>Direct from Artisans</span>
              </div>
            </div>

            {/* Tile 4: Middle Candle & Warm Decor */}
            <div className="collage-tile tile-candle">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop"
                alt="Hand-poured soy wax candles in warm stoneware jar"
                className="img-cover"
                loading="lazy"
              />
            </div>

            {/* Tile 5: Macrame & Woven Textile */}
            <div className="collage-tile tile-macrame">
              <img
                src="https://images.unsplash.com/photo-1528458876861-544fd1761a91?q=80&w=500&auto=format&fit=crop"
                alt="Hand-knotted macrame wall hanging tapestry"
                className="img-cover"
                loading="lazy"
              />
              <div className="collage-artisan-tag">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Elena Fernandes" />
                <div>
                  <strong>Elena F.</strong>
                  <span>Handwoven</span>
                </div>
              </div>
            </div>

            {/* Tile 6: Leatherwork Studio */}
            <div className="collage-tile tile-leather">
              <img
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=500&auto=format&fit=crop"
                alt="Artisan stitching handcrafted leather goods at workbench"
                className="img-cover"
                loading="lazy"
              />
            </div>

          </div>
        </div>

        {/* Editorial Headline, Breadcrumbs & Actions */}
        <div className="hero-content">
          {/* Breadcrumb Navigation */}
          <nav className="shop-hero-breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '0.85rem' }}>
            <button className="breadcrumb-link" onClick={onNavigateHome}>Home</button>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Shop</span>
          </nav>

          <span className="eyebrow">THE CRAFTINATOR COLLECTION</span>
          
          <h1 className="hero-heading">
            Discover Something <br />
            <span className="hero-heading-italic">Truly Handmade.</span>
          </h1>

          <p className="paragraph-lg hero-description">
            Explore thoughtfully crafted pieces from independent artisans — made with skill, character, and a personal maker's touch.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary hero-btn-main"
              onClick={() => {
                const el = document.getElementById('explore-all-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onExploreProductsClick) onExploreProductsClick();
              }}
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn btn-secondary hero-btn-sub" onClick={onNavigateHome}>
              <span>Back to Home</span>
            </button>
          </div>

          <div className="hero-slogan-strip">
            <span className="slogan-dot" />
            <span className="slogan-text">Artisans. Community. Connections.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
