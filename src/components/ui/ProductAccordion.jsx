import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Leaf,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function ProductAccordion({
  product,
  maker,
  productReviewsList = [],
  t
}) {
  // Exclusive single-open accordion state ('highlights' | 'all_details' | 'protection' | null)
  const [openAccordion, setOpenAccordion] = useState('all_details');

  // Sub-tabs inside "All details" ('showcase' | 'specifications' | 'care' | 'reviews')
  const [activeSubTab, setActiveSubTab] = useState('showcase');

  // Show More toggle state for Showcase / Content expansion
  const [isShowMoreExpanded, setIsShowMoreExpanded] = useState(false);

  // Reviews Slider Scroll Ref & Handler
  const reviewsTrackRef = useRef(null);
  const handleScrollReviews = (dir) => {
    if (reviewsTrackRef.current) {
      const scrollAmount = reviewsTrackRef.current.clientWidth * 0.75;
      reviewsTrackRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  if (!product) return null;

  return (
    <div className="product-accordion-container">
      {/* 1. Accordion Item: Product Highlights */}
      <div className={`accordion-row-item ${openAccordion === 'highlights' ? 'is-expanded' : ''}`}>
        <button
          type="button"
          className="accordion-row-header"
          onClick={() => toggleAccordion('highlights')}
          aria-expanded={openAccordion === 'highlights'}
        >
          <div className="accordion-header-text">
            <h3 className="accordion-item-title">
              {t('accordion_highlights_title', 'Product highlights')}
            </h3>
            <p className="accordion-item-subtitle">
              {t('accordion_highlights_sub', 'Key product attributes and feature details')}
            </p>
          </div>
          <div className="accordion-icon-box">
            {openAccordion === 'highlights' ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>
        </button>

        {openAccordion === 'highlights' && (
          <div className="accordion-row-body">
            <ul className="highlights-feature-list">
              <li>
                <strong>{t('highlight_artisan_origin', 'Artisan Origin')}:</strong> {product.artisan} ({product.artisanCity})
              </li>
              <li>
                <strong>{t('highlight_material', 'Primary Medium')}:</strong> {product.materials?.join(', ') || product.category}
              </li>
              <li>
                <strong>{t('highlight_style', 'Aesthetic Style')}:</strong> {product.styleTag} Handcrafted
              </li>
              <li>
                <strong>{t('highlight_dimensions', 'Dimensions')}:</strong> {product.dimensions}
              </li>
              <li>
                <strong>{t('highlight_guarantee', 'Quality Guarantee')}:</strong> 100% Studio Handmade & Quality Inspected
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 2. Accordion Item: All Details (With Sub-Tabs) */}
      <div className={`accordion-row-item ${openAccordion === 'all_details' ? 'is-expanded' : ''}`}>
        <button
          type="button"
          className="accordion-row-header"
          onClick={() => toggleAccordion('all_details')}
          aria-expanded={openAccordion === 'all_details'}
        >
          <div className="accordion-header-text">
            <h3 className="accordion-item-title">
              {t('accordion_all_details_title', 'All details')}
            </h3>
            <p className="accordion-item-subtitle">
              {t('accordion_all_details_sub', 'Complete craft story, specifications, care guide & reviews')}
            </p>
          </div>
          <div className="accordion-icon-box">
            {openAccordion === 'all_details' ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>
        </button>

        {openAccordion === 'all_details' && (
          <div className="accordion-row-body">
            {/* Horizontal Pill Sub-Tabs Navigation */}
            <div className="accordion-subtabs-nav" role="tablist">
              <button
                type="button"
                className={`subtab-pill-btn ${activeSubTab === 'showcase' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('showcase')}
                role="tab"
                aria-selected={activeSubTab === 'showcase'}
              >
                {t('subtab_showcase', 'Showcase')}
              </button>
              <button
                type="button"
                className={`subtab-pill-btn ${activeSubTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('specifications')}
                role="tab"
                aria-selected={activeSubTab === 'specifications'}
              >
                {t('subtab_specifications', 'Specifications')}
              </button>
              <button
                type="button"
                className={`subtab-pill-btn ${activeSubTab === 'care' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('care')}
                role="tab"
                aria-selected={activeSubTab === 'care'}
              >
                {t('subtab_care', 'Care Guide')}
              </button>
              <button
                type="button"
                className={`subtab-pill-btn ${activeSubTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('reviews')}
                role="tab"
                aria-selected={activeSubTab === 'reviews'}
              >
                {t('subtab_reviews', 'Reviews')} ({product.reviewsCount})
              </button>
            </div>

            {/* Sub-Tab Panel Content */}
            <div className="subtab-panel-content">
              {/* 1. Showcase Subtab */}
              {activeSubTab === 'showcase' && (
                <div className="subtab-showcase-view">
                  {/* Hero Showcase Banner */}
                  <div className="showcase-banner-card">
                    <div className="showcase-banner-overlay">
                      <span className="showcase-badge">{product.category}</span>
                      <h4 className="showcase-headline">
                        {t('showcase_tagline', 'Future-crafted with Human Soul')}
                      </h4>
                      <p className="showcase-description">
                        With traditional vision and precision craftsmanship, {product.artisan} shapes an enduring heritage piece for contemporary living spaces.
                      </p>
                    </div>

                    {maker?.studioImage ? (
                      <img
                        src={maker.studioImage}
                        alt={`${maker.name} studio showcase`}
                        className="showcase-bg-image"
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="showcase-bg-image"
                      />
                    )}
                  </div>

                  {/* Text Details & Expandable Story */}
                  <div className="showcase-story-block">
                    <p className="showcase-story-paragraph">
                      {product.description}
                    </p>

                    {isShowMoreExpanded && (
                      <div className="expanded-story-details">
                        <p>
                          {t('craft_narrative_p2', 'Each creation is individually shaped in independent artisan studios. Because natural materials respond uniquely to heat and touch, minor textural variances are celebrated as the hallmark of authentic handcrafted art.')}
                        </p>
                        {maker?.bio && (
                          <blockquote className="showcase-quote">
                            "{maker.bio}" — <strong>{maker.name}</strong>
                          </blockquote>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Show More / Show Less Toggle Button */}
                  <button
                    type="button"
                    className="btn-show-more-toggle"
                    onClick={() => setIsShowMoreExpanded((prev) => !prev)}
                  >
                    <span>{isShowMoreExpanded ? t('show_less', 'Show Less') : t('show_more', 'Show More')}</span>
                    <ChevronRight
                      size={16}
                      style={{
                        transform: isShowMoreExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                </div>
              )}

              {/* 2. Specifications Subtab */}
              {activeSubTab === 'specifications' && (
                <div className="subtab-specs-view">
                  <div className="specs-table-grid">
                    <div className="specs-row">
                      <span className="specs-label">{t('spec_artisan', 'Artisan Maker')}</span>
                      <span className="specs-value">{product.artisan}</span>
                    </div>
                    <div className="specs-row">
                      <span className="specs-label">{t('spec_city', 'Studio Location')}</span>
                      <span className="specs-value">{product.artisanCity}</span>
                    </div>
                    <div className="specs-row">
                      <span className="specs-label">{t('spec_materials', 'Natural Mediums')}</span>
                      <span className="specs-value">{product.materials?.join(', ') || 'Natural Clay & Organic Glaze'}</span>
                    </div>
                    <div className="specs-row">
                      <span className="specs-label">{t('spec_dimensions', 'Dimensions')}</span>
                      <span className="specs-value">{product.dimensions}</span>
                    </div>
                    <div className="specs-row">
                      <span className="specs-label">{t('spec_stock', 'Studio Stock')}</span>
                      <span className="specs-value">{product.stock} units available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Care Guide Subtab */}
              {activeSubTab === 'care' && (
                <div className="subtab-care-view">
                  <ul className="care-guide-list">
                    <li className="care-guide-item">
                      <CheckCircle2 size={16} className="care-check-icon" />
                      <span>{t('care_item_1', 'Wipe with a soft damp linen cloth; avoid abrasive chemical detergents.')}</span>
                    </li>
                    <li className="care-guide-item">
                      <CheckCircle2 size={16} className="care-check-icon" />
                      <span>{t('care_item_2', 'Keep away from extreme sudden temperature fluctuations.')}</span>
                    </li>
                    <li className="care-guide-item">
                      <CheckCircle2 size={16} className="care-check-icon" />
                      <span>{t('care_item_3', 'Handcrafted with natural organic pigments that mature beautifully over time.')}</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* 4. Reviews Subtab (Horizontal Scroll Slider) */}
              {activeSubTab === 'reviews' && (
                <div className="subtab-reviews-view">
                  <div className="reviews-summary-header">
                    <div className="reviews-score-big">{product.rating}</div>
                    <div className="reviews-score-meta">
                      <div className="reviews-stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#A85838" color="#A85838" />
                        ))}
                      </div>
                      <span className="reviews-count-label">
                        Based on {product.reviewsCount} verified collector ratings
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Slider Track */}
                  <div className="reviews-cards-track" ref={reviewsTrackRef}>
                    {productReviewsList.map((rev) => (
                      <div key={rev.id} className="review-item-card">
                        <div className="review-stars-inline">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} size={13} fill="#A85838" color="#A85838" />
                          ))}
                        </div>
                        <p className="review-quote-text">"{rev.content}"</p>
                        <div className="review-author-line">
                          <strong>{rev.author}</strong> — Verified Buyer
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Artisan Trust Guarantees */}
      <div className="artisan-trust-grid">
        <div className="trust-item">
          <ShieldCheck size={18} className="trust-icon" />
          <span>{t('trust_100_handcrafted', '100% Verified Handcrafted')}</span>
        </div>
        <div className="trust-item">
          <Truck size={18} className="trust-icon" />
          <span>{t('trust_direct_shipping', 'Direct Studio Dispatch')}</span>
        </div>
        <div className="trust-item">
          <RotateCcw size={18} className="trust-icon" />
          <span>{t('trust_returns', '14-Day Artisan Return Guarantee')}</span>
        </div>
        <div className="trust-item">
          <Leaf size={18} className="trust-icon" />
          <span>{t('trust_eco_packaging', 'Plastic-Free Eco Packaging')}</span>
        </div>
      </div>
    </div>
  );
}
