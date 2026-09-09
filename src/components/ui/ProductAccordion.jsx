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

  // Showcase Subtab Image Slider & Touch Swipe State
  const [currentShowcaseSlide, setCurrentShowcaseSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const showcaseImages = [
    maker?.studioImage && {
      src: maker.studioImage,
      caption: `${maker.name} working inside the studio`
    },
    product?.image && {
      src: product.image,
      caption: `${product.name} — Studio details`
    },
    {
      src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
      caption: "Authentic studio craftsmanship & hand finishing"
    }
  ].filter(Boolean);

  const handleNextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentShowcaseSlide((prev) => (prev + 1) % showcaseImages.length);
  };

  const handlePrevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentShowcaseSlide((prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length);
  };

  const handleSliderTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleSliderTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (diffX < -30) {
      handleNextSlide();
    } else if (diffX > 30) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

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
                  {/* Left Column: Text Details (Scrollable Up-Down) */}
                  <div className="showcase-text-col">
                    <h3 className="showcase-grid-title">
                      {t('showcase_headline', 'Shaped with Human Soul & Heritage')}
                    </h3>

                    <div className="showcase-text-scrollable">
                      {/* Desktop Full Description */}
                      <p className="showcase-paragraph showcase-desktop-desc">
                        {product.description}
                      </p>

                      {/* Mobile/Tablet Description (Truncated to 110 chars when collapsed) */}
                      <p className="showcase-paragraph showcase-mobile-desc">
                        {!isShowMoreExpanded ? (
                          <>
                            <span>
                              {product.description.length > 110
                                ? `${product.description.slice(0, 110)}... `
                                : product.description}
                            </span>
                            {product.description.length > 110 && (
                              <button
                                type="button"
                                className="inline-more-btn"
                                onClick={() => setIsShowMoreExpanded(true)}
                              >
                                More
                              </button>
                            )}
                          </>
                        ) : (
                          <span>{product.description}</span>
                        )}
                      </p>

                      {/* Smooth expandable container for remaining story details, quote & Show Less button */}
                      <div className={`showcase-expandable-content ${isShowMoreExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                        <div className="showcase-expandable-inner">
                          <p className="showcase-paragraph">
                            {t('craft_narrative_p2', 'Each creation is individually shaped in independent artisan studios. Because natural materials respond uniquely to heat and touch, minor textural variances are celebrated as the hallmark of authentic handcrafted art.')}
                          </p>
                          {maker?.bio && (
                            <p className="showcase-paragraph">
                              {maker.bio}
                            </p>
                          )}

                          <div className="showcase-quote-accent">
                            <strong>{maker?.name || product.artisan}: </strong>
                            <em>"{maker?.quote || maker?.bio || 'Specializing in recycled sterling silver and botanical impression metalsmithing. Collaborates directly with tribal silversmiths to preserve endangered casting techniques.'}"</em>
                          </div>

                          {/* Show Less button aligned to the right */}
                          <div className="showcase-less-wrapper">
                            <button
                              type="button"
                              className="btn-show-less-inline"
                              onClick={() => setIsShowMoreExpanded(false)}
                            >
                              <span>{t('show_less', 'Show Less')}</span>
                              <ChevronUp size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image Showcase Card with Slider (Left-Right Swipe) */}
                  <div className="showcase-media-col">
                    <div className="showcase-slider-card">
                      <div
                        className="showcase-slider-frame"
                        onTouchStart={handleSliderTouchStart}
                        onTouchEnd={handleSliderTouchEnd}
                      >
                        <img
                          src={showcaseImages[currentShowcaseSlide]?.src || product.image}
                          alt={showcaseImages[currentShowcaseSlide]?.caption || product.name}
                          className="showcase-slider-img img-cover"
                        />

                        {showcaseImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="showcase-slide-arrow arrow-left"
                              onClick={handlePrevSlide}
                              aria-label="Previous image"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              type="button"
                              className="showcase-slide-arrow arrow-right"
                              onClick={handleNextSlide}
                              aria-label="Next image"
                            >
                              <ChevronRight size={16} />
                            </button>

                            <div className="showcase-slide-dots">
                              {showcaseImages.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`dot ${idx === currentShowcaseSlide ? 'active' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentShowcaseSlide(idx);
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="showcase-card-caption">
                        <span>
                          {showcaseImages[currentShowcaseSlide]?.caption || `${maker?.name || product.artisan} working inside the studio`}
                        </span>
                      </div>
                    </div>
                  </div>
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
