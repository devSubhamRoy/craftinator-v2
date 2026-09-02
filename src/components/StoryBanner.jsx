import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function StoryBanner({ onOpenStoryModal }) {
  const { t } = useLanguage();

  return (
    <section className="story-banner-section" id="story-banner">
      <div className="container">
        
        <div className="story-banner-card">
          
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1600&auto=format&fit=crop"
            alt="Artisan hands molding clay on a pottery wheel"
            className="story-banner-bg img-cover"
            loading="lazy"
          />

          {/* Dark Warm Overlay */}
          <div className="story-banner-overlay" />

          {/* Banner Content */}
          <div className="story-banner-content">
            <div className="story-eyebrow-chip">
              <BookOpen size={14} />
              <span>{t('story_badge')}</span>
            </div>

            <h2 className="heading-xl story-title">
              {t('story_title')}
            </h2>

            <p className="story-subtitle">
              {t('story_subtitle')}
            </p>

            <button className="btn btn-white story-cta-btn" onClick={onOpenStoryModal}>
              {t('story_cta')} <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
