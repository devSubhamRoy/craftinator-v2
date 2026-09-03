import React, { useState, useEffect, useRef } from 'react';
import { artisans } from '../data/artisans';
import { MapPin, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import ArtisanCardSkeleton from './ArtisanCardSkeleton';

export default function MeetMakers({ onOpenArtisanModal }) {
  const { t } = useLanguage();
  const sliderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Initial mount skeleton shimmer effect */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="makers-section" id="meet-makers">
      <div className="container">
        
        {/* Section Header */}
        <div className="makers-header-row">
          <div className="section-header text-left">
            <span className="eyebrow">{t('nav_makers')}</span>
            <h2 className="heading-lg section-title">{t('makers_title')}</h2>
            <p className="paragraph-lg section-subtitle">
              {t('makers_subtitle')}
            </p>
          </div>
        </div>

        {/* Artisans Horizontal Row Slider */}
        <div className="makers-slider-wrapper">
          <div className="artisan-carousel-track" ref={sliderRef}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <ArtisanCardSkeleton key={`artisan-skeleton-${idx}`} />
              ))
            ) : (
              artisans.map((artisan) => (
              <div
                key={artisan.id}
                className="artisan-card"
                onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisan)}
              >
                {/* Studio / Portrait Image Container with Unclipped Avatar */}
                <div className="artisan-image-wrapper">
                  <div className="artisan-img-clip">
                    <img
                      src={artisan.studioImage}
                      alt={`${artisan.name} working in studio`}
                      className="artisan-img img-cover"
                      loading="lazy"
                    />
                    <div className="artisan-overlay" />
                    {/* Badge */}
                    <span className="artisan-badge">{artisan.badge}</span>
                  </div>
                  
                  {/* Floating Avatar (Unclipped & Sharp) */}
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="artisan-avatar"
                  />
                </div>

                {/* Content */}
                <div className="artisan-content">
                  <div className="artisan-meta">
                    <h3 className="artisan-name">{artisan.name}</h3>
                    <span className="artisan-craft">{artisan.craft}</span>
                  </div>

                  <div className="artisan-location">
                    <MapPin size={14} className="location-icon" />
                    <span>{artisan.city}, {artisan.state}</span>
                  </div>

                  <p className="artisan-quote">"{artisan.quote}"</p>

                  <button className="artisan-profile-btn">
                    <span>{t('nav_makers')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Floating Left Arrow Control */}
          <button className="makers-slider-arrow makers-slider-arrow-prev" onClick={handleScrollPrev} aria-label="Previous artisans">
            <ChevronLeft size={20} className="side" />
          </button>

          {/* Floating Right Arrow Control */}
          <button className="makers-slider-arrow makers-slider-arrow-next" onClick={handleScrollNext} aria-label="Next artisans">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom Centered CTA Button */}
        <div className="makers-bottom-cta text-center">
          <button
            className="btn btn-primary btn-more-artisans"
            onClick={() => onOpenArtisanModal && onOpenArtisanModal(artisans[0])}
          >
            <span>{t('makers_title')}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
