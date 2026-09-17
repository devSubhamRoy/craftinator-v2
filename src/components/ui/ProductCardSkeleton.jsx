import React from 'react';
import '../../styles/ProductCardSkeleton.css';

/**
 * Reusable & Customizable Product Card Skeleton Placeholder
 * Matches exact 3:4 portrait layout, spacing, and inner hierarchy of ProductCard.
 *
 * @param {number} [count=1] - Number of skeleton cards to render
 * @param {string} [className=''] - Additional custom CSS class
 * @param {object} [style={}] - Custom inline styles
 * @param {boolean} [showBadge=true] - Toggle badge pill shimmer
 * @param {boolean} [showHeart=true] - Toggle wishlist heart button shimmer
 * @param {boolean} [showMeta=true] - Toggle maker & rating meta row shimmer
 * @param {boolean} [showLocation=true] - Toggle location badge shimmer
 */
export default function ProductCardSkeleton({
  count = 1,
  className = '',
  style = {},
  showBadge = true,
  showHeart = true,
  showMeta = true,
  showLocation = true
}) {
  const renderSingleCard = (key) => (
    <div
      key={key}
      className={`product-card product-card-skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      {/* Media skeleton matching exact 3:4 portrait ratio */}
      <div className="product-media skeleton-media">
        <div className="skeleton-shimmer" />
        {showBadge && <div className="skeleton-badge" />}
        {showHeart && <div className="skeleton-heart" />}
      </div>

      {/* Info skeleton matching exact .product-info hierarchy */}
      <div className="product-info skeleton-info">
        {showMeta && (
          <div className="product-meta skeleton-row">
            <div className="skeleton-line skeleton-maker" />
            <div className="skeleton-line skeleton-rating" />
          </div>
        )}

        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-title-short" />

        <div className="product-footer skeleton-footer">
          <div className="skeleton-line skeleton-price" />
          {showLocation && <div className="skeleton-line skeleton-location" />}
        </div>
      </div>
    </div>
  );

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) =>
          renderSingleCard(`skeleton-card-${idx}`)
        )}
      </>
    );
  }

  return renderSingleCard('skeleton-single');
}
