import React, { useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigate
}) {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  useBodyScrollLock(isOpen, {
    containerRef,
    backdropRef,
    onClose,
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div ref={backdropRef} className="drawer-backdrop" onClick={onClose}>
      <div ref={containerRef} className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <ShoppingBag size={20} className="header-icon" />
            <h3>{t('cart_title')}</h3>
            <span className="drawer-count">{cartItems.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Shipping Note */}
        <div className="shipping-banner">
          <p className="shipping-text">
            {t('free_shipping_note')}
          </p>
        </div>

        {/* Cart Items List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="drawer-empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h4>{t('cart_empty')}</h4>
              <button className="btn btn-primary" onClick={onClose}>
                {t('nav_explore')}
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        className="cart-remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span className="cart-item-artisan">{t('by')} {item.artisan}</span>

                    <div className="cart-item-bottom">
                      <div className="qty-control">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>{t('subtotal')}</span>
              <strong className="subtotal-amount">₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>

            <button
              type="button"
              className="btn btn-outline view-cart-page-btn"
              onClick={() => {
                onClose();
                if (onNavigate) {
                  onNavigate('/cart');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <span>{t('view_cart_page', 'View Cart Page')}</span>
            </button>

            <button className="btn btn-terracotta checkout-btn" onClick={onCheckout}>
              <span>{t('checkout')}</span>
              <ArrowRight size={18} />
            </button>

            <div className="secure-badge">
              <ShieldCheck size={16} />
              <span>100% {t('bv_1_title')}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
