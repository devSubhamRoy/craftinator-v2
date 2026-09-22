import React from 'react';
import '../../styles/SectionSkeleton.css';

/**
 * SectionSkeleton
 * Universal skeleton placeholder for lazy-loaded sections.
 *
 * @param {Object} props
 * @param {'grid'|'banner'|'carousel'|'text'} [props.variant='grid'] - Visual layout pattern
 * @param {boolean} [props.showHeader=true] - Whether to render section header placeholder
 * @param {number} [props.cardCount=4] - Number of cards for grid variant
 * @param {string|number} [props.minHeight] - Optional minimum container height to prevent CLS
 * @param {string} [props.className=''] - Additional custom CSS class
 * @param {'center'|'left'} [props.headerAlign='center'] - Header text alignment
 */
export default function SectionSkeleton({
  variant = 'grid',
  showHeader = true,
  cardCount = 4,
  minHeight,
  className = '',
  headerAlign = 'center'
}) {
  const containerStyle = minHeight ? { minHeight } : undefined;

  return (
    <div
      className={`section-skeleton-root ${className}`.trim()}
      style={containerStyle}
      aria-hidden="true"
    >
      {showHeader && (
        <div className={`skel-section-header ${headerAlign === 'left' ? 'align-left' : ''}`}>
          <div className="skel-block skel-eyebrow" />
          <div className="skel-block skel-title" />
          <div className="skel-block skel-subtitle" />
        </div>
      )}

      {variant === 'grid' && (
        <div className="skel-grid-layout">
          {Array.from({ length: cardCount }).map((_, idx) => (
            <div key={`skel-card-${idx}`} className="skel-card-box">
              <div className="skel-block skel-card-media" />
              <div className="skel-block skel-card-line-1" />
              <div className="skel-block skel-card-line-2" />
            </div>
          ))}
        </div>
      )}

      {variant === 'banner' && (
        <div className="skel-block skel-banner-box">
          <div className="skel-block skel-title" style={{ width: '40%' }} />
          <div className="skel-block skel-subtitle" style={{ width: '60%' }} />
        </div>
      )}

      {variant === 'carousel' && (
        <div className="skel-carousel-row">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={`skel-cat-${idx}`} className="skel-carousel-item">
              <div className="skel-block skel-carousel-circle" />
              <div className="skel-block skel-carousel-label" />
            </div>
          ))}
        </div>
      )}

      {variant === 'text' && (
        <div className="skel-text-block">
          <div className="skel-block" style={{ width: '100%', height: '20px' }} />
          <div className="skel-block" style={{ width: '90%', height: '20px' }} />
          <div className="skel-block" style={{ width: '75%', height: '20px' }} />
        </div>
      )}
    </div>
  );
}
