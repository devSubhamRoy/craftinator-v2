import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ArtisanModal({
  artisan,
  isOpen = true,
  onClose,
  onAddToCart,
  onOpenProductModal,
  onNavigateToArtisan
}) {
  const { t } = useLanguage();
  if (!isOpen || !artisan) return null;

  const artisanProducts = products.filter(p => p.artisan === artisan.name);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container artisan-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        {/* Hero Header Banner */}
        <div className="artisan-modal-hero">
          <img src={artisan.studioImage} alt={artisan.name} className="artisan-hero-img img-cover" />
          <div className="artisan-hero-overlay" />
          
          <div className="artisan-hero-content">
            <img src={artisan.avatar} alt={artisan.name} className="artisan-modal-avatar" />
            <div className="artisan-modal-header-text">
              <span className="artisan-modal-badge">{artisan.badge}</span>
              <h2 className="heading-md artisan-modal-title">{artisan.name}</h2>
              <span className="artisan-modal-craft">{artisan.craft} • {artisan.city}, {artisan.state}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="artisan-modal-body">
          <div className="artisan-bio-block">
            <h4 className="block-title">{t('story_badge')}</h4>
            <p className="artisan-bio-text">{artisan.bio}</p>
            
            <blockquote className="artisan-quote-box">
              "{artisan.quote}"
            </blockquote>
          </div>

          {/* Featured Craft Products */}
          <div className="artisan-products-block">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 className="block-title" style={{ margin: 0 }}>{t('makers_title')} — {artisan.name}</h4>
              {onNavigateToArtisan && (
                <button
                  type="button"
                  onClick={() => {
                    onClose && onClose();
                    onNavigateToArtisan();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-terracotta)',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{t('view_full_profile', 'View Full Profile')}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
            <div className="artisan-products-mini-grid">
              {artisanProducts.map((prod) => (
                <div key={prod.id} className="mini-product-card" onClick={() => onOpenProductModal(prod)}>
                  <img src={prod.image} alt={prod.name} className="mini-prod-img" />
                  <div className="mini-prod-info">
                    <h5>{prod.name}</h5>
                    <span>₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {onNavigateToArtisan && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-terracotta"
                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => {
                  onClose && onClose();
                  onNavigateToArtisan();
                }}
              >
                <span>{t('visit_artisan_studio_page', 'Explore Full Artisan Studio Page')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

