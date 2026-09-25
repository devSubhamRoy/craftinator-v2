import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  ShieldCheck, 
  HeartHandshake, 
  RotateCcw, 
  Tag, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  AlertCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { products as allProducts } from '../data/products';
import { ProductCard } from '../components';

const FREE_SHIPPING_THRESHOLD = 4000;
const STANDARD_SHIPPING_FEE = 150;

export default function CartPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onCheckout,
  wishlist = [],
  onToggleWishlist,
  onOpenProductModal,
  onOpenArtisanModal,
  onNavigate,
  showToast
}) {
  const { t } = useLanguage();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(appliedCoupon.value, subtotal);
  }, [subtotal, appliedCoupon]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Handle coupon apply
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === 'CRAFT10') {
      setAppliedCoupon({ code: 'CRAFT10', discountDesc: '10% Artisan Guild Discount', type: 'percent', value: 10 });
      setCouponCode('');
      if (showToast) showToast('Coupon CRAFT10 applied: 10% OFF!');
    } else if (trimmed === 'HANDMADE500' && subtotal >= 2500) {
      setAppliedCoupon({ code: 'HANDMADE500', discountDesc: '₹500 Atelier Welcome', type: 'fixed', value: 500 });
      setCouponCode('');
      if (showToast) showToast('Coupon HANDMADE500 applied: ₹500 OFF!');
    } else if (trimmed === 'HANDMADE500') {
      setCouponError('Minimum cart value of ₹2,500 required for HANDMADE500');
    } else {
      setCouponError('Invalid coupon code. Try "CRAFT10" or "HANDMADE500"');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    if (showToast) showToast('Coupon removed');
  };

  // Move to wishlist helper
  const handleMoveToWishlist = (item) => {
    if (onToggleWishlist && !wishlist.includes(item.id)) {
      onToggleWishlist(item.id);
    }
    if (onRemoveItem) {
      onRemoveItem(item.id);
    }
    if (showToast) {
      showToast(`${item.name} moved to your Saved Wishlist`);
    }
  };

  // Recommended products for empty state and cart upselling
  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((c) => c.id));
    return allProducts.filter((p) => !cartIds.has(p.id)).slice(0, 4);
  }, [cartItems]);

  return (
    <main className="cart-page-root animate-fade-in" id="cart-content">
      <div className="container">

        {/* 1. Breadcrumb Trail */}
        <nav className="cart-breadcrumb-nav" aria-label="Cart navigation breadcrumbs">
          <button 
            type="button" 
            className="cart-breadcrumb-link" 
            onClick={() => onNavigate && onNavigate('/')}
          >
            {t('nav_home', 'Home')}
          </button>
          <span className="cart-breadcrumb-sep">/</span>
          <span className="cart-breadcrumb-current">{t('cart_title', 'Shopping Cart')}</span>
        </nav>

        {/* 2. Page Header Bar */}
        <div className="cart-page-header">
          <div className="cart-header-title-wrap">
            <h1 className="cart-page-title">
              {t('cart_title', 'Shopping Cart')}
            </h1>
            <span className="cart-total-badge">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button 
            type="button" 
            className="cart-continue-link" 
            onClick={() => onNavigate && onNavigate('/shop')}
          >
            <ArrowLeft size={16} />
            <span>{t('cart_continue_shopping', 'Continue Exploring Crafts')}</span>
          </button>
        </div>

        {/* 3. Conditional Layout: Empty or Active Cart */}
        {cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="cart-empty-state-card">
            <div className="cart-empty-icon-wrap">
              <ShoppingBag size={48} className="cart-empty-icon" />
            </div>
            <h2 className="cart-empty-title">{t('cart_empty', 'Your shopping bag is empty')}</h2>
            <p className="cart-empty-desc">
              Explore our curated marketplace of authentic handmade pottery, textiles, jewelry, and woodcraft direct from master artisans.
            </p>
            <button 
              type="button" 
              className="btn btn-primary cart-empty-btn" 
              onClick={() => onNavigate && onNavigate('/shop')}
            >
              <span>{t('shop_explore_title', 'Explore Handcrafted Collections')}</span>
              <ArrowRight size={18} />
            </button>

            {/* Recommended Products for Empty State */}
            <div className="cart-empty-recommendations">
              <div className="cart-rec-header">
                <Sparkles size={18} color="var(--accent-terracotta)" />
                <h3 className="cart-rec-title">Artisan Treasures You May Love</h3>
              </div>
              <div className="product-grid shop-product-grid">
                {recommendedProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart || ((item) => onUpdateQuantity && onUpdateQuantity(item.id, 1))}
                    onOpenModal={onOpenProductModal}
                    onOpenArtisanModal={onOpenArtisanModal}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CART 2-COLUMN VIEW */
          <div className="cart-layout-grid">
            
            {/* Left Column: Free Shipping Meter & Cart Items Stack */}
            <div className="cart-main-column">

              {/* Free Courier Dispatch Meter */}
              <div className="cart-shipping-meter-card">
                <div className="cart-shipping-meter-header">
                  <div className="cart-shipping-icon-text">
                    <Truck size={19} className="cart-truck-icon" />
                    <span className="cart-shipping-status-text">
                      {isFreeShipping ? (
                        <strong>🎉 You've unlocked Free Artisan Courier Delivery!</strong>
                      ) : (
                        <>Add <strong>₹{shippingRemaining.toLocaleString('en-IN')}</strong> more for <strong>Free Express Courier</strong></>
                      )}
                    </span>
                  </div>
                  <span className="cart-shipping-percent">{shippingProgress}%</span>
                </div>

                <div className="cart-shipping-progress-track">
                  <div 
                    className="cart-shipping-progress-fill" 
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="cart-items-card">
                <div className="cart-items-table-header">
                  <span className="col-product">Product & Artisan</span>
                  <span className="col-price">Unit Price</span>
                  <span className="col-qty">Quantity</span>
                  <span className="col-total">Line Total</span>
                </div>

                <ul className="cart-items-list-root">
                  {cartItems.map((item) => {
                    const lineTotal = (item.price || 0) * (item.quantity || 1);
                    return (
                      <li key={item.id} className="cart-row-item">
                        
                        {/* Item Media & Info */}
                        <div className="cart-row-main">
                          <div 
                            className="cart-row-img-box"
                            onClick={() => onOpenProductModal && onOpenProductModal(item)}
                            role="button"
                            tabIndex={0}
                            title={`View details for ${item.name}`}
                          >
                            <img src={item.image} alt={item.name} className="cart-row-img" />
                            {item.badge && (
                              <span className="cart-row-badge">{item.badge}</span>
                            )}
                          </div>

                          <div className="cart-row-meta">
                            <h3 
                              className="cart-row-title"
                              onClick={() => onOpenProductModal && onOpenProductModal(item)}
                            >
                              {item.name}
                            </h3>

                            {item.artisan && (
                              <div className="cart-row-artisan">
                                <span className="by-label">By</span>
                                <span 
                                  className="artisan-name"
                                  onClick={() => onOpenArtisanModal && onOpenArtisanModal({ name: item.artisan, city: item.artisanCity })}
                                >
                                  {item.artisan}
                                </span>
                                <CheckCircle2 size={13} fill="#2563EB" color="#FFFFFF" />
                                {item.artisanCity && (
                                  <span className="artisan-city">• {item.artisanCity}</span>
                                )}
                              </div>
                            )}

                            {/* Mobile Price Display */}
                            <div className="cart-row-mobile-price">
                              <span className="mobile-price-num">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                            </div>

                            {/* Actions: Move to Wishlist / Remove */}
                            <div className="cart-row-actions">
                              <button
                                type="button"
                                className="cart-action-btn wish-btn"
                                onClick={() => handleMoveToWishlist(item)}
                                title="Save for later"
                              >
                                <Heart size={14} fill={wishlist.includes(item.id) ? "var(--accent-terracotta)" : "none"} />
                                <span>Move to Wishlist</span>
                              </button>

                              <span className="cart-action-sep">•</span>

                              <button
                                type="button"
                                className="cart-action-btn remove-btn"
                                onClick={() => onRemoveItem && onRemoveItem(item.id)}
                                title="Remove item"
                              >
                                <Trash2 size={14} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Unit Price (Tablet & Desktop) */}
                        <div className="cart-row-unit-price">
                          <span>₹{(item.price || 0).toLocaleString('en-IN')}</span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="cart-row-quantity">
                          <div className="cart-qty-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                            <button
                              type="button"
                              className="cart-qty-btn minus"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQuantity(item.id, item.quantity - 1);
                                } else {
                                  onRemoveItem(item.id);
                                }
                              }}
                              aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Decrease quantity of ${item.name}`}
                            >
                              {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={14} />}
                            </button>
                            
                            <span className="cart-qty-val" aria-live="polite">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="cart-qty-btn plus"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="cart-row-total">
                          <span className="cart-row-total-val">₹{lineTotal.toLocaleString('en-IN')}</span>
                        </div>

                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Artisan Guild Sustainability Note */}
              <div className="cart-sustainability-banner">
                <HeartHandshake size={20} className="sust-icon" />
                <div className="sust-content">
                  <h4 className="sust-title">100% Direct Atelier Proceeds</h4>
                  <p className="sust-desc">
                    88% of your order value goes directly to certified independent studios and master craftsmen without predatory intermediaries.
                  </p>
                </div>
              </div>

              {/* Recommended Up-Sell Carousel */}
              <div className="cart-upsell-section">
                <div className="cart-upsell-header">
                  <h3 className="cart-upsell-title">Pair With Other Artisan Pieces</h3>
                  <button 
                    type="button" 
                    className="cart-upsell-link"
                    onClick={() => onNavigate && onNavigate('/shop')}
                  >
                    <span>View Marketplace</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="product-grid shop-product-grid">
                  {recommendedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      onAddToCart={onAddToCart || ((item) => onUpdateQuantity && onUpdateQuantity(item.id, 1))}
                      onOpenModal={onOpenProductModal}
                      onOpenArtisanModal={onOpenArtisanModal}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Order Summary & Checkout */}
            <aside className="cart-sidebar-column">
              <div className="cart-summary-card">
                
                <h2 className="cart-summary-title">Order Summary</h2>

                {/* Subtotal, Shipping, Discount Rows */}
                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span className="summary-label">Items Subtotal</span>
                    <span className="summary-val">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="cart-summary-row discount-row">
                      <div className="discount-label-wrap">
                        <Tag size={13} color="var(--accent-terracotta)" />
                        <span>{appliedCoupon.code}</span>
                      </div>
                      <span className="discount-val">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="cart-summary-row">
                    <span className="summary-label">Artisan Courier Delivery</span>
                    <span className="summary-val">
                      {isFreeShipping ? (
                        <span className="free-shipping-tag">FREE</span>
                      ) : (
                        `₹${STANDARD_SHIPPING_FEE}`
                      )}
                    </span>
                  </div>

                  <div className="cart-summary-row">
                    <span className="summary-label">Taxes & Atelier Packaging</span>
                    <span className="summary-val calculated-tag">Calculated at checkout</span>
                  </div>
                </div>

                {/* Coupon Input Form */}
                <div className="cart-coupon-block">
                  {appliedCoupon ? (
                    <div className="coupon-active-pill">
                      <div className="coupon-active-left">
                        <Tag size={14} className="coupon-icon" />
                        <div>
                          <strong>{appliedCoupon.code}</strong>
                          <span className="coupon-note">{appliedCoupon.discountDesc}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="coupon-remove-btn" 
                        onClick={handleRemoveCoupon}
                        aria-label="Remove coupon"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
                      <div className="coupon-input-wrap">
                        <Tag size={14} className="coupon-field-icon" />
                        <input
                          type="text"
                          placeholder="Promo or Artisan code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="coupon-input"
                          aria-label="Promo code"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-secondary coupon-apply-btn"
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <div className="coupon-error-msg" role="alert">
                      <AlertCircle size={13} />
                      <span>{couponError}</span>
                    </div>
                  )}
                  
                  {!appliedCoupon && !couponError && (
                    <span className="coupon-hint">Tip: Use <strong>CRAFT10</strong> for 10% off</span>
                  )}
                </div>

                {/* Total Row */}
                <div className="cart-total-row">
                  <div>
                    <span className="cart-total-label">Estimated Total</span>
                    <span className="cart-total-tax-note">Including all craft guild charges</span>
                  </div>
                  <strong className="cart-total-amount">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>

                {/* Checkout Primary Button */}
                <button
                  type="button"
                  className="btn btn-primary cart-checkout-btn"
                  onClick={onCheckout}
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight size={18} />
                </button>

                {/* Security & Guarantees */}
                <div className="cart-trust-badges-list">
                  <div className="cart-trust-item">
                    <ShieldCheck size={16} className="trust-icon" />
                    <span>Bank-grade 256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="cart-trust-item">
                    <HeartHandshake size={16} className="trust-icon" />
                    <span>Direct Artisan Living Wage Verified</span>
                  </div>
                  <div className="cart-trust-item">
                    <RotateCcw size={16} className="trust-icon" />
                    <span>7-Day Return Guarantee on All Standard Crafts</span>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        )}

      </div>

      {/* 4. Mobile Sticky Bottom Checkout Bar (< 768px) */}
      {cartItems.length > 0 && (
        <div className="cart-mobile-sticky-bar" aria-label="Mobile quick checkout bar">
          <div className="mobile-bar-left">
            <span className="mobile-bar-label">Total ({cartItems.length} items)</span>
            <strong className="mobile-bar-price">₹{totalAmount.toLocaleString('en-IN')}</strong>
          </div>
          <button 
            type="button" 
            className="btn btn-primary mobile-bar-checkout-btn"
            onClick={onCheckout}
          >
            <span>Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </main>
  );
}
