import React from 'react';
import { artisans } from '../data/artisans';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function MeetMakers({ onOpenArtisanModal }) {
  const { t } = useLanguage();

  return (
    <section className="makers-section" id="meet-makers">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">{t('nav_makers')}</span>
          <h2 className="heading-lg section-title">{t('makers_title')}</h2>
          <p className="paragraph-lg section-subtitle">
            {t('makers_subtitle')}
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="artisan-grid">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="artisan-card"
              onClick={() => onOpenArtisanModal(artisan)}
            >
              {/* Studio / Portrait Image Container */}
              <div className="artisan-image-wrapper">
                <img
                  src={artisan.studioImage}
                  alt={`${artisan.name} working in studio`}
                  className="artisan-img img-cover"
                  loading="lazy"
                />
                <div className="artisan-overlay" />
                
                {/* Floating Avatar */}
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="artisan-avatar"
                />
                
                <span className="artisan-badge">{artisan.badge}</span>
              </div>

              {/* Artisan Details */}
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
                  <span>{t('view_artisan')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <div className="text-center makers-bottom-cta">
          <button className="btn btn-secondary btn-more-artisans">
            {t('hero_cta_makers')} <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
