import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, MapPin, Truck, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) {
  const { t } = useLanguage();
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container product-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={22} />
        </button>

        <div className="product-modal-grid">
          
          {/* Left Media */}
          <div className="product-modal-media">
            <img src={product.image} alt={product.name} className="img-cover" />
            {product.badge && <span className="modal-badge">{product.badge}</span>}
          </div>

          {/* Right Content */}
          <div className="product-modal-info">
            
            <div className="modal-artisan-header">
              <MapPin size={14} className="pin-icon" />
              <span>Crafted in {product.artisanCity} {t('by')} <strong>{product.artisan}</strong></span>
            </div>

            <h2 className="heading-md modal-product-title">{product.name}</h2>

            <div className="modal-rating-row">
              <div className="stars flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#A85838" color="#A85838" />
                ))}
              </div>
              <span className="rating-val">{product.rating}</span>
              <span className="rating-count">({product.reviewsCount} reviews)</span>
            </div>

            <div className="modal-price-row">
              <span className="modal-price">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="modal-stock-badge">In Stock ({product.stock} {t('units_left')})</span>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Specs list */}
            <div className="modal-specs">
              <div className="spec-item">
                <strong>Materials:</strong>
                <span>{product.materials.join(', ')}</span>
              </div>
              <div className="spec-item">
                <strong>Dimensions:</strong>
                <span>{product.dimensions}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions-row">
              <button
                className="btn btn-primary modal-add-cart-btn"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
              >
                <ShoppingBag size={18} />
                <span>{t('add_to_cart')} — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              <button
                className={`btn-icon modal-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#A85838' : 'none'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="modal-trust-strip">
              <div className="trust-item">
                <Truck size={16} />
                <span>{t('bv_4_title')}</span>
              </div>
              <div className="trust-item">
                <RotateCcw size={16} />
                <span>{t('bv_1_title')}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
