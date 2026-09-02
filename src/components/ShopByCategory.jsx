import React, { useRef } from 'react';
import { categories } from '../data/categories';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ShopByCategory({ onSelectCategory }) {
  const { t } = useLanguage();
  const sliderRef = useRef(null);

  const handleScrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="category-section" id="shop-by-category">
      <div className="container">
        
        {/* Category Section Header Row */}
        <div className="category-header-row">
          <div className="category-header-title-group">
            <span className="eyebrow">{t('nav_categories')}</span>
            <h2 className="heading-lg category-main-title">{t('cat_title')}</h2>
          </div>
          <button className="btn btn-primary btn-see-all" onClick={() => onSelectCategory && onSelectCategory(categories[0])}>
            {t('nav_explore')}
          </button>
        </div>

        {/* Carousel Slider Wrapper */}
        <div className="category-slider-wrapper">
          <div className="category-carousel-track" ref={sliderRef}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="craft-category-card"
                onClick={() => onSelectCategory && onSelectCategory(cat)}
              >
                {/* 3-Photo Split Collage Container */}
                <div className="collage-container">
                  {/* Left Main Image */}
                  <div className="collage-left">
                    <img
                      src={cat.mainImage}
                      alt={cat.name}
                      className="collage-img img-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Right Stacked Thumbnails */}
                  <div className="collage-right">
                    <div className="collage-thumb-top">
                      <img
                        src={cat.sideImage1}
                        alt={`${cat.name} thumbnail 1`}
                        className="collage-img img-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="collage-thumb-bottom">
                      <img
                        src={cat.sideImage2}
                        alt={`${cat.name} thumbnail 2`}
                        className="collage-img img-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Clean Category Info */}
                <div className="craft-card-info">
                  <h3 className="craft-card-title">{cat.name}</h3>
                  <p className="craft-card-tagline">{cat.tagline}</p>
                  <span className="craft-card-count">{cat.itemCount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Right Arrow Button */}
          <button className="category-slider-arrow" onClick={handleScrollNext} aria-label="Next categories">
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}
