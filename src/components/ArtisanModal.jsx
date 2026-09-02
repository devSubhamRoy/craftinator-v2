import React from 'react';
import { X } from 'lucide-react';
import { products } from '../data/products';
import { useLanguage } from '../i18n/LanguageContext';

export default function ArtisanModal({ artisan, isOpen, onClose, onAddToCart, onOpenProductModal }) {
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
            <h4 className="block-title">{t('makers_title')} — {artisan.name}</h4>
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
        </div>

      </div>
    </div>
  );
}
