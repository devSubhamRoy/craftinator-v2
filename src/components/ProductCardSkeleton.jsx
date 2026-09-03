import React from 'react';
import '../styles/ProductCardSkeleton.css';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card product-card-skeleton" aria-hidden="true">
      {/* Media skeleton */}
      <div className="product-media skeleton-media">
        <div className="skeleton-shimmer" />
        <div className="skeleton-badge" />
        <div className="skeleton-heart" />
      </div>

      {/* Info skeleton */}
      <div className="product-info skeleton-info">
        <div className="product-meta skeleton-row">
          <div className="skeleton-line skeleton-maker" />
          <div className="skeleton-line skeleton-rating" />
        </div>

        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-title-short" />

        <div className="product-footer skeleton-footer">
          <div className="skeleton-line skeleton-price" />
          <div className="skeleton-line skeleton-location" />
        </div>
      </div>
    </div>
  );
}
