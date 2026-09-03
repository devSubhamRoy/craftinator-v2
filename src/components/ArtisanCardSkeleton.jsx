import React from 'react';
import '../styles/ArtisanCardSkeleton.css';

export default function ArtisanCardSkeleton() {
  return (
    <div className="artisan-card artisan-card-skeleton" aria-hidden="true">
      {/* Studio Image Skeleton */}
      <div className="artisan-image-wrapper skeleton-artisan-img-wrapper">
        <div className="artisan-img-clip skeleton-artisan-clip">
          <div className="skeleton-shimmer-sweep" />
          <div className="skeleton-artisan-badge" />
        </div>
        
        {/* Floating Avatar Skeleton */}
        <div className="artisan-avatar skeleton-artisan-avatar">
          <div className="skeleton-shimmer-sweep" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="artisan-content skeleton-artisan-content">
        <div className="skeleton-artisan-meta">
          <div className="skeleton-artisan-line skeleton-artisan-name" />
          <div className="skeleton-artisan-line skeleton-artisan-craft" />
        </div>

        <div className="skeleton-artisan-loc-row">
          <div className="skeleton-artisan-line skeleton-artisan-loc-icon" />
          <div className="skeleton-artisan-line skeleton-artisan-city" />
        </div>

        <div className="skeleton-artisan-quote-group">
          <div className="skeleton-artisan-line skeleton-quote-l1" />
          <div className="skeleton-artisan-line skeleton-quote-l2" />
        </div>

        <div className="skeleton-artisan-line skeleton-artisan-btn" />
      </div>
    </div>
  );
}
