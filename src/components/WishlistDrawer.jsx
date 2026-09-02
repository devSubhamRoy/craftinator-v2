import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { useLanguage } from '../i18n/LanguageContext';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal
}) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <Heart size={20} className="header-icon" fill="#A85838" />
            <h3>{t('wishlist_title')}</h3>
            <span className="drawer-count">{wishlistedProducts.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="drawer-body">
          {wishlistedProducts.length === 0 ? (
            <div className="drawer-empty-state">
              <Heart size={48} className="empty-icon" />
              <h4>{t('wishlist_empty')}</h4>
              <button className="btn btn-primary" onClick={onClose}>
                {t('nav_explore')}
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {wishlistedProducts.map((product) => (
                <li key={product.id} className="cart-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-img"
                    onClick={() => onOpenProductModal(product)}
                  />
                  
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h4
                        className="cart-item-title"
                        onClick={() => onOpenProductModal(product)}
                      >
                        {product.name}
                      </h4>
                      <button
                        className="cart-remove-btn"
                        onClick={() => onToggleWishlist(product.id)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span className="cart-item-artisan">{t('by')} {product.artisan} • {product.artisanCity}</span>

                    <div className="cart-item-bottom">
                      <span className="cart-item-price">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>

                      <button
                        className="btn btn-primary move-to-cart-btn"
                        onClick={() => {
                          onAddToCart(product);
                          onToggleWishlist(product.id);
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>{t('add_to_cart')}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
