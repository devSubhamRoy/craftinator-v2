import React, { useState } from 'react';
import { testimonials } from '../data/testimonials';
import { Star, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // 4x duplicated items for 100% seamless infinite loop without blank gaps
  const marqueeTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">{t('testimonials_title')}</span>
          <h2 className="heading-lg section-title">{t('testimonials_title')}</h2>
          <p className="paragraph-lg section-subtitle">
            {t('testimonials_subtitle')}
          </p>
        </div>

        {/* Continuous Auto-Moving Marquee Track (Like Brand Values) */}
        <div
          className="testimonials-marquee-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          <div className={`testimonials-marquee-track ${isPaused ? 'is-paused' : ''}`}>
            {marqueeTestimonials.map((item, index) => (
              <div key={`${item.id}-${index}`} className="testimonial-card marquee-card">
                
                {/* Star Rating & Verified Badge */}
                <div className="testimonial-card-header">
                  <div className="testimonial-stars">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#A85838" color="#A85838" />
                    ))}
                  </div>
                  <span className="verified-badge">
                    <CheckCircle2 size={13} className="verified-icon" /> Verified Buyer
                  </span>
                </div>

                {/* Quote text */}
                <p className="testimonial-quote">"{item.quote}"</p>

                {/* Author Footer */}
                <div className="testimonial-author">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="author-avatar"
                  />
                  <div className="author-details">
                    <strong className="author-name">{item.author}</strong>
                    <span className="author-meta">{item.city} • {item.purchasedItem}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
