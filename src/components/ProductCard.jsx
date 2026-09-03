import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenProductModal,
  onAddToCart
}) {
  const { t } = useLanguage();

  return (
    <div className="product-card">
      
      {/* Card Top Media Container */}
      <div className="product-media" onClick={() => onOpenProductModal && onOpenProductModal(product)}>
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
            onToggleWishlist && onToggleWishlist(product.id);
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
            onAddToCart && onAddToCart(product);
          }}
        >
          <ShoppingBag size={15} />
          <span>{t('add_to_cart')}</span>
        </button>
      </div>

      {/* Card Body Information */}
      <div className="product-info" onClick={() => onOpenProductModal && onOpenProductModal(product)}>
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
}
